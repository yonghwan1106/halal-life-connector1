'use client'

import { useState } from 'react'
import { ArrowLeft, Camera } from 'lucide-react'
import Link from 'next/link'
import HalalScanner from '@/components/HalalScanner'

export default function ScannerPage() {
  const [language, setLanguage] = useState<'ko' | 'en' | 'ar'>('ko')

  return (
    <div className="min-h-screen bg-islamic-light">
      {/* Header */}
      <header className="bg-islamic-gold text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:text-white/80">
              <ArrowLeft className="h-5 w-5" />
              <span>뒤로</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Camera className="h-6 w-6" />
              <h1 className="text-xl font-bold">AI 할랄 스캐너</h1>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setLanguage('ko')}
              className={`px-3 py-1 rounded text-sm ${
                language === 'ko'
                  ? 'bg-white text-islamic-gold'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              한국어
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-sm ${
                language === 'en'
                  ? 'bg-white text-islamic-gold'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1 rounded text-sm ${
                language === 'ar'
                  ? 'bg-white text-islamic-gold'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              العربية
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Info Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">🤖 AI 할랄 분석기 사용법</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-islamic-light rounded-lg">
              <div className="text-2xl mb-2">📷</div>
              <h3 className="font-semibold mb-2">1. 사진 촬영</h3>
              <p className="text-gray-600">제품의 성분표 부분을 명확하게 촬영하세요</p>
            </div>
            <div className="text-center p-4 bg-islamic-light rounded-lg">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-semibold mb-2">2. AI 분석</h3>
              <p className="text-gray-600">Claude AI가 성분을 분석하여 할랄 여부를 판별합니다</p>
            </div>
            <div className="text-center p-4 bg-islamic-light rounded-lg">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="font-semibold mb-2">3. 결과 확인</h3>
              <p className="text-gray-600">신뢰도와 함께 상세한 분석 결과를 확인하세요</p>
            </div>
          </div>
        </div>

        {/* Scanner Component */}
        <HalalScanner language={language} />

        {/* Disclaimer */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ 주의사항</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• AI 분석 결과는 참고용으로만 사용하세요</li>
            <li>• 확실하지 않은 경우 제조사나 할랄 인증기관에 문의하세요</li>
            <li>• 성분표가 명확하지 않은 사진은 정확도가 떨어질 수 있습니다</li>
            <li>• 최종 판단은 개인의 종교적 신념에 따라 결정하시기 바랍니다</li>
          </ul>
        </div>

        {/* Sample Products for Testing */}
        <div className="mt-6 bg-white rounded-lg p-6 shadow-lg">
          <h3 className="font-semibold text-lg mb-4">🧪 테스트용 샘플 제품</h3>
          <p className="text-gray-600 mb-4">AI 스캐너를 테스트해보고 싶다면 아래 제품들의 성분표를 검색하여 사용해보세요:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-islamic-light p-3 rounded">
              <div className="font-medium">불닭볶음면</div>
              <div className="text-xs text-gray-600">할랄 여부 확인</div>
            </div>
            <div className="bg-islamic-light p-3 rounded">
              <div className="font-medium">신라면</div>
              <div className="text-xs text-gray-600">성분 분석</div>
            </div>
            <div className="bg-islamic-light p-3 rounded">
              <div className="font-medium">하리보 젤리</div>
              <div className="text-xs text-gray-600">젤라틴 확인</div>
            </div>
            <div className="bg-islamic-light p-3 rounded">
              <div className="font-medium">김밥</div>
              <div className="text-xs text-gray-600">포장 김밥</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}