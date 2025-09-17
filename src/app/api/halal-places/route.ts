import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
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

    const places = await prisma.halalPlace.findMany({
      where: whereClause,
      orderBy: [
        { halalLevel: 'asc' }, // certified first
        { rating: 'desc' },
        { name: 'asc' }
      ]
    })

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