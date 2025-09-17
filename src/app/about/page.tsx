'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Award, Users, MapPin, Camera, Heart, Globe, Star, Zap, Shield, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

type Language = 'ko' | 'en' | 'ar'

const translations = {
  ko: {
    backToHome: '홈으로 돌아가기',
    aboutTitle: '할랄 라이프 커넥터 소개',
    competitionBadge: '2025 한-아랍 스타트업 아이디어 공모전 제출작',
    heroTitle: '한국과 중동을 잇는 할랄 생활 플랫폼',
    heroSubtitle: '기술로 연결하고, 문화로 소통하며, 신뢰로 만나는 할랄 라이프',
    problemTitle: '해결하고자 하는 문제',
    problemDesc: '한국 거주 무슬림들이 겪는 할랄 생활의 어려움을 AI 기술로 해결합니다',
    solutionTitle: '우리의 솔루션',
    solutionDesc: 'AI 기반 할랄 제품 분석, 위치 기반 할랄 시설 검색, 커뮤니티 소통을 통한 종합 할랄 라이프 플랫폼',
    featuresTitle: '핵심 기능',
    impactTitle: '기대 효과',
    teamTitle: '우리 팀',
    visionTitle: '비전',
    visionDesc: '한국과 중동 간의 문화적 다리 역할을 하며, 모든 무슬림이 한국에서 편안하게 할랄 라이프를 누릴 수 있는 세상을 만듭니다',
    features: {
      aiScanner: {
        title: 'AI 할랄 스캐너',
        desc: 'Claude AI 기반 실시간 제품 성분 분석으로 할랄 여부를 즉시 확인'
      },
      smartMap: {
        title: '스마트 할랄 맵',
        desc: 'GPS 기반 주변 할랄 음식점, 마트, 기도실 검색 및 상세 정보 제공'
      },
      community: {
        title: '다문화 커뮤니티',
        desc: '한국어, 영어, 아랍어 지원으로 무슬림 간 정보 공유 및 소통 공간'
      }
    },
    problems: [
      '할랄 제품 식별의 어려움',
      '할랄 시설 정보 부족',
      '언어 장벽으로 인한 소통 문제',
      '분산된 정보로 인한 불편함'
    ],
    impacts: [
      '30만 한국 거주 무슬림의 생활 편의성 향상',
      '연간 100만 중동 관광객의 한국 여행 만족도 증진',
      '할랄 산업 성장 및 일자리 창출',
      '한-아랍 문화 교류 활성화'
    ],
    techStack: '기술 스택',
    awards: '수상 및 인정'
  },
  en: {
    backToHome: 'Back to Home',
    aboutTitle: 'About Halal Life Connector',
    competitionBadge: '2025 Korea-Arab Startup Idea Competition Entry',
    heroTitle: 'Halal Living Platform Connecting Korea and Middle East',
    heroSubtitle: 'Connected by Technology, Communicated through Culture, United by Trust',
    problemTitle: 'Problems We Solve',
    problemDesc: 'Solving halal living difficulties faced by Muslims in Korea through AI technology',
    solutionTitle: 'Our Solution',
    solutionDesc: 'Comprehensive halal life platform with AI-based halal product analysis, location-based halal facility search, and community communication',
    featuresTitle: 'Key Features',
    impactTitle: 'Expected Impact',
    teamTitle: 'Our Team',
    visionTitle: 'Vision',
    visionDesc: 'Creating a world where all Muslims can comfortably enjoy halal life in Korea, serving as a cultural bridge between Korea and the Middle East',
    features: {
      aiScanner: {
        title: 'AI Halal Scanner',
        desc: 'Real-time product ingredient analysis using Claude AI to instantly verify halal status'
      },
      smartMap: {
        title: 'Smart Halal Map',
        desc: 'GPS-based search for nearby halal restaurants, markets, prayer rooms with detailed information'
      },
      community: {
        title: 'Multicultural Community',
        desc: 'Information sharing and communication space for Muslims with Korean, English, Arabic support'
      }
    },
    problems: [
      'Difficulty identifying halal products',
      'Lack of halal facility information',
      'Communication barriers due to language',
      'Inconvenience from scattered information'
    ],
    impacts: [
      'Improved convenience for 300K Muslims in Korea',
      'Enhanced satisfaction for 1M Middle Eastern tourists annually',
      'Growth of halal industry and job creation',
      'Activation of Korea-Arab cultural exchange'
    ],
    techStack: 'Tech Stack',
    awards: 'Awards & Recognition'
  },
  ar: {
    backToHome: 'العودة للرئيسية',
    aboutTitle: 'حول موصل الحياة الحلال',
    competitionBadge: 'مشاركة في مسابقة الأفكار الناشئة الكورية-العربية 2025',
    heroTitle: 'منصة الحياة الحلال التي تربط كوريا والشرق الأوسط',
    heroSubtitle: 'متصلون بالتكنولوجيا، نتواصل عبر الثقافة، متحدون بالثقة',
    problemTitle: 'المشاكل التي نحلها',
    problemDesc: 'حل صعوبات الحياة الحلال التي يواجهها المسلمون في كوريا من خلال تقنية الذكاء الاصطناعي',
    solutionTitle: 'حلولنا',
    solutionDesc: 'منصة شاملة للحياة الحلال مع تحليل المنتجات الحلال بالذكاء الاصطناعي والبحث عن المرافق الحلال والتواصل المجتمعي',
    featuresTitle: 'الميزات الأساسية',
    impactTitle: 'التأثير المتوقع',
    teamTitle: 'فريقنا',
    visionTitle: 'الرؤية',
    visionDesc: 'خلق عالم يمكن فيه لجميع المسلمين الاستمتاع بالحياة الحلال براحة في كوريا، والعمل كجسر ثقافي بين كوريا والشرق الأوسط',
    features: {
      aiScanner: {
        title: 'ماسح الحلال بالذكاء الاصطناعي',
        desc: 'تحليل مكونات المنتجات في الوقت الفعلي باستخدام Claude AI للتحقق من الحالة الحلال فوراً'
      },
      smartMap: {
        title: 'خريطة الحلال الذكية',
        desc: 'البحث القائم على نظام تحديد المواقع عن المطاعم والأسواق وغرف الصلاة الحلال القريبة مع معلومات مفصلة'
      },
      community: {
        title: 'المجتمع متعدد الثقافات',
        desc: 'مساحة لتبادل المعلومات والتواصل بين المسلمين مع دعم الكورية والإنجليزية والعربية'
      }
    },
    problems: [
      'صعوبة تحديد المنتجات الحلال',
      'نقص معلومات المرافق الحلال',
      'حواجز التواصل بسبب اللغة',
      'الإزعاج من المعلومات المتناثرة'
    ],
    impacts: [
      'تحسين الراحة لـ 300 ألف مسلم في كوريا',
      'تعزيز رضا مليون سائح من الشرق الأوسط سنوياً',
      'نمو صناعة الحلال وخلق فرص العمل',
      'تفعيل التبادل الثقافي الكوري-العربي'
    ],
    techStack: 'المكدس التقني',
    awards: 'الجوائز والاعتراف'
  }
}

