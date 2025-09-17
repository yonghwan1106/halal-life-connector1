# 할랄 라이프 커넥터 (Halal Life Connector)

한국에서 생활하는 무슬림들을 위한 종합 플랫폼입니다.

## 🌟 주요 기능

### 1. 🗺 할랄 맵
- 서울 지역 할랄 음식점, 마트, 기도실 위치 정보
- 카테고리별 필터링 (음식점, 마트, 기도실)
- 할랄 인증 수준별 분류 (인증됨, 신뢰할만함, 미확인)
- Google Maps 연동 길찾기
- 실시간 위치 기반 검색

### 2. 🤖 AI 할랄 스캐너
- Claude AI 기반 제품 성분 분석
- 사진 업로드로 할랄/하람 여부 자동 판별
- 다국어 지원 (한국어, 영어, 아랍어)
- 신뢰도 점수 및 상세 분석 결과 제공
- 문제 성분 하이라이트 및 대안 제품 추천

### 3. 👥 커뮤니티
- 무슬림 커뮤니티 게시판
- 카테고리별 정보 공유 (음식, 기도실, 생활정보, 기타)
- 실시간 댓글 시스템
- 다국어 게시물 지원

## 🛠 기술 스택

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS with Islamic-friendly color scheme
- **Database**: SQLite with Prisma ORM
- **AI**: Claude API (Anthropic)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary Green**: #059669 (이슬람 상징색)
- **Gold Accent**: #F59E0B (고급스러운 강조색)
- **Light Background**: #F9FAFB
- **Text Dark**: #1F2937

### 반응형 디자인
- 모바일 우선 설계
- Tablet 및 Desktop 최적화
- 터치 친화적 UI 요소

## 📊 데이터베이스 스키마

### HalalPlace (할랄 시설)
- 이름, 카테고리, 위치 좌표
- 연락처, 평점, 할랄 인증 수준
- 운영시간, 웹사이트, 설명

### Post (커뮤니티 게시물)
- 제목, 내용, 카테고리, 언어
- 작성자 정보, 좋아요 수
- 연관된 댓글들

### ScanHistory (AI 스캔 기록)
- 제품 정보, 분석 결과
- 할랄 여부, 신뢰도, 문제 성분
- 추천사항, 사용 언어

## 🚀 설치 및 실행

### 환경 설정
```bash
# 의존성 설치
npm install

# 환경 변수 설정 (.env 파일)
DATABASE_URL="file:./dev.db"
ANTHROPIC_API_KEY="your_claude_api_key_here"

# 데이터베이스 설정
npx prisma generate
npx prisma db push
npm run db:seed
```

### 개발 서버 실행
```bash
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
npm start
```

## 📱 주요 페이지

- `/` - 메인 홈페이지
- `/map` - 할랄 맵 (위치 기반 검색)
- `/scanner` - AI 할랄 스캐너
- `/community` - 커뮤니티 게시판

## 🔒 보안 및 개인정보

- 사용자 위치 정보는 클라이언트에서만 처리
- 업로드된 이미지는 분석 후 저장되지 않음
- 개인정보는 최소한으로 수집 (선택적 이메일만)

## 🌍 다국어 지원

- 한국어 (Korean) - 기본 언어
- 영어 (English) - 국제 사용자
- 아랍어 (Arabic) - 중동 사용자

## 📈 성능 최적화

- Next.js App Router 사용
- 이미지 최적화 (next/image)
- 정적 생성 및 서버사이드 렌더링
- Vercel Edge Functions

## 🤝 기여 방법

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 만드세요 (`git checkout -b feature/새기능`)
3. 변경사항을 커밋하세요 (`git commit -am '새 기능 추가'`)
4. 브랜치에 푸시하세요 (`git push origin feature/새기능`)
5. Pull Request를 생성하세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 🙏 감사의 말

- Claude AI (Anthropic) - AI 분석 기능
- Lucide - 아이콘 제공
- Tailwind CSS - 스타일링 프레임워크
- Vercel - 호스팅 플랫폼

---

**할랄 라이프 커넥터**는 한국 거주 무슬림들의 생활 편의를 위해 개발된 오픈소스 프로젝트입니다.