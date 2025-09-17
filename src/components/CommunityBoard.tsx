'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Heart, Clock, User, Plus, Send } from 'lucide-react'
import { Post, Comment } from '@/types'

interface CommunityBoardProps {
  language?: 'ko' | 'en' | 'ar'
}

export default function CommunityBoard({ language = 'ko' }: CommunityBoardProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: 'all',
    language: 'all'
  })
  const [showNewPostForm, setShowNewPostForm] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'food',
    language: 'ko',
    authorName: '',
    authorEmail: ''
  })
  const [newComment, setNewComment] = useState<{ [key: number]: { content: string; authorName: string } }>({})

  useEffect(() => {
    fetchPosts()
  }, [filters])

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.category !== 'all') params.set('category', filters.category)
      if (filters.language !== 'all') params.set('language', filters.language)

      const response = await fetch(`/api/posts?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      })

      if (response.ok) {
        setNewPost({
          title: '',
          content: '',
          category: 'food',
          language: 'ko',
          authorName: '',
          authorEmail: ''
        })
        setShowNewPostForm(false)
        fetchPosts()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handleSubmitComment = async (postId: number) => {
    const comment = newComment[postId]
    if (!comment?.content || !comment?.authorName) return

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment)
      })

      if (response.ok) {
        setNewComment(prev => ({ ...prev, [postId]: { content: '', authorName: '' } }))
        fetchPosts()
      }
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  const getCategoryText = (category: string) => {
    const categories = {
      ko: {
        food: '음식',
        prayer_room: '기도실',
        life_info: '생활정보',
        other: '기타'
      },
      en: {
        food: 'Food',
        prayer_room: 'Prayer Room',
        life_info: 'Life Info',
        other: 'Other'
      },
      ar: {
        food: 'طعام',
        prayer_room: 'غرفة الصلاة',
        life_info: 'معلومات الحياة',
        other: 'أخرى'
      }
    }
    return categories[language]?.[category as keyof typeof categories.ko] || category
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      food: 'bg-green-100 text-green-800',
      prayer_room: 'bg-blue-100 text-blue-800',
      life_info: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const texts = {
    ko: {
      newPost: '새 글 작성',
      title: '제목',
      content: '내용',
      category: '카테고리',
      author: '작성자',
      email: '이메일 (선택)',
      submit: '게시',
      cancel: '취소',
      comment: '댓글',
      writeComment: '댓글 작성...',
      addComment: '댓글 추가',
      noComments: '댓글이 없습니다.',
      showMore: '더 보기',
      filters: '필터',
      allCategories: '전체 카테고리',
      allLanguages: '전체 언어'
    },
    en: {
      newPost: 'New Post',
      title: 'Title',
      content: 'Content',
      category: 'Category',
      author: 'Author',
      email: 'Email (optional)',
      submit: 'Submit',
      cancel: 'Cancel',
      comment: 'Comment',
      writeComment: 'Write a comment...',
      addComment: 'Add Comment',
      noComments: 'No comments yet.',
      showMore: 'Show more',
      filters: 'Filters',
      allCategories: 'All Categories',
      allLanguages: 'All Languages'
    },
    ar: {
      newPost: 'منشور جديد',
      title: 'العنوان',
      content: 'المحتوى',
      category: 'الفئة',
      author: 'المؤلف',
      email: 'البريد الإلكتروني (اختياري)',
      submit: 'إرسال',
      cancel: 'إلغاء',
      comment: 'تعليق',
      writeComment: 'اكتب تعليقاً...',
      addComment: 'إضافة تعليق',
      noComments: 'لا توجد تعليقات بعد.',
      showMore: 'عرض المزيد',
      filters: 'المرشحات',
      allCategories: 'جميع الفئات',
      allLanguages: 'جميع اللغات'
    }
  }

  const t = texts[language]

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-islamic-green border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading posts...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and New Post Button */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.category}</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green"
              >
                <option value="all">{t.allCategories}</option>
                <option value="food">{getCategoryText('food')}</option>
                <option value="prayer_room">{getCategoryText('prayer_room')}</option>
                <option value="life_info">{getCategoryText('life_info')}</option>
                <option value="other">{getCategoryText('other')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">언어</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green"
              >
                <option value="all">{t.allLanguages}</option>
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowNewPostForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-islamic-green text-white rounded-lg hover:bg-islamic-green/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>{t.newPost}</span>
          </button>
        </div>
      </div>

      {/* New Post Form */}
      {showNewPostForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmitPost} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.title}</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.content}</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.category}</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green"
                >
                  <option value="food">{getCategoryText('food')}</option>
                  <option value="prayer_room">{getCategoryText('prayer_room')}</option>
                  <option value="life_info">{getCategoryText('life_info')}</option>
                  <option value="other">{getCategoryText('other')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">언어</label>
                <select
                  value={newPost.language}
                  onChange={(e) => setNewPost(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.author}</label>
                <input
                  type="text"
                  value={newPost.authorName}
                  onChange={(e) => setNewPost(prev => ({ ...prev, authorName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 bg-islamic-green text-white rounded-lg hover:bg-islamic-green/90 transition-colors"
              >
                {t.submit}
              </button>
              <button
                type="button"
                onClick={() => setShowNewPostForm(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-600/90 transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
            <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p>아직 게시물이 없습니다. 첫 번째 글을 작성해보세요!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-lg p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(post.category)}`}>
                      {getCategoryText(post.category)}
                    </span>
                    <span className="text-xs text-gray-500">{post.language.toUpperCase()}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.authorName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(post.createdAt.toString())}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* Post Stats */}
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments?.length || 0} {t.comment}</span>
                </div>
              </div>

              {/* Comments */}
              {post.comments && post.comments.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{comment.authorName}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt.toString())}</span>
                      </div>
                      <p className="text-sm text-gray-600">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="border-t pt-4 mt-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder={t.writeComment}
                    value={newComment[post.id]?.content || ''}
                    onChange={(e) => setNewComment(prev => ({
                      ...prev,
                      [post.id]: { ...prev[post.id], content: e.target.value }
                    }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green text-sm"
                  />
                  <input
                    type="text"
                    placeholder={t.author}
                    value={newComment[post.id]?.authorName || ''}
                    onChange={(e) => setNewComment(prev => ({
                      ...prev,
                      [post.id]: { ...prev[post.id], authorName: e.target.value }
                    }))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-islamic-green text-sm"
                  />
                  <button
                    onClick={() => handleSubmitComment(post.id)}
                    disabled={!newComment[post.id]?.content || !newComment[post.id]?.authorName}
                    className="px-4 py-2 bg-islamic-green text-white rounded-md hover:bg-islamic-green/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}