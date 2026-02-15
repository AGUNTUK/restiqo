'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ChevronRight,
  XCircle,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface Booking {
  id: string
  property_id: string
  user_id: string
  check_in: string
  check_out: string
  guests: number
  total_price: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'refunded'
  created_at: string
  property: {
    id: string
    title: string
    location: string
    city: string
    country: string
    property_type: string
    images: string[]
    price_per_night: number
  }
}

type FilterTab = 'all' | 'upcoming' | 'completed' | 'cancelled'

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [user, setUser] = useState<{ id: string } | null>(null)

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      const supabase = createClient()
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        setLoading(false)
        return
      }
      
      setUser({ id: session.user.id })
      
      // Fetch user's bookings with property details
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          property:properties(
            id,
            title,
            location,
            city,
            country,
            property_type,
            images,
            price_per_night
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching bookings:', error)
        toast.error('Failed to load bookings')
      } else {
        setBookings(data || [])
      }
      
      setLoading(false)
    }
    
    fetchUserAndBookings()
    
    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id })
        fetchUserAndBookings()
      } else {
        setUser(null)
        setBookings([])
      }
    })
    
    return () => subscription.unsubscribe()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return nights
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'completed':
        return 'bg-blue-100 text-blue-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  const filterBookings = (bookings: Booking[], tab: FilterTab) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    switch (tab) {
      case 'upcoming':
        return bookings.filter(b => 
          (b.status === 'confirmed' || b.status === 'pending') && 
          new Date(b.check_in) > today
        )
      case 'completed':
        return bookings.filter(b => b.status === 'completed')
      case 'cancelled':
        return bookings.filter(b => b.status === 'cancelled')
      default:
        return bookings
    }
  }

  const filteredBookings = filterBookings(bookings, activeTab)

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Bookings', count: bookings.length },
    { id: 'upcoming', label: 'Upcoming', count: filterBookings(bookings, 'upcoming').length },
    { id: 'completed', label: 'Completed', count: filterBookings(bookings, 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: filterBookings(bookings, 'cancelled').length },
  ]

  if (!user && !loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="clay-lg p-8 text-center max-w-md">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to view your bookings</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access your booking history and manage your reservations.
          </p>
          <Link href="/auth/login?redirect=/bookings">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600">
            View and manage your reservations
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-white/70 text-gray-600 hover:bg-white'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="clay-card overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-64 h-48 md:h-auto">
                    <div className="skeleton w-full h-full" />
                  </div>
                  <div className="flex-1 p-6 space-y-4">
                    <div className="skeleton h-6 w-3/4" />
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-4 w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBookings.length === 0 && (
          <div className="clay-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'all'
                ? "You haven't made any bookings yet. Start exploring amazing places!"
                : `No ${activeTab} bookings at the moment.`}
            </p>
            <Link href="/">
              <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Properties
              </Button>
            </Link>
          </div>
        )}

        {/* Bookings List */}
        {!loading && filteredBookings.length > 0 && (
          <div className="space-y-6">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="clay-card overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="relative w-full md:w-64 h-48 md:h-auto flex-shrink-0">
                    <Image
                      src={booking.property?.images?.[0] || '/placeholder-property.jpg'}
                      alt={booking.property?.title || 'Property'}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="clay-badge-primary px-3 py-1 text-xs font-semibold uppercase">
                        {booking.property?.property_type}
                      </span>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        {/* Title and Location */}
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {booking.property?.title}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-500 mb-4">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            {booking.property?.city}, {booking.property?.country}
                          </span>
                        </div>

                        {/* Booking Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-brand-primary" />
                            <div>
                              <p className="text-xs text-gray-500">Check-in</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(booking.check_in)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-brand-primary" />
                            <div>
                              <p className="text-xs text-gray-500">Check-out</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(booking.check_out)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-brand-primary" />
                            <div>
                              <p className="text-xs text-gray-500">Duration</p>
                              <p className="text-sm font-medium text-gray-900">
                                {calculateNights(booking.check_in, booking.check_out)} nights
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-brand-primary" />
                            <div>
                              <p className="text-xs text-gray-500">Guests</p>
                              <p className="text-sm font-medium text-gray-900">
                                {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.payment_status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : booking.payment_status === 'refunded'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            Payment: {booking.payment_status}
                          </div>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex flex-col items-end gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            {formatPrice(booking.total_price)}
                          </p>
                          <p className="text-sm text-gray-500">Total amount</p>
                        </div>
                        <Link href={`/property/${booking.property_id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            rightIcon={<ChevronRight className="w-4 h-4" />}
                          >
                            View Property
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
