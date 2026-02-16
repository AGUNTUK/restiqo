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
  Home,
  Building,
  Compass,
  Plus,
  Shield,
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Booking, Wishlist, Property } from '@/types/database'

// Tab components
import BookingsTab from '@/components/dashboard/BookingsTab'
import WishlistTab from '@/components/dashboard/WishlistTab'
import SettingsTab from '@/components/dashboard/SettingsTab'

const guestTabs = [
  { id: 'bookings', label: 'My Bookings', icon: Calendar },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const hostTabs = [
  { id: 'bookings', label: 'My Bookings', icon: Calendar },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, isLoading: authLoading, isAuthenticated, isHost, isAdmin, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('bookings')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    )
  }

  const tabs = isHost ? hostTabs : guestTabs

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {profile?.full_name || 'Guest'}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your bookings, wishlist, and account settings
              </p>
            </div>
            {isHost && (
              <Link
                href="/host"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors"
              >
                <Home className="w-5 h-5" />
                Host Dashboard
              </Link>
            )}
          </div>

          {/* Role Badge */}
          <div className="flex items-center gap-2 mt-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isAdmin ? 'bg-purple-100 text-purple-700' :
              isHost ? 'bg-blue-100 text-blue-700' :
              'bg-green-100 text-green-700'
            }`}>
              {isAdmin ? 'Admin' : isHost ? 'Host' : 'Guest'}
            </span>
            {!isHost && (
              <Link
                href="/host/register"
                className="text-sm text-brand-primary hover:underline"
              >
                Become a Host →
              </Link>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="clay p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-brand-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    href="/search"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-brand-primary transition-colors"
                  >
                    <Compass className="w-4 h-4" />
                    Explore Properties
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-brand-primary transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'bookings' && <BookingsTab />}
              {activeTab === 'wishlist' && <WishlistTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
