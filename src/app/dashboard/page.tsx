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
    <div className="min-h-screen pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="neu-panel p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1E293B]">
                Welcome back, {profile?.full_name || 'Guest'}!
              </h1>
              <p className="text-sm sm:text-base text-[#64748B] mt-1">
                Manage your bookings, wishlist, and account settings
              </p>
            </div>
            {isHost && (
              <Link
                href="/host"
                className="flex items-center justify-center gap-2 px-4 py-2.5 neu-button-primary rounded-xl text-sm sm:text-base"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                Host Dashboard
              </Link>
            )}
          </div>

          {/* Role Badge */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${
              isAdmin ? 'neu-badge bg-purple-500 text-white shadow-[3px_3px_6px_rgba(168,85,247,0.3),-3px_-3px_6px_rgba(255,255,255,0.8)]' :
              isHost ? 'neu-badge bg-blue-500 text-white shadow-[3px_3px_6px_rgba(59,130,246,0.3),-3px_-3px_6px_rgba(255,255,255,0.8)]' :
              'neu-badge-primary'
            }`}>
              {isAdmin ? 'Admin' : isHost ? 'Host' : 'Guest'}
            </span>
            {!isHost && (
              <Link
                href="/host/register"
                className="text-xs sm:text-sm text-brand-primary hover:underline"
              >
                Become a Host →
              </Link>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Sidebar - Horizontal on mobile, vertical on desktop */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="neu-panel p-3 sm:p-4">
              {/* Mobile: Horizontal scrollable tabs */}
              <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'neu-nav-item-active'
                        : 'neu-nav-item'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 lg:border-t-0">
                <h3 className="text-xs sm:text-sm font-medium text-[#64748B] mb-2 sm:mb-3 hidden sm:block">Quick Actions</h3>
                <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                  <Link
                    href="/search"
                    className="neu-button flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#64748B] rounded-xl whitespace-nowrap flex-shrink-0"
                  >
                    <Compass className="w-4 h-4" />
                    <span className="hidden sm:inline">Explore Properties</span>
                    <span className="sm:hidden">Explore</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="neu-button flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-[#64748B] rounded-xl whitespace-nowrap flex-shrink-0"
                    >
                      <Shield className="w-4 h-4" />
                      <span className="hidden sm:inline">Admin Panel</span>
                      <span className="sm:hidden">Admin</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="neu-panel p-4 sm:p-6"
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
