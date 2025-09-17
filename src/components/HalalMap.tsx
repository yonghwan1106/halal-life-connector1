'use client'

import { useState, useEffect } from 'react'
import { MapPin, Phone, Clock, Star, Navigation } from 'lucide-react'
import { HalalPlace } from '@/types'
import KakaoMap from './KakaoMap'

interface HalalMapProps {
  places: HalalPlace[]
  userLocation?: { lat: number; lng: number }
}

export default function HalalMap({ places, userLocation }: HalalMapProps) {
  const [selectedPlace, setSelectedPlace] = useState<HalalPlace | null>(null)
  const [filteredPlaces, setFilteredPlaces] = useState<HalalPlace[]>(places)
  const [filters, setFilters] = useState({
    category: 'all',
    halalLevel: 'all'
  })

  useEffect(() => {
    let filtered = places

    if (filters.category !== 'all') {
      filtered = filtered.filter(place => place.category === filters.category)
    }

    if (filters.halalLevel !== 'all') {
      filtered = filtered.filter(place => place.halalLevel === filters.halalLevel)
    }

    setFilteredPlaces(filtered)
  }, [places, filters])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'restaurant': return '🍽️'
      case 'market': return '🛒'
      case 'prayer_room': return '🕌'
      default: return '📍'
    }
  }

  const getHalalLevelColor = (level: string) => {
    switch (level) {
      case 'certified': return 'text-green-600 bg-green-100'
      case 'reliable': return 'text-blue-600 bg-blue-100'
      case 'unknown': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getHalalLevelText = (level: string) => {
    switch (level) {
      case 'certified': return '인증됨'
      case 'reliable': return '신뢰할만함'
      case 'unknown': return '미확인'
      default: return '미확인'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'restaurant': return '음식점'
      case 'market': return '마트'
      case 'prayer_room': return '기도실'
      default: return '기타'
    }
  }

  const openInKakaoMap = (place: HalalPlace) => {
    const url = `https://map.kakao.com/link/to/${encodeURIComponent(place.name)},${place.latitude},${place.longitude}`
    window.open(url, '_blank')
  }

  const callPlace = (phone: string) => {
    window.open(`tel:${phone}`, '_self')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">필터</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green"
            >
              <option value="all">전체</option>
              <option value="restaurant">음식점</option>
              <option value="market">마트</option>
              <option value="prayer_room">기도실</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">할랄 인증</label>
            <select
              value={filters.halalLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, halalLevel: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green"
            >
              <option value="all">전체</option>
              <option value="certified">인증됨</option>
              <option value="reliable">신뢰할만함</option>
              <option value="unknown">미확인</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kakao Map & Place List */}
      <div className="grid md:grid-cols-2 h-96">
        {/* Kakao Map */}
        <div className="border-r">
          <KakaoMap
            places={filteredPlaces}
            userLocation={userLocation}
            selectedPlace={selectedPlace}
            onPlaceSelect={setSelectedPlace}
            height="384px"
          />
        </div>

        {/* Place List */}
        <div className="overflow-y-auto">
          {filteredPlaces.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>조건에 맞는 장소가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedPlace?.id === place.id ? 'bg-islamic-green/10 border-islamic-green' : ''
                  }`}
                  onClick={() => setSelectedPlace(place)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{getCategoryIcon(place.category)}</span>
                        <h4 className="font-medium text-gray-900">{place.name}</h4>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getHalalLevelColor(place.halalLevel)}`}>
                          {getHalalLevelText(place.halalLevel)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getCategoryText(place.category)}
                        </span>
                        {place.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{place.rating}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{place.address}</p>

                      {place.description && (
                        <p className="text-xs text-gray-500 mb-2">{place.description}</p>
                      )}

                      <div className="flex items-center space-x-4">
                        {place.phone && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              callPlace(place.phone!)
                            }}
                            className="flex items-center space-x-1 text-xs text-islamic-green hover:text-islamic-green/80"
                          >
                            <Phone className="h-3 w-3" />
                            <span>{place.phone}</span>
                          </button>
                        )}

                        {place.openingHours && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{place.openingHours}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openInKakaoMap(place)
                      }}
                      className="ml-2 p-2 text-islamic-green hover:bg-islamic-green/10 rounded-full transition-colors"
                      title="길찾기"
                    >
                      <Navigation className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Place Details */}
      {selectedPlace && (
        <div className="p-4 bg-islamic-green/5 border-t">
          <h4 className="font-semibold text-lg mb-2">{selectedPlace.name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>주소:</strong> {selectedPlace.address}</p>
              {selectedPlace.phone && <p><strong>전화:</strong> {selectedPlace.phone}</p>}
              {selectedPlace.openingHours && <p><strong>운영시간:</strong> {selectedPlace.openingHours}</p>}
            </div>
            <div>
              {selectedPlace.website && (
                <p>
                  <strong>웹사이트:</strong>
                  <a
                    href={selectedPlace.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-islamic-green hover:underline"
                  >
                    방문하기
                  </a>
                </p>
              )}
              {selectedPlace.description && <p><strong>설명:</strong> {selectedPlace.description}</p>}
            </div>
          </div>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={() => openInKakaoMap(selectedPlace)}
              className="px-4 py-2 bg-islamic-green text-white rounded-lg hover:bg-islamic-green/90 transition-colors"
            >
              길찾기
            </button>
            {selectedPlace.phone && (
              <button
                onClick={() => callPlace(selectedPlace.phone!)}
                className="px-4 py-2 bg-islamic-gold text-white rounded-lg hover:bg-islamic-gold/90 transition-colors"
              >
                전화걸기
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}