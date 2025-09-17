export interface HalalPlace {
  id: number
  name: string
  category: 'restaurant' | 'market' | 'prayer_room'
  latitude: number
  longitude: number
  address: string
  phone?: string
  rating?: number
  halalLevel: 'certified' | 'reliable' | 'unknown'
  description?: string
  openingHours?: string
  website?: string
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: number
  title: string
  content: string
  category: 'food' | 'prayer_room' | 'life_info' | 'other'
  language: 'ko' | 'en' | 'ar'
  authorName: string
  authorEmail?: string
  imageUrl?: string
  likes: number
  createdAt: Date
  updatedAt: Date
  comments?: Comment[]
}

export interface Comment {
  id: number
  content: string
  authorName: string
  authorEmail?: string
  postId: number
  createdAt: Date
}

export interface ScanHistory {
  id: number
  productName?: string
  imageUrl?: string
  isHalal: boolean
  confidence: number
  analysisResult: string
  reason?: string
  concernedIngredients?: string
  recommendation?: string
  language: string
  createdAt: Date
}

export interface AnalysisResult {
  is_halal: boolean
  confidence: number
  reason: string
  ingredients_concern: string[]
  recommendation: string
}

export interface MapFilters {
  category?: 'restaurant' | 'market' | 'prayer_room' | 'all'
  halalLevel?: 'certified' | 'reliable' | 'unknown' | 'all'
  radius?: number
}