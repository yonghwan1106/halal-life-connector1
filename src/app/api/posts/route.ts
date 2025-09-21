import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const category = searchParams.get('category')
    const language = searchParams.get('language')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let whereClause: any = {}

    if (category && category !== 'all') {
      whereClause.category = category
    }

    if (language && language !== 'all') {
      whereClause.language = language
    }

    // Try to fetch from database, fallback to mock data if DB is unavailable
    let posts, total

    if (!prisma) {
      console.log('Database not available, using mock data')
      // Return mock community posts when database is unavailable
      const mockPosts = getMockPosts().filter(post => {
        if (category && category !== 'all' && post.category !== category) return false
        if (language && language !== 'all' && post.language !== language) return false
        return true
      })

      const startIndex = (page - 1) * limit
      posts = mockPosts.slice(startIndex, startIndex + limit)
      total = mockPosts.length
    } else {
      try {
        [posts, total] = await Promise.all([
          prisma.post.findMany({
            where: whereClause,
            include: {
              comments: {
                orderBy: { createdAt: 'desc' },
                take: 3
              }
            },
            orderBy: [
              { createdAt: 'desc' }
            ],
            skip: (page - 1) * limit,
            take: limit
          }),
          prisma.post.count({ where: whereClause })
        ])
        console.log('Fetched posts from database:', posts.length)
      } catch (dbError) {
        console.error('Database error, using mock data:', dbError)
        // Return mock community posts when database is unavailable
        const mockPosts = getMockPosts().filter(post => {
          if (category && category !== 'all' && post.category !== category) return false
          if (language && language !== 'all' && post.language !== language) return false
          return true
        })

        const startIndex = (page - 1) * limit
        posts = mockPosts.slice(startIndex, startIndex + limit)
        total = mockPosts.length
      }
    }

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// Mock data for community posts (fallback when database is unavailable)
function getMockPosts() {
  const now = new Date()
  return [
    {
      id: 1,
      title: "서울 이태원 할랄 음식점 추천",
      content: "이태원에서 정말 맛있는 할랄 음식점을 발견했어요! 양고기 케밥이 특히 맛있고 가격도 합리적입니다. 무슬림 친구들과 함께 가기 좋은 곳이에요.",
      category: "food",
      language: "ko",
      authorName: "김무슬림",
      authorEmail: null,
      imageUrl: null,
      likes: 15,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      comments: [
        {
          id: 1,
          content: "저도 거기 가봤는데 정말 좋았어요! 추천 감사합니다.",
          authorName: "이친구",
          createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
        }
      ]
    },
    {
      id: 2,
      title: "Halal Market in Hongdae Area",
      content: "Found a great halal market near Hongdae station. They have a wide variety of halal meat, spices, and Middle Eastern products. The owner is very friendly and speaks English well.",
      category: "life_info",
      language: "en",
      authorName: "Ahmed Hassan",
      authorEmail: null,
      imageUrl: null,
      likes: 8,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      comments: []
    },
    {
      id: 3,
      title: "강남 이슬람 센터 금요 예배 안내",
      content: "강남 이슬람 센터에서 매주 금요일 12:30에 금요 예배(주마)가 있습니다. 새로 오신 분들도 환영합니다. 주차 공간이 제한적이니 대중교통 이용을 권합니다.",
      category: "prayer_room",
      language: "ko",
      authorName: "박이맘",
      authorEmail: null,
      imageUrl: null,
      likes: 23,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      comments: [
        {
          id: 2,
          content: "매주 참석하고 있어요. 좋은 커뮤니티입니다!",
          authorName: "최무슬림",
          createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000)
        }
      ]
    },
    {
      id: 4,
      title: "مطعم حلال ممتاز في سيول",
      content: "وجدت مطعماً حلالاً رائعاً في منطقة إيتايوون. الطعام لذيذ جداً والأسعار معقولة. أنصح جميع الإخوة المسلمين بزيارته.",
      category: "food",
      language: "ar",
      authorName: "محمد الكوري",
      authorEmail: null,
      imageUrl: null,
      likes: 12,
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      comments: []
    },
    {
      id: 5,
      title: "한국 할랄 인증 제품 구매 팁",
      content: "한국에서 할랄 인증 제품을 쉽게 찾는 방법을 공유합니다. 롯데마트, 이마트 등 대형마트에서도 할랄 코너가 있어요. 온라인 쇼핑몰도 많이 생겼습니다.",
      category: "life_info",
      language: "ko",
      authorName: "할랄라이프",
      authorEmail: null,
      imageUrl: null,
      likes: 31,
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      comments: [
        {
          id: 3,
          content: "온라인 쇼핑몰 정보 더 알려주세요!",
          authorName: "궁금이",
          createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          id: 4,
          content: "쿠팡에서도 할랄 제품 많이 팔아요",
          authorName: "정보공유",
          createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        }
      ]
    },
    {
      id: 6,
      title: "Prayer Room Near University",
      content: "Is there any prayer room near Seoul National University? I'm a new exchange student and looking for a place to pray during my classes.",
      category: "prayer_room",
      language: "en",
      authorName: "Student123",
      authorEmail: null,
      imageUrl: null,
      likes: 5,
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      comments: [
        {
          id: 5,
          content: "There's a prayer room in the student center, 3rd floor.",
          authorName: "Helper",
          createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000)
        }
      ]
    }
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      category,
      language,
      authorName,
      authorEmail,
      imageUrl
    } = body

    if (!title || !content || !category || !language || !authorName) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      )
    }

    // If database is not available, return error
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available. Post creation is not supported in demo mode.' },
        { status: 503 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        language,
        authorName,
        authorEmail,
        imageUrl
      },
      include: {
        comments: true
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}