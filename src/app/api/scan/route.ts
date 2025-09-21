import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set')
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { image, language = 'ko' } = body

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      )
    }

    console.log('Starting image analysis with language:', language)

    // Create prompt based on language
    const prompts = {
      ko: `
이 제품 이미지를 분석하여 할랄(Halal) 여부를 판별해주세요.

분석 기준:
1. 돼지고기 성분 포함 여부
2. 알코올 성분 포함 여부
3. 젤라틴 등 동물성 성분의 출처
4. 기타 하람(Haram) 성분

응답 형식 (JSON):
{
  "is_halal": true/false (반드시 boolean 값으로),
  "confidence": 0-100,
  "reason": "판별 근거를 한국어로 설명",
  "ingredients_concern": ["문제가 될 수 있는 성분 목록"],
  "recommendation": "대안 제품이나 추가 확인사항 한국어로 안내"
}

이미지에서 성분표나 제품 정보를 읽을 수 없다면 confidence를 낮게 설정하고 이유를 명시해주세요.
`,
      en: `
Please analyze this product image to determine if it is Halal.

Analysis criteria:
1. Presence of pork ingredients
2. Presence of alcohol ingredients
3. Source of gelatin and other animal-derived ingredients
4. Other Haram ingredients

Response format (JSON):
{
  "is_halal": true/false (must be boolean value),
  "confidence": 0-100,
  "reason": "Explanation of the determination in English",
  "ingredients_concern": ["List of potentially problematic ingredients"],
  "recommendation": "Alternative products or additional verification guidance in English"
}

If you cannot read the ingredients list or product information from the image, set confidence low and specify the reason.
`,
      ar: `
يرجى تحليل صورة المنتج هذه لتحديد ما إذا كان حلالاً.

معايير التحليل:
1. وجود مكونات لحم الخنزير
2. وجود مكونات كحولية
3. مصدر الجيلاتين والمكونات الأخرى المشتقة من الحيوانات
4. مكونات حرام أخرى

تنسيق الاستجابة (JSON):
{
  "is_halal": true/false (يجب أن تكون قيمة منطقية),
  "confidence": 0-100,
  "reason": "شرح التحديد باللغة العربية",
  "ingredients_concern": ["قائمة المكونات التي قد تكون مشكلة"],
  "recommendation": "منتجات بديلة أو إرشادات التحقق الإضافية باللغة العربية"
}

إذا لم تتمكن من قراءة قائمة المكونات أو معلومات المنتج من الصورة، اجعل الثقة منخفضة واذكر السبب.
`
    }

    const prompt = prompts[language as keyof typeof prompts] || prompts.ko

    console.log('Calling Claude API...')

    // Call Claude API
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: image.replace(/^data:image\/[a-z]+;base64,/, '')
              }
            }
          ]
        }
      ]
    })

    console.log('Claude API response received')
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    console.log('Response text length:', responseText.length)

    // Parse JSON response
    let analysisResult
    try {
      analysisResult = JSON.parse(responseText)
    } catch (parseError) {
      // If JSON parsing fails, create a fallback response
      analysisResult = {
        is_halal: false,
        confidence: 10,
        reason: "이미지 분석에 실패했습니다. 성분표를 명확히 볼 수 있는 사진으로 다시 시도해주세요.",
        ingredients_concern: ["분석 불가"],
        recommendation: "제품 포장의 성분표 부분을 선명하게 촬영하여 다시 시도하거나, 제조사에 직접 문의하시기 바랍니다."
      }
    }

    // Convert string boolean to actual boolean
    let isHalalBoolean: boolean
    if (typeof analysisResult.is_halal === 'string') {
      isHalalBoolean = analysisResult.is_halal.toLowerCase() === 'true'
    } else {
      isHalalBoolean = Boolean(analysisResult.is_halal)
    }

    // Save scan history to database (optional - won't fail if DB is unavailable)
    try {
      if (prisma) {
        await prisma.scanHistory.create({
        data: {
          productName: analysisResult.product_name || null,
          imageUrl: null, // In a real app, you'd save the image to storage
          isHalal: isHalalBoolean,
          confidence: analysisResult.confidence,
          analysisResult: JSON.stringify(analysisResult),
          reason: analysisResult.reason,
          concernedIngredients: JSON.stringify(analysisResult.ingredients_concern),
          recommendation: analysisResult.recommendation,
          language
        }
        })
        console.log('Scan history saved successfully')
      }
    } catch (dbError) {
      console.error('Failed to save scan history:', dbError)
      // Continue execution - don't fail the API call if DB save fails
    }

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error('Error analyzing image:', error)

    // More detailed error information
    let errorMessage = 'Failed to analyze image'
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        error: 'Failed to analyze image',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}