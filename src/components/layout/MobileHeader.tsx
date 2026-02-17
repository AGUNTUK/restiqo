'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X } from 'lucide-react'
import { useAuth } from '@/lib/auth'

interface Notification {
  id: string
  title: string
  message: string
  created_at: string
  read: boolean
}

export default function MobileHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch notifications count
  useEffect(() => {
    if (isAuthenticated && user) {
      // For now, we'll set a mock unread count
      // In production, this would fetch from the database
      setUnreadCount(0)
    }
  }, [isAuthenticated, user])

  const handleNotificationClick = () => {
    // Navigate to notifications tab in dashboard
    window.location.href = '/dashboard?tab=notifications'
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
        isScrolled
          ? 'bg-[#EEF2F6]/95 backdrop-blur-lg shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
          : 'bg-[#EEF2F6]/80 backdrop-blur-sm'
      }`}
    >
      <div className="flex items-center justify-between h-14 px-4 safe-area-top">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center"
          >
            <Image
              src="/logo.png"
              alt="Restiqo"
              width={100}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </motion.div>
        </Link>

        {/* Right Side - Notification Bell */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNotificationClick}
            className="relative p-2.5 rounded-xl transition-all duration-200"
            style={{
              background: 'var(--color-background)',
              boxShadow: isScrolled
                ? '3px 3px 6px rgba(0,0,0,0.05), -3px -3px 6px rgba(255,255,255,0.8)'
                : '2px 2px 4px rgba(0,0,0,0.03), -2px -2px 4px rgba(255,255,255,0.7)',
            }}
          >
            <Bell className="w-5 h-5 text-[#64748B]" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Safe area spacing for iOS */}
      <div className="h-safe-area-inset-top" />
    </header>
  )
}
