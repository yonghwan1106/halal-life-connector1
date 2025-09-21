import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const category = searchParams.get('category')
    const halalLevel = searchParams.get('halalLevel')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius')

    let whereClause: any = {}

    if (category && category !== 'all') {
      whereClause.category = category
    }

    if (halalLevel && halalLevel !== 'all') {
      whereClause.halalLevel = halalLevel
    }

    // Try to fetch from database, fallback to mock data if DB is unavailable
    let places

    if (!prisma) {
      console.log('Database not available, using mock data')
      // Return mock data for Seoul halal places when database is unavailable
      places = getMockHalalPlaces().filter(place => {
        if (category && category !== 'all' && place.category !== category) return false
        if (halalLevel && halalLevel !== 'all' && place.halalLevel !== halalLevel) return false
        return true
      })
    } else {
      try {
        places = await prisma.halalPlace.findMany({
          where: whereClause,
          orderBy: [
            { halalLevel: 'asc' }, // certified first
            { rating: 'desc' },
            { name: 'asc' }
          ]
        })
        console.log('Fetched places from database:', places.length)
      } catch (dbError) {
        console.error('Database error, using mock data:', dbError)
        // Return mock data for Seoul halal places when database is unavailable
        places = getMockHalalPlaces().filter(place => {
          if (category && category !== 'all' && place.category !== category) return false
          if (halalLevel && halalLevel !== 'all' && place.halalLevel !== halalLevel) return false
          return true
        })
      }
    }

    // If location and radius provided, filter by distance
    if (lat && lng && radius) {
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)
      const maxRadius = parseFloat(radius)

      const filteredPlaces = places.filter(place => {
        const distance = calculateDistance(userLat, userLng, place.latitude, place.longitude)
        return distance <= maxRadius
      })

      return NextResponse.json(filteredPlaces)
    }

    return NextResponse.json(places)
  } catch (error) {
    console.error('Error fetching halal places:', error)
    return NextResponse.json(
      { error: 'Failed to fetch halal places' },
      { status: 500 }
    )
  }
}

// Mock data for Seoul halal places (fallback when database is unavailable)
function getMockHalalPlaces() {
  return [
    {
      id: 1,
      name: "이태원 할랄 레스토랑",
      category: "restaurant",
      latitude: 37.5326,
      longitude: 126.9926,
      address: "서울시 용산구 이태원동",
      phone: "02-123-4567",
      rating: 4.5,
      halalLevel: "certified",
      description: "정통 중동 요리를 제공하는 할랄 인증 레스토랑",
      openingHours: "11:00-22:00",
      website: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: "홍대 할랄 마켓",
      category: "market",
      latitude: 37.5563,
      longitude: 126.9236,
      address: "서울시 마포구 홍익로",
      phone: "02-234-5678",
      rating: 4.2,
      halalLevel: "reliable",
      description: "할랄 식재료와 제품을 판매하는 마켓",
      openingHours: "09:00-21:00",
      website: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: "강남 이슬람 센터",
      category: "prayer_room",
      latitude: 37.5012,
      longitude: 127.0396,
      address: "서울시 강남구 테헤란로",
      phone: "02-345-6789",
      rating: 4.8,
      halalLevel: "certified",
      description: "기도실과 할랄 정보를 제공하는 이슬람 센터",
      openingHours: "05:00-23:00",
      website: "http://islamicenter.kr",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: "명동 할랄 푸드",
      category: "restaurant",
      latitude: 37.5636,
      longitude: 126.9834,
      address: "서울시 중구 명동",
      phone: "02-456-7890",
      rating: 4.0,
      halalLevel: "reliable",
      description: "관광객에게 인기 있는 할랄 음식점",
      openingHours: "10:00-22:00",
      website: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: "동대문 할랄 스토어",
      category: "market",
      latitude: 37.5709,
      longitude: 127.0095,
      address: "서울시 동대문구",
      phone: "02-567-8901",
      rating: 3.8,
      halalLevel: "reliable",
      description: "다양한 할랄 제품을 판매하는 상점",
      openingHours: "08:00-20:00",
      website: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  return distance
}