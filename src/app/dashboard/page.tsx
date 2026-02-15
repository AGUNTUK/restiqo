'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Calendar,
  Heart,
  Settings,
  User,
  Star,
  MapPin,
  Clock,
  Loader2,
  LayoutDashboard,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'guest' | 'host' | 'admin'
  created_at: string
}

interface Booking {
  id: string
  property: {
    id: string
    title: string
    images: string[]
    location: string
  }
  check_in: string
  check_out: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  total_price: number
}

interface WishlistItem {
  id: string
  property: {
    id: string
    title: string
    images: string[]
    location: string
    price: number
    rating: number
  }
}

const tabs = [
  { id: 'bookings', label: 'My Bookings', icon: Calendar },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [activeTab, setActiveTab] = useState('bookings')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    const supabase = createClient()

    // Get session
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      router.push('/auth/login?redirect=/dashboard')
      return
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profile) {
      setUser(profile)
    } else {
      setUser({
        id: session.user.id,
        email: session.user.email || '',
        full_name: session.user.user_metadata?.full_name || null,
        avatar_url: session.user.user_metadata?.avatar_url || null,
        role: session.user.user_metadata?.role || 'guest',
        created_at: new Date().toISOString(),
      })
    }

    // Get bookings
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select(`
        id,
        check_in,
        check_out,
        status,
        total_price,
        property:properties (
          id,
          title,
          images,
          location
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (bookingsData) {
      setBookings(bookingsData as Booking[])
    }

    // Get wishlist
    const { data: wishlistData } = await supabase
      .from('wishlists')
      .select(`
        id,
        property:properties (
          id,
          title,
          images,
          location,
          price,
          rating
        )
      `)
      .eq('user_id', session.user.id)

    if (wishlistData) {
      setWishlist(wishlistData as WishlistItem[])
    }

    setLoading(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="clay p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="clay-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              {user?.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.full_name || 'User'}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
              <Link
                href="/profile"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-primary text-white shadow-lg hover:bg-brand-primary-dark transition-colors"
              >
                <User className="w-4 h-4" />
              </Link>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {user?.full_name || 'Welcome!'}
              </h1>
              <p className="text-gray-600 mb-3">{user?.email}</p>
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-brand-primary/10 text-brand-primary capitalize">
                {user?.role}
              </span>
            </div>
            <div className="flex gap-3">
              {user?.role === 'guest' && (
                <Link href="/host/register">
                  <Button variant="accent">Become a Host</Button>
                </Link>
              )}
              <Link href="/profile">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="clay p-4 text-center"
          >
            <Calendar className="w-8 h-8 text-brand-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
            <p className="text-sm text-gray-500">Bookings</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="clay p-4 text-center"
          >
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
            <p className="text-sm text-gray-500">Wishlist</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="clay p-4 text-center"
          >
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500">Reviews</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="clay p-4 text-center"
          >
            <LayoutDashboard className="w-8 h-8 text-brand-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 capitalize">{user?.role}</p>
            <p className="text-sm text-gray-500">Account Type</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-primary text-white'
                  : 'bg-white/70 text-gray-700 hover:bg-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Bookings</h2>
              {bookings.length === 0 ? (
                <div className="clay-lg p-8 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No bookings yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start exploring and book your first stay!
                  </p>
                  <Link href="/apartments">
                    <Button variant="primary">Explore Properties</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="clay-card p-4 flex flex-col md:flex-row gap-4">
                      <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden">
                        {booking.property.images?.[0] ? (
                          <Image
                            src={booking.property.images[0]}
                            alt={booking.property.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {booking.property.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.property.location}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>
                              {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                            </span>
                          </div>
                          <div className="font-semibold text-gray-900">
                            {formatPrice(booking.total_price)}
                          </div>
                        </div>
                      </div>
                      <div className="flex md:flex-col gap-2 justify-end">
                        <Link href={`/property/${booking.property.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="clay-lg p-8 text-center">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Save properties you love by clicking the heart icon
                  </p>
                  <Link href="/apartments">
                    <Button variant="primary">Explore Properties</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlist.map((item) => (
                    <Link key={item.id} href={`/property/${item.property.id}`}>
                      <div className="clay-card p-4 flex gap-4 hover:shadow-lg transition-shadow">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                          {item.property.images?.[0] ? (
                            <Image
                              src={item.property.images[0]}
                              alt={item.property.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <MapPin className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.property.title}</h3>
                          <div className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                            <MapPin className="w-3 h-3" />
                            <span>{item.property.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{item.property.rating}</span>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {formatPrice(item.property.price)}
                              <span className="text-gray-500 text-sm font-normal">/night</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
              <div className="clay-lg p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-medium text-gray-900">Profile Information</h3>
                      <p className="text-sm text-gray-500">Update your personal details</p>
                    </div>
                    <Link href="/profile">
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-medium text-gray-900">Email Address</h3>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <span className="text-sm text-gray-400">Managed by Supabase Auth</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-medium text-gray-900">Account Type</h3>
                      <p className="text-sm text-gray-500 capitalize">{user?.role} account</p>
                    </div>
                    {user?.role === 'guest' && (
                      <Link href="/host/register">
                        <Button variant="primary" size="sm">Become a Host</Button>
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <h3 className="font-medium text-gray-900">Member Since</h3>
                      <p className="text-sm text-gray-500">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
