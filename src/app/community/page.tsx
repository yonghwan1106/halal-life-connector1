'use client'

import { useState } from 'react'
import { ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'
import CommunityBoard from '@/components/CommunityBoard'

export default function CommunityPage() {
  const [language, setLanguage] = useState<'ko' | 'en' | 'ar'>('ko')

  return (
    <div className="min-h-screen bg-islamic-light">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:text-white/80">
              <ArrowLeft className="h-5 w-5" />
              <span>뒤로</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <h1 className="text-xl font-bold">커뮤니티</h1>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setLanguage('ko')}
              className={`px-3 py-1 rounded text-sm ${
                language === 'ko'
                  ? 'bg-white text-blue-600'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              한국어
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-sm ${
                language === 'en'
                  ? 'bg-white text-blue-600'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1 rounded text-sm ${
                language === 'ar'
                  ? 'bg-white text-blue-600'
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
        {/* Welcome Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🤝 무슬림 커뮤니티에 오신 것을 환영합니다</h2>
          <p className="text-gray-600 mb-4">
            한국에서 생활하는 무슬림들이 정보를 공유하고 소통하는 공간입니다.
            할랄 음식 추천, 기도실 정보, 생활 팁 등을 자유롭게 나누어보세요.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-islamic-light p-3 rounded-lg">
              <div className="text-lg font-bold text-islamic-green">음식</div>
              <div className="text-sm text-gray-600">할랄 음식점 정보</div>
            </div>
            <div className="bg-islamic-light p-3 rounded-lg">
              <div className="text-lg font-bold text-islamic-green">기도실</div>
              <div className="text-sm text-gray-600">기도 공간 안내</div>
            </div>
            <div className="bg-islamic-light p-3 rounded-lg">
              <div className="text-lg font-bold text-islamic-green">생활정보</div>
              <div className="text-sm text-gray-600">한국 생활 팁</div>
            </div>
            <div className="bg-islamic-light p-3 rounded-lg">
              <div className="text-lg font-bold text-islamic-green">기타</div>
              <div className="text-sm text-gray-600">자유 주제</div>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-3">📋 커뮤니티 이용 가이드</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">✅ 권장사항</h4>
              <ul className="space-y-1">
                <li>• 정확하고 유용한 정보 공유</li>
                <li>• 서로를 존중하는 대화</li>
                <li>• 구체적이고 명확한 제목 작성</li>
                <li>• 카테고리에 맞는 게시물 작성</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">❌ 주의사항</h4>
              <ul className="space-y-1">
                <li>• 상업적 광고 및 스팸</li>
                <li>• 종교적 논쟁이나 갈등 조장</li>
                <li>• 개인정보 노출</li>
                <li>• 부적절한 언어 사용</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Community Board Component */}
        <CommunityBoard language={language} />

        {/* Footer Info */}
        <div className="mt-8 bg-white rounded-lg p-4 shadow-lg text-center text-sm text-gray-500">
          <p>이 커뮤니티는 한국 거주 무슬림들의 상호 도움을 위한 공간입니다.</p>
          <p>모든 게시물과 댓글은 커뮤니티 가이드라인을 준수해야 합니다.</p>
        </div>
      </div>
    </div>
  )
}