'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, Loader, CheckCircle, XCircle, AlertTriangle, RotateCcw } from 'lucide-react'
import { AnalysisResult } from '@/types'

interface HalalScannerProps {
  language?: 'ko' | 'en' | 'ar'
}

export default function HalalScanner({ language = 'ko' }: HalalScannerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        setResult(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          language
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(language === 'ko'
        ? '분석 중 오류가 발생했습니다. 다시 시도해주세요.'
        : 'An error occurred during analysis. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const reset = () => {
    setSelectedImage(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const getResultIcon = () => {
    if (!result) return null
    if (result.is_halal) {
      return <CheckCircle className="h-8 w-8 text-green-600" />
    } else {
      return <XCircle className="h-8 w-8 text-red-600" />
    }
  }

  const getResultText = () => {
    if (!result) return ''
    if (language === 'ko') {
      return result.is_halal ? '할랄입니다' : '할랄이 아닙니다'
    } else if (language === 'en') {
      return result.is_halal ? 'Halal' : 'Not Halal'
    } else {
      return result.is_halal ? 'حلال' : 'حرام'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const texts = {
    ko: {
      title: 'AI 할랄 스캐너',
      subtitle: '제품 사진을 업로드하면 AI가 할랄 여부를 분석해드립니다',
      takePhoto: '사진 촬영',
      uploadPhoto: '사진 업로드',
      analyze: '분석하기',
      analyzing: '분석 중...',
      reset: '다시 시작',
      confidence: '신뢰도',
      reason: '판별 근거',
      concernedIngredients: '주의 성분',
      recommendation: '추천사항',
      noIngredients: '문제 성분이 발견되지 않았습니다',
      uploadInstruction: '제품의 성분표가 명확히 보이는 사진을 업로드하세요'
    },
    en: {
      title: 'AI Halal Scanner',
      subtitle: 'Upload a product photo and AI will analyze if it\'s Halal',
      takePhoto: 'Take Photo',
      uploadPhoto: 'Upload Photo',
      analyze: 'Analyze',
      analyzing: 'Analyzing...',
      reset: 'Start Over',
      confidence: 'Confidence',
      reason: 'Reason',
      concernedIngredients: 'Concerned Ingredients',
      recommendation: 'Recommendation',
      noIngredients: 'No problematic ingredients found',
      uploadInstruction: 'Upload a clear photo showing the product ingredients list'
    },
    ar: {
      title: 'ماسح الحلال بالذكاء الاصطناعي',
      subtitle: 'قم بتحميل صورة المنتج وسيحلل الذكاء الاصطناعي ما إذا كان حلالاً',
      takePhoto: 'التقط صورة',
      uploadPhoto: 'تحميل صورة',
      analyze: 'تحليل',
      analyzing: 'جارٍ التحليل...',
      reset: 'ابدأ من جديد',
      confidence: 'الثقة',
      reason: 'السبب',
      concernedIngredients: 'المكونات المثيرة للقلق',
      recommendation: 'التوصية',
      noIngredients: 'لم يتم العثور على مكونات مشكلة',
      uploadInstruction: 'قم بتحميل صورة واضحة تُظهر قائمة مكونات المنتج'
    }
  }

  const t = texts[language]

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-islamic-gold text-white p-6 text-center">
        <Camera className="h-12 w-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
        <p className="text-islamic-gold-light">{t.subtitle}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {!selectedImage ? (
          /* Upload Section */
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-6">
              <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-6">{t.uploadInstruction}</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-islamic-gold text-white rounded-lg hover:bg-islamic-gold/90 transition-colors"
                >
                  <Camera className="h-5 w-5" />
                  <span>{t.takePhoto}</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-600/90 transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  <span>{t.uploadPhoto}</span>
                </button>
              </div>
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        ) : (
          /* Analysis Section */
          <div>
            {/* Image Preview */}
            <div className="mb-6">
              <img
                src={selectedImage}
                alt="Selected product"
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              {!result && !isAnalyzing && (
                <button
                  onClick={analyzeImage}
                  className="flex items-center justify-center space-x-2 px-8 py-3 bg-islamic-green text-white rounded-lg hover:bg-islamic-green/90 transition-colors text-lg font-semibold"
                >
                  <Camera className="h-5 w-5" />
                  <span>{t.analyze}</span>
                </button>
              )}

              <button
                onClick={reset}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-600/90 transition-colors"
              >
                <RotateCcw className="h-5 w-5" />
                <span>{t.reset}</span>
              </button>
            </div>

            {/* Loading */}
            {isAnalyzing && (
              <div className="text-center py-8">
                <Loader className="h-8 w-8 animate-spin mx-auto text-islamic-gold mb-4" />
                <p className="text-gray-600">{t.analyzing}</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="bg-gray-50 rounded-lg p-6">
                {/* Main Result */}
                <div className="text-center mb-6">
                  {getResultIcon()}
                  <h3 className={`text-2xl font-bold mt-2 ${
                    result.is_halal ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {getResultText()}
                  </h3>
                  <div className="mt-2">
                    <span className="text-gray-600">{t.confidence}: </span>
                    <span className={`font-semibold ${getConfidenceColor(result.confidence)}`}>
                      {result.confidence}%
                    </span>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">{t.reason}</h4>
                    <p className="text-gray-600 bg-white p-3 rounded border">
                      {result.reason}
                    </p>
                  </div>

                  {result.ingredients_concern && result.ingredients_concern.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t.concernedIngredients}</h4>
                      <div className="bg-white p-3 rounded border">
                        {result.ingredients_concern.length === 0 ? (
                          <p className="text-green-600">{t.noIngredients}</p>
                        ) : (
                          <ul className="list-disc list-inside space-y-1">
                            {result.ingredients_concern.map((ingredient, index) => (
                              <li key={index} className="text-red-600">{ingredient}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}

                  {result.recommendation && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t.recommendation}</h4>
                      <p className="text-gray-600 bg-white p-3 rounded border">
                        {result.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}