export default function AboutPage() {
  const [language, setLanguage] = useState<Language>('ko')
  const t = translations[language]

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-light via-white to-islamic-green/5">
      {/* Header */}
      <header className="bg-islamic-green text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:text-white/80 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>{t.backToHome}</span>
          </Link>
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

      {/* Competition Badge */}
      <div className="bg-gradient-to-r from-islamic-gold to-yellow-500 text-white py-3">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2">
            <Award className="h-5 w-5" />
            <span className="font-semibold">{t.competitionBadge}</span>
            <Award className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-islamic-dark mb-6 leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg">
                <MapPin className="h-5 w-5 text-islamic-green" />
                <span className="font-medium">Smart Location</span>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg">
                <Camera className="h-5 w-5 text-islamic-gold" />
                <span className="font-medium">AI Scanner</span>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Problem */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-islamic-dark flex items-center">
                <Heart className="h-8 w-8 text-red-500 mr-3" />
                {t.problemTitle}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t.problemDesc}
              </p>
              <div className="space-y-3">
                {t.problems.map((problem, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{problem}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-islamic-dark flex items-center">
                <Zap className="h-8 w-8 text-islamic-green mr-3" />
                {t.solutionTitle}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t.solutionDesc}
              </p>
              <div className="bg-islamic-green/5 rounded-lg p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Camera className="h-12 w-12 text-islamic-gold mx-auto mb-2" />
                    <div className="text-2xl font-bold text-islamic-green">AI</div>
                    <div className="text-sm text-gray-600">Scanner</div>
                  </div>
                  <div>
                    <MapPin className="h-12 w-12 text-islamic-green mx-auto mb-2" />
                    <div className="text-2xl font-bold text-islamic-green">GPS</div>
                    <div className="text-sm text-gray-600">Location</div>
                  </div>
                  <div>
                    <Users className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-islamic-green">3개</div>
                    <div className="text-sm text-gray-600">Languages</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-r from-islamic-green/5 to-islamic-gold/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-islamic-dark mb-4">{t.featuresTitle}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(t.features).map(([key, feature]) => (
              <div key={key} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow group">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-islamic-green to-islamic-gold rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    {key === 'aiScanner' && <Camera className="h-10 w-10 text-white" />}
                    {key === 'smartMap' && <MapPin className="h-10 w-10 text-white" />}
                    {key === 'community' && <Users className="h-10 w-10 text-white" />}
                  </div>
                  <h3 className="text-xl font-bold text-islamic-dark mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-islamic-dark mb-4">{t.techStack}</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Next.js 14', icon: '⚡', color: 'blue' },
              { name: 'Claude AI', icon: '🤖', color: 'purple' },
              { name: 'Prisma', icon: '🗄️', color: 'green' },
              { name: 'Vercel', icon: '🚀', color: 'black' }
            ].map((tech) => (
              <div key={tech.name} className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors">
                <div className="text-4xl mb-2">{tech.icon}</div>
                <div className="font-semibold text-gray-800">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 bg-islamic-green text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t.impactTitle}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {t.impacts.map((impact, index) => (
              <div key={index} className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-islamic-gold flex-shrink-0 mt-1" />
                <span className="text-lg">{impact}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-gradient-to-br from-islamic-gold/10 via-white to-islamic-green/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Globe className="h-16 w-16 text-islamic-green mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-islamic-dark mb-6">{t.visionTitle}</h2>
            <p className="text-xl text-gray-600 leading-relaxed">{t.visionDesc}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-islamic-green text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">지금 바로 할랄 라이프를 시작하세요</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/map" className="bg-white text-islamic-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              할랄 맵 둘러보기
            </Link>
            <Link href="/scanner" className="bg-islamic-gold text-white px-8 py-3 rounded-lg font-semibold hover:bg-islamic-gold/90 transition-colors">
              AI 스캐너 체험
            </Link>
            <Link href="/community" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600/90 transition-colors">
              커뮤니티 참여
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}