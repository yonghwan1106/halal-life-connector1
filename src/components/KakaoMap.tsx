'use client'

import { useEffect, useRef, useState } from 'react'
import { HalalPlace } from '@/types'

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  places: HalalPlace[]
  userLocation?: { lat: number; lng: number }
  selectedPlace?: HalalPlace | null
  onPlaceSelect?: (place: HalalPlace) => void
  height?: string
}

export default function KakaoMap({
  places,
  userLocation,
  selectedPlace,
  onPlaceSelect,
  height = '400px'
}: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const markers = useRef<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('KakaoMap useEffect triggered')
    console.log('API Key:', process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY ? 'Available' : 'Missing')

    // Check if API key is available
    if (!process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY) {
      console.error('Kakao Maps API key is missing')
      setError('카카오맵 API 키가 설정되지 않았습니다.')
      setIsLoading(false)
      return
    }

    const initializeMap = () => {
      console.log('Initializing Kakao Map...')

      if (!window.kakao) {
        console.error('Kakao Maps SDK not loaded')
        setError('카카오맵 SDK가 로드되지 않았습니다.')
        setIsLoading(false)
        return
      }

      if (!mapContainer.current) {
        console.error('Map container not found')
        setError('맵 컨테이너를 찾을 수 없습니다.')
        setIsLoading(false)
        return
      }

      try {
        window.kakao.maps.load(() => {
          console.log('Kakao Maps loaded successfully')
          const center = userLocation
            ? new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
            : new window.kakao.maps.LatLng(37.5665, 126.9780) // 서울시청

          const options = {
            center,
            level: userLocation ? 5 : 8
          }

          map.current = new window.kakao.maps.Map(mapContainer.current, options)
          console.log('Map created successfully')

          setIsLoading(false)
          setError(null)

        // Clear existing markers
        markers.current.forEach(marker => marker.setMap(null))
        markers.current = []

        // Add user location marker if available
        if (userLocation) {
          const userMarkerImage = new window.kakao.maps.MarkerImage(
            'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
            new window.kakao.maps.Size(24, 35)
          )

          const userMarker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
            image: userMarkerImage
          })
          userMarker.setMap(map.current)

          const userInfoWindow = new window.kakao.maps.InfoWindow({
            content: '<div style="padding:5px;">현재 위치</div>'
          })

          window.kakao.maps.event.addListener(userMarker, 'click', () => {
            userInfoWindow.open(map.current, userMarker)
          })
        }

        // Add place markers
        places.forEach((place) => {
          const position = new window.kakao.maps.LatLng(place.latitude, place.longitude)

          // Different marker colors based on category
          let markerImageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png'
          if (place.category === 'restaurant') {
            markerImageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png'
          } else if (place.category === 'market') {
            markerImageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png'
          } else if (place.category === 'prayer_room') {
            markerImageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_green.png'
          }

          const markerImage = new window.kakao.maps.MarkerImage(
            markerImageSrc,
            new window.kakao.maps.Size(22, 28)
          )

          const marker = new window.kakao.maps.Marker({
            position,
            image: markerImage
          })

          marker.setMap(map.current)
          markers.current.push(marker)

          // Create info window
          const getCategoryIcon = (category: string) => {
            switch (category) {
              case 'restaurant': return '🍽️'
              case 'market': return '🛒'
              case 'prayer_room': return '🕌'
              default: return '📍'
            }
          }

          const getHalalLevelText = (level: string) => {
            switch (level) {
              case 'certified': return '<span style="color: #059669; font-weight: bold;">인증됨</span>'
              case 'reliable': return '<span style="color: #2563eb; font-weight: bold;">신뢰할만함</span>'
              case 'unknown': return '<span style="color: #6b7280;">미확인</span>'
              default: return '<span style="color: #6b7280;">미확인</span>'
            }
          }

          const infoWindowContent = `
            <div style="padding: 10px; min-width: 200px;">
              <div style="font-weight: bold; margin-bottom: 5px;">
                ${getCategoryIcon(place.category)} ${place.name}
              </div>
              <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                ${getHalalLevelText(place.halalLevel)}
              </div>
              <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                ${place.address}
              </div>
              ${place.phone ? `<div style="font-size: 12px; color: #666; margin-bottom: 5px;">📞 ${place.phone}</div>` : ''}
              ${place.rating ? `<div style="font-size: 12px; color: #666;">⭐ ${place.rating}</div>` : ''}
            </div>
          `

          const infoWindow = new window.kakao.maps.InfoWindow({
            content: infoWindowContent
          })

          // Add click event
          window.kakao.maps.event.addListener(marker, 'click', () => {
            // Close all other info windows
            markers.current.forEach((m, i) => {
              if (m._infoWindow) {
                m._infoWindow.close()
              }
            })

            infoWindow.open(map.current, marker)
            marker._infoWindow = infoWindow

            if (onPlaceSelect) {
              onPlaceSelect(place)
            }
          })

          marker._infoWindow = infoWindow
          marker._place = place
        })

        // Focus on selected place
        if (selectedPlace) {
          const selectedMarker = markers.current.find(m => m._place?.id === selectedPlace.id)
          if (selectedMarker) {
            map.current.setCenter(selectedMarker.getPosition())
            map.current.setLevel(3)
            selectedMarker._infoWindow.open(map.current, selectedMarker)
          }
        }
        })
      } catch (error) {
        console.error('Error initializing map:', error)
        setError('맵을 초기화하는 중 오류가 발생했습니다.')
        setIsLoading(false)
      }
    }

    // Load Kakao Maps script
    const loadKakaoMapsScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if script is already loaded
        if (window.kakao) {
          console.log('Kakao Maps SDK already loaded')
          resolve()
          return
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector('script[src*="dapi.kakao.com"]')
        if (existingScript) {
          console.log('Kakao Maps SDK already loading, waiting...')
          existingScript.addEventListener('load', () => resolve())
          existingScript.addEventListener('error', () => reject(new Error('Script load failed')))
          return
        }

        console.log('Loading Kakao Maps SDK...')
        const script = document.createElement('script')
        script.async = true
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`

        script.onload = () => {
          console.log('Kakao Maps SDK loaded successfully')
          resolve()
        }

        script.onerror = () => {
          console.error('Failed to load Kakao Maps SDK')
          reject(new Error('Failed to load Kakao Maps SDK'))
        }

        document.head.appendChild(script)
      })
    }

    loadKakaoMapsScript()
      .then(() => {
        initializeMap()
      })
      .catch((error) => {
        console.error('Error loading Kakao Maps:', error)
        setError('카카오맵 SDK를 로드할 수 없습니다. 네트워크 연결을 확인해주세요.')
        setIsLoading(false)
      })
  }, [places, userLocation, selectedPlace, onPlaceSelect])

  if (isLoading) {
    return (
      <div
        style={{ width: '100%', height }}
        className="rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-islamic-green mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">지도를 로드하는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{ width: '100%', height }}
        className="rounded-lg overflow-hidden bg-gradient-to-br from-islamic-green/10 to-islamic-green/20 flex flex-col"
      >
        <div className="p-4 bg-islamic-green text-white">
          <h3 className="font-semibold">🗺️ 서울 할랄 시설 위치</h3>
          <p className="text-sm opacity-90">지도 로딩 중 문제가 발생했지만, 시설 정보는 확인하실 수 있습니다</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-3">
            {places.map((place) => (
              <div
                key={place.id}
                className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer border"
                onClick={() => onPlaceSelect && onPlaceSelect(place)}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">
                    {place.category === 'restaurant' && '🍽️'}
                    {place.category === 'market' && '🛒'}
                    {place.category === 'prayer_room' && '🕌'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{place.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{place.address}</p>

                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        place.halalLevel === 'certified' ? 'bg-green-100 text-green-700' :
                        place.halalLevel === 'reliable' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {place.halalLevel === 'certified' ? '인증됨' :
                         place.halalLevel === 'reliable' ? '신뢰할만함' : '미확인'}
                      </span>

                      {place.rating && (
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-xs text-gray-600">{place.rating}</span>
                        </div>
                      )}
                    </div>

                    {place.phone && (
                      <div className="flex items-center space-x-1 mt-2">
                        <span className="text-islamic-green">📞</span>
                        <span className="text-xs text-gray-600">{place.phone}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const url = `https://map.kakao.com/link/search/${encodeURIComponent(place.name + ' ' + place.address)}`
                      window.open(url, '_blank')
                    }}
                    className="text-islamic-green hover:text-islamic-green/80 p-1"
                    title="카카오맵에서 보기"
                  >
                    🗺️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {places.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>표시할 시설이 없습니다.</p>
            </div>
          )}
        </div>

        <div className="p-3 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>총 {places.length}개 시설</span>
            <button
              onClick={() => {
                setError(null)
                setIsLoading(true)
                window.location.reload()
              }}
              className="px-2 py-1 bg-islamic-green text-white rounded hover:bg-islamic-green/90"
            >
              지도 다시 로드
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height }}
      className="rounded-lg overflow-hidden"
    />
  )
}