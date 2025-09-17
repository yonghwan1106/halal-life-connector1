import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.scanHistory.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.halalPlace.deleteMany()

  // Sample Halal Places in Seoul
  const halalPlaces = [
    {
      name: "알리바바 케밥",
      category: "restaurant",
      latitude: 37.5344,
      longitude: 126.9944,
      address: "서울시 용산구 이태원동 119-25",
      phone: "02-794-8786",
      rating: 4.5,
      halalLevel: "certified",
      description: "이태원의 정통 터키 케밥 전문점",
      openingHours: "11:00-23:00",
      website: "https://alibaba-kebab.com"
    },
    {
      name: "술탄케밥",
      category: "restaurant",
      latitude: 37.5636,
      longitude: 126.9835,
      address: "서울시 중구 명동2가 25-36",
      phone: "02-318-2950",
      rating: 4.3,
      halalLevel: "certified",
      description: "명동의 할랄 인증 중동 음식점",
      openingHours: "10:00-22:00"
    },
    {
      name: "이슬람 푸드",
      category: "restaurant",
      latitude: 37.5823,
      longitude: 127.0028,
      address: "서울시 종로구 혜화동 1-106",
      phone: "02-765-3322",
      rating: 4.2,
      halalLevel: "reliable",
      description: "혜화동의 할랄 음식 전문점",
      openingHours: "12:00-21:00"
    },
    {
      name: "터키쉬 키친",
      category: "restaurant",
      latitude: 37.5563,
      longitude: 126.9239,
      address: "서울시 마포구 홍익로 27",
      phone: "02-334-7788",
      rating: 4.4,
      halalLevel: "certified",
      description: "홍대 터키 전통 요리 전문점",
      openingHours: "17:00-24:00"
    },
    {
      name: "할랄가이즈 강남점",
      category: "restaurant",
      latitude: 37.4979,
      longitude: 127.0276,
      address: "서울시 강남구 강남대로 390",
      phone: "02-538-9900",
      rating: 4.6,
      halalLevel: "certified",
      description: "강남의 할랄 패스트푸드 체인점",
      openingHours: "11:00-22:00",
      website: "https://halalguys.kr"
    },
    {
      name: "이태원 할랄 마트",
      category: "market",
      latitude: 37.5349,
      longitude: 126.9947,
      address: "서울시 용산구 이태원로 177",
      phone: "02-790-4455",
      rating: 4.1,
      halalLevel: "certified",
      description: "이태원 최대 규모 할랄 식료품점",
      openingHours: "09:00-23:00"
    },
    {
      name: "명동 할랄 스토어",
      category: "market",
      latitude: 37.5636,
      longitude: 126.9835,
      address: "서울시 중구 명동길 74",
      phone: "02-752-1234",
      rating: 3.9,
      halalLevel: "reliable",
      description: "명동 관광객을 위한 할랄 편의점",
      openingHours: "08:00-24:00"
    },
    {
      name: "서울중앙성원 기도실",
      category: "prayer_room",
      latitude: 37.5665,
      longitude: 126.9780,
      address: "서울시 중구 소공로 63",
      phone: "02-756-2846",
      rating: 4.8,
      halalLevel: "certified",
      description: "서울 시내 최대 규모 이슬람 성원",
      openingHours: "05:00-22:00",
      website: "https://seoul-mosque.or.kr"
    },
    {
      name: "한양대학교 기도실",
      category: "prayer_room",
      latitude: 37.5551,
      longitude: 127.0448,
      address: "서울시 성동구 왕십리로 222",
      phone: "02-2220-0114",
      rating: 4.3,
      halalLevel: "reliable",
      description: "한양대학교 내 무슬림 학생용 기도실",
      openingHours: "24시간"
    },
    {
      name: "연세대학교 기도실",
      category: "prayer_room",
      latitude: 37.5665,
      longitude: 126.9387,
      address: "서울시 서대문구 연세로 50",
      phone: "02-2123-2114",
      rating: 4.2,
      halalLevel: "reliable",
      description: "연세대학교 국제캠퍼스 기도실",
      openingHours: "06:00-23:00"
    }
  ]

  // Insert halal places
  for (const place of halalPlaces) {
    await prisma.halalPlace.create({
      data: place
    })
  }

  // Sample Posts
  const posts = [
    {
      title: "서울에서 맛있는 할랄 음식점 추천",
      content: "이태원 알리바바 케밥을 추천합니다. 정말 맛있고 할랄 인증도 받았어요!",
      category: "food",
      language: "ko",
      authorName: "아흐메드",
      likes: 12
    },
    {
      title: "Prayer room near Gangnam Station",
      content: "Is there any prayer room available near Gangnam station? I need to pray during lunch break.",
      category: "prayer_room",
      language: "en",
      authorName: "Fatima",
      likes: 8
    },
    {
      title: "한국 생활 팁 공유",
      content: "한국에서 생활하면서 도움이 되는 팁들을 공유해보아요. 할랄 식품 구매처, 기도실 위치 등",
      category: "life_info",
      language: "ko",
      authorName: "무하마드",
      likes: 15
    }
  ]

  for (const post of posts) {
    await prisma.post.create({
      data: post
    })
  }

  console.log('✅ Sample data seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })