'use client'

import { Building, Camera, Users, MapPin, Search, Award, Info } from 'lucide-react'
import { useState, useEffect } from 'react'

type Language = 'ko' | 'en' | 'ar'

const translations = {
  ko: {
    title: '할랄 라이프 커넥터',
    subtitle: '한국에서의 할랄 라이프를 연결합니다',
    description: '할랄 음식점, AI 제품 스캐너, 무슬림 커뮤니티까지 한 곳에서',
    halalMap: '할랄 맵',
    halalMapDesc: '주변 할랄 음식점, 마트, 기도실을 쉽게 찾아보세요',
    viewMap: '지도 보기',
    aiScanner: 'AI 스캐너',
    aiScannerDesc: '제품 사진을 찍으면 AI가 할랄 여부를 분석해드려요',
    startScan: '스캔 시작',
    community: '커뮤니티',
    communityDesc: '한국 거주 무슬림들과 정보를 공유하고 소통하세요',
    participate: '참여하기',
    quickSearch: '빠른 검색',
    restaurants: '할랄 음식점',
    markets: '할랄 마트',
    prayerRooms: '기도실',
    itaewon: '이태원',
    myeongdong: '명동',
    about: '소개',
    competitionBadge: '2025 한-아랍 스타트업 아이디어 공모전'
  },
  en: {
    title: 'Halal Life Connector',
    subtitle: 'Connecting Halal Life in Korea',
    description: 'Halal restaurants, AI product scanner, and Muslim community all in one place',
    halalMap: 'Halal Map',
    halalMapDesc: 'Easily find nearby halal restaurants, markets, and prayer rooms',
    viewMap: 'View Map',
    aiScanner: 'AI Scanner',
    aiScannerDesc: 'Take a photo of products and AI will analyze if they are halal',
    startScan: 'Start Scan',
    community: 'Community',
    communityDesc: 'Share information and communicate with Muslims living in Korea',
    participate: 'Join',
    quickSearch: 'Quick Search',
    restaurants: 'Halal Restaurants',
    markets: 'Halal Markets',
    prayerRooms: 'Prayer Rooms',
    itaewon: 'Itaewon',
    myeongdong: 'Myeongdong',
    about: 'About',
    competitionBadge: '2025 Korea-Arab Startup Competition'
  },
  ar: {
    title: 'موصل الحياة الحلال',
    subtitle: 'ربط الحياة الحلال في كوريا',
    description: 'المطاعم الحلال وماسح المنتجات بالذكاء الاصطناعي ومجتمع المسلمين في مكان واحد',
    halalMap: 'خريطة الحلال',
    halalMapDesc: 'اعثر بسهولة على المطاعم الحلال والأسواق وغرف الصلاة القريبة',
    viewMap: 'عرض الخريطة',
    aiScanner: 'ماسح الذكاء الاصطناعي',
    aiScannerDesc: 'التقط صورة للمنتجات وسيحلل الذكاء الاصطناعي ما إذا كانت حلال',
    startScan: 'بدء المسح',
    community: 'المجتمع',
    communityDesc: 'شارك المعلومات وتواصل مع المسلمين المقيمين في كوريا',
    participate: 'انضم',
    quickSearch: 'البحث السريع',
    restaurants: 'المطاعم الحلال',
    markets: 'الأسواق الحلال',
    prayerRooms: 'غرف الصلاة',
    itaewon: 'إيتايوون',
    myeongdong: 'ميونغدونغ',
    about: 'حول',
    competitionBadge: 'مسابقة الشركات الناشئة الكورية-العربية 2025'
  }
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('ko')
  const t = translations[language]

  // Update document language when language changes
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  // Quick search handlers
  const handleQuickSearch = (type: 'category' | 'location', value: string) => {
    const params = new URLSearchParams()
    params.set(type, value)
    window.location.href = `/map?${params.toString()}`
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-islamic-light via-white to-islamic-green/5">
      {/* Header */}
      <header className="bg-gradient-to-r from-islamic-green to-islamic-green/90 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Building className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold">{t.title}</h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="/about" className="flex items-center space-x-1 hover:text-white/80 transition-colors bg-white/10 px-3 py-2 rounded-lg">
              <Info className="h-4 w-4" />
              <span>{t.about}</span>
            </a>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setLanguage('ko')}
              className={`px-3 py-1 rounded transition-colors ${
                language === 'ko' ? 'bg-white text-islamic-green' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              한국어
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded transition-colors ${
                language === 'en' ? 'bg-white text-islamic-green' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1 rounded transition-colors ${
                language === 'ar' ? 'bg-white text-islamic-green' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              العربية
            </button>
          </div>
        </div>
      </header>

      {/* Competition Banner */}
      <div className="bg-gradient-to-r from-islamic-gold to-yellow-500 text-white py-3">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2">
            <Award className="h-5 w-5" />
            <span className="font-semibold">{t.competitionBadge}</span>
            <Award className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative">
            <h2 className="text-5xl md:text-6xl font-bold text-islamic-dark mb-6 leading-tight">
              {t.subtitle}
            </h2>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-islamic-gold/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-islamic-green/20 rounded-full animate-bounce"></div>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t.description}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">실시간 AI 분석</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">GPS 기반 검색</span>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-shadow">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">3개 언어 지원</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Halal Map */}
          <div className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="relative mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-islamic-green to-islamic-green/80 rounded-2xl mx-auto group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-islamic-gold rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">📍</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center mb-4 text-islamic-dark">{t.halalMap}</h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              {t.halalMapDesc}
            </p>
            <a href="/map" className="block w-full bg-gradient-to-r from-islamic-green to-islamic-green/90 text-white py-3 rounded-xl hover:from-islamic-green/90 hover:to-islamic-green transition-all duration-300 text-center font-semibold transform hover:scale-105">
              {t.viewMap}
            </a>
          </div>

          {/* AI Scanner */}
          <div className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="relative mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-islamic-gold to-yellow-500 rounded-2xl mx-auto group-hover:scale-110 transition-transform duration-300">
                <Camera className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-islamic-green rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">🤖</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center mb-4 text-islamic-dark">{t.aiScanner}</h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              {t.aiScannerDesc}
            </p>
            <a href="/scanner" className="block w-full bg-gradient-to-r from-islamic-gold to-yellow-500 text-white py-3 rounded-xl hover:from-islamic-gold/90 hover:to-yellow-500/90 transition-all duration-300 text-center font-semibold transform hover:scale-105">
              {t.startScan}
            </a>
          </div>

          {/* Community */}
          <div className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
            <div className="relative mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl mx-auto group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-islamic-gold rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">💬</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-center mb-4 text-islamic-dark">{t.community}</h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              {t.communityDesc}
            </p>
            <a href="/community" className="block w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl hover:from-blue-600/90 hover:to-blue-500/90 transition-all duration-300 text-center font-semibold transform hover:scale-105">
              {t.participate}
            </a>
          </div>
        </div>

        {/* Quick Search */}
        <div className="bg-gradient-to-br from-white to-islamic-green/5 rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-islamic-green to-islamic-green/80 rounded-2xl mb-4">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-islamic-dark mb-2">{t.quickSearch}</h3>
            <p className="text-gray-600">원하는 카테고리나 지역을 선택하여 바로 검색하세요</p>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">카테고리별 검색</h4>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => handleQuickSearch('category', 'restaurant')}
                  className="group px-6 py-3 bg-gradient-to-r from-islamic-green/10 to-islamic-green/20 text-islamic-green rounded-full hover:from-islamic-green hover:to-islamic-green/90 hover:text-white transition-all duration-300 cursor-pointer font-semibold transform hover:scale-105 hover:shadow-lg"
                >
                  🍽️ {t.restaurants}
                </button>
                <button
                  onClick={() => handleQuickSearch('category', 'market')}
                  className="group px-6 py-3 bg-gradient-to-r from-islamic-green/10 to-islamic-green/20 text-islamic-green rounded-full hover:from-islamic-green hover:to-islamic-green/90 hover:text-white transition-all duration-300 cursor-pointer font-semibold transform hover:scale-105 hover:shadow-lg"
                >
                  🛒 {t.markets}
                </button>
                <button
                  onClick={() => handleQuickSearch('category', 'prayer_room')}
                  className="group px-6 py-3 bg-gradient-to-r from-islamic-green/10 to-islamic-green/20 text-islamic-green rounded-full hover:from-islamic-green hover:to-islamic-green/90 hover:text-white transition-all duration-300 cursor-pointer font-semibold transform hover:scale-105 hover:shadow-lg"
                >
                  🕌 {t.prayerRooms}
                </button>
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">인기 지역</h4>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => handleQuickSearch('location', 'itaewon')}
                  className="group px-6 py-3 bg-gradient-to-r from-islamic-gold/10 to-islamic-gold/20 text-islamic-gold rounded-full hover:from-islamic-gold hover:to-yellow-500 hover:text-white transition-all duration-300 cursor-pointer font-semibold transform hover:scale-105 hover:shadow-lg"
                >
                  📍 {t.itaewon}
                </button>
                <button
                  onClick={() => handleQuickSearch('location', 'myeongdong')}
                  className="group px-6 py-3 bg-gradient-to-r from-islamic-gold/10 to-islamic-gold/20 text-islamic-gold rounded-full hover:from-islamic-gold hover:to-yellow-500 hover:text-white transition-all duration-300 cursor-pointer font-semibold transform hover:scale-105 hover:shadow-lg"
                >
                  📍 {t.myeongdong}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-islamic-green mb-2">10+</div>
            <div className="text-gray-600 text-sm">할랄 음식점</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-islamic-gold mb-2">24/7</div>
            <div className="text-gray-600 text-sm">AI 스캐너</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
            <div className="text-gray-600 text-sm">언어 지원</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
            <div className="text-gray-600 text-sm">할랄 인증</div>
          </div>
        </div>
      </div>
    </main>
  )
}