'use client'

import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    const initializeMap = () => {
      if (!window.kakao || !mapContainer.current) return

      window.kakao.maps.load(() => {
        const center = userLocation
          ? new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
          : new window.kakao.maps.LatLng(37.5665, 126.9780) // 서울시청

        const options = {
          center,
          level: userLocation ? 5 : 8
        }

        map.current = new window.kakao.maps.Map(mapContainer.current, options)

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

          // Use default marker (no custom image to avoid 404 errors)
          const marker = new window.kakao.maps.Marker({
            position
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
    }

    // Load Kakao Maps script
    if (!window.kakao) {
      const script = document.createElement('script')
      script.async = true
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`
      script.onload = initializeMap
      document.head.appendChild(script)
    } else {
      initializeMap()
    }
  }, [places, userLocation, selectedPlace, onPlaceSelect])

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height }}
      className="rounded-lg overflow-hidden"
    />
  )
}