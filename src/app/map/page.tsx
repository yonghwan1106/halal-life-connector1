'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Loader, Award } from 'lucide-react'
import Link from 'next/link'
import HalalMap from '@/components/HalalMap'
import { HalalPlace } from '@/types'

export default function MapPage() {
  const [places, setPlaces] = useState<HalalPlace[]>([])
  const [filteredPlaces, setFilteredPlaces] = useState<HalalPlace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location access denied:', error)
        }
      )
    }

    // Fetch halal places
    fetchHalalPlaces()

    // Check URL parameters for filtering
    const urlParams = new URLSearchParams(window.location.search)
    const category = urlParams.get('category')
    const location = urlParams.get('location')

    if (category) {
      setActiveFilter(`category-${category}`)
    } else if (location) {
      setActiveFilter(`location-${location}`)
    }
  }, [])

  // Filter places based on URL parameters or active filter
  useEffect(() => {
    if (!activeFilter) {
      setFilteredPlaces(places)
      return
    }

    const [filterType, filterValue] = activeFilter.split('-')
    let filtered = places

    if (filterType === 'category') {
      filtered = places.filter(place => place.category === filterValue)
    } else if (filterType === 'location') {
      if (filterValue === 'itaewon') {
        filtered = places.filter(place =>
          place.address.includes('이태원') || place.address.includes('용산구')
        )
      } else if (filterValue === 'myeongdong') {
        filtered = places.filter(place =>
          place.address.includes('명동') || place.address.includes('중구')
        )
      }
    }

    setFilteredPlaces(filtered)
  }, [places, activeFilter])

  const fetchHalalPlaces = async () => {
    try {
      const response = await fetch('/api/halal-places')
      if (!response.ok) {
        throw new Error('Failed to fetch places')
      }
      const data = await response.json()
      setPlaces(data)
    } catch (err) {
      setError('장소 정보를 불러오는데 실패했습니다.')
      console.error('Error fetching places:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-islamic-light flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto text-islamic-green mb-4" />
          <p className="text-gray-600">할랄 시설 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-islamic-light flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchHalalPlaces}
            className="px-4 py-2 bg-islamic-green text-white rounded-lg hover:bg-islamic-green/90"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-light via-white to-islamic-green/5">
      {/* Header */}
      <header className="bg-gradient-to-r from-islamic-green to-islamic-green/90 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:text-white/80 transition-colors bg-white/10 px-3 py-2 rounded-lg">
              <ArrowLeft className="h-5 w-5" />
              <span>뒤로</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <MapPin className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold">할랄 맵</h1>
            </div>
          </div>
          <div className="text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{filteredPlaces.length}개 시설 찾음</span>
              {activeFilter && (
                <span className="bg-islamic-gold text-white px-3 py-1 rounded-full text-xs font-semibold">
                  필터 적용됨
                </span>
              )}
              {userLocation && (
                <span className="text-islamic-green bg-white px-3 py-1 rounded-full text-xs font-semibold">
                  📍 위치 확인됨
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Competition Banner */}
      <div className="bg-gradient-to-r from-islamic-gold to-yellow-500 text-white py-2">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2">
            <Award className="h-4 w-4" />
            <span className="text-sm font-semibold">2025 한-아랍 스타트업 아이디어 공모전</span>
            <Award className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Filter Info */}
        {activeFilter && (
          <div className="mb-6 bg-gradient-to-r from-islamic-gold/10 to-yellow-500/10 border border-islamic-gold/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-islamic-gold/20 rounded-full flex items-center justify-center">
                  <span className="text-islamic-gold text-lg">🔍</span>
                </div>
                <div>
                  <span className="font-semibold text-islamic-dark block">
                    필터가 적용되어 {filteredPlaces.length}개 시설이 표시되고 있습니다
                  </span>
                  <span className="text-sm text-gray-600">원하는 결과를 찾으셨나요?</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveFilter(null)
                  window.history.replaceState({}, '', '/map')
                }}
                className="px-4 py-2 bg-islamic-gold text-white rounded-lg hover:bg-islamic-gold/90 transition-colors font-semibold"
              >
                필터 해제
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-islamic-green/5 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-islamic-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🍽️</span>
            </div>
            <div className="text-3xl font-bold text-islamic-green mb-1">
              {filteredPlaces.filter(p => p.category === 'restaurant').length}
            </div>
            <div className="text-sm text-gray-600 font-medium">음식점</div>
          </div>
          <div className="bg-gradient-to-br from-white to-islamic-gold/5 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-islamic-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🛒</span>
            </div>
            <div className="text-3xl font-bold text-islamic-gold mb-1">
              {filteredPlaces.filter(p => p.category === 'market').length}
            </div>
            <div className="text-sm text-gray-600 font-medium">마트</div>
          </div>
          <div className="bg-gradient-to-br from-white to-blue-500/5 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🕌</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {filteredPlaces.filter(p => p.category === 'prayer_room').length}
            </div>
            <div className="text-sm text-gray-600 font-medium">기도실</div>
          </div>
          <div className="bg-gradient-to-br from-white to-purple-500/5 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">✅</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {filteredPlaces.filter(p => p.halalLevel === 'certified').length}
            </div>
            <div className="text-sm text-gray-600 font-medium">인증된 시설</div>
          </div>
        </div>

        {/* Map Component */}
        <HalalMap places={filteredPlaces} userLocation={userLocation || undefined} />

        {/* Info */}
        <div className="mt-6 bg-white rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3">사용 방법</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-islamic-green">1️⃣</span>
              <div>
                <p className="font-medium">필터 사용</p>
                <p>카테고리와 할랄 인증 수준으로 필터링하세요</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-islamic-green">2️⃣</span>
              <div>
                <p className="font-medium">장소 선택</p>
                <p>목록에서 장소를 클릭하면 상세 정보를 볼 수 있습니다</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-islamic-green">3️⃣</span>
              <div>
                <p className="font-medium">길찾기</p>
                <p>네비게이션 버튼을 클릭하면 Google Maps로 이동합니다</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}