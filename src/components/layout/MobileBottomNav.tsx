'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Heart,
  Calendar,
  Plus,
  MessageCircle,
  User,
} from 'lucide-react'
import { useAuth } from '@/lib/auth'

interface NavItem {
  id: string
  href: string
  label: string
  icon: React.ElementType
  requiresAuth?: boolean
}

export default function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isHost, isLoading } = useAuth()
  const [pressedItem, setPressedItem] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Define navigation items
  const leftNavItems: NavItem[] = [
    {
      id: 'home',
      href: '/',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'wishlist',
      href: '/dashboard?tab=wishlist',
      label: 'Wishlist',
      icon: Heart,
      requiresAuth: true,
    },
  ]

  const rightNavItems: NavItem[] = [
    {
      id: 'inbox',
      href: '/dashboard?tab=inbox',
      label: 'Inbox',
      icon: MessageCircle,
      requiresAuth: true,
    },
    {
      id: 'profile',
      href: isAuthenticated ? '/dashboard' : '/auth/login',
      label: 'Profile',
      icon: User,
    },
  ]

  // Role-based center button configuration
  const centerButton = isHost
    ? {
        id: 'create',
        href: '/host/listings/new',
        label: 'Create',
        icon: Plus,
      }
    : {
        id: 'bookings',
        href: '/dashboard?tab=bookings',
        label: 'Bookings',
        icon: Calendar,
      }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.includes('?tab=')) {
      const [path] = href.split('?tab=')
      return pathname === path
    }
    return pathname.startsWith(href)
  }

  const handleNavClick = (item: NavItem) => {
    if (item.requiresAuth && !isAuthenticated) {
      router.push('/auth/login')
      return
    }
    router.push(item.href)
  }

  const handleCenterClick = () => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }
    router.push(centerButton.href)
  }

  // Ripple animation variants
  const rippleVariants = {
    initial: { scale: 0, opacity: 0.5 },
    animate: { scale: 2.5, opacity: 0 },
    exit: { scale: 0, opacity: 0 },
  }

  // Nav item animation variants
  const navItemVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.9 },
    hover: { scale: 1.05 },
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden h-20">
        <div className="h-safe-area-inset-bottom bg-transparent" />
      </div>
    )
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Main Navigation Container */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="mx-4 mb-3"
      >
        <div
          className="relative flex items-center justify-around h-16 rounded-2xl px-2"
          style={{
            background: 'rgba(238, 242, 246, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: `
              0 10px 40px rgba(0, 0, 0, 0.08),
              0 2px 10px rgba(0, 0, 0, 0.04),
              inset 0 1px 0 rgba(255, 255, 255, 0.8)
            `,
          }}
        >
          {/* Left Navigation Items */}
          {leftNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const isPressed = pressedItem === item.id

            return (
              <motion.button
                key={item.id}
                variants={navItemVariants}
                initial="initial"
                whileTap="tap"
                whileHover="hover"
                onClick={() => handleNavClick(item)}
                onTouchStart={() => setPressedItem(item.id)}
                onTouchEnd={() => setPressedItem(null)}
                className="relative flex flex-col items-center justify-center w-16 h-full"
              >
                {/* Ripple Effect */}
                <AnimatePresence>
                  {isPressed && (
                    <motion.div
                      variants={rippleVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.4 }}
                      className="absolute w-8 h-8 rounded-full bg-brand-primary/20"
                    />
                  )}
                </AnimatePresence>

                {/* Active Indicator */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute top-1 w-6 h-1 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #62BBB1, #88C51C)',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <Icon
                  className={`w-5 h-5 mb-0.5 transition-all duration-200 ${
                    active
                      ? 'text-brand-primary stroke-[2.5]'
                      : 'text-[#64748B] stroke-2'
                  }`}
                />

                {/* Label */}
                <span
                  className={`text-[10px] font-medium transition-all duration-200 ${
                    active ? 'text-brand-primary' : 'text-[#94A3B8]'
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            )
          })}

          {/* Center Floating Button */}
          <motion.button
            onClick={handleCenterClick}
            whileTap={{ scale: 0.9 }}
            className="relative -mt-8 flex items-center justify-center"
          >
            {/* Glow Effect */}
            <motion.div
              animate={{
                opacity: [0.4, 0.6, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute w-16 h-16 rounded-full"
              style={{
                background: isHost
                  ? 'radial-gradient(circle, rgba(136, 197, 28, 0.3) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(98, 187, 177, 0.3) 0%, transparent 70%)',
              }}
            />

            {/* Button Container */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-14 h-14 rounded-full flex items-center justify-center"
              style={{
                background: isHost
                  ? 'linear-gradient(135deg, #88C51C 0%, #6da315 100%)'
                  : 'linear-gradient(135deg, #62BBB1 0%, #4a9a91 100%)',
                boxShadow: isHost
                  ? '0 8px 24px rgba(136, 197, 28, 0.4), 0 2px 8px rgba(136, 197, 28, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  : '0 8px 24px rgba(98, 187, 177, 0.4), 0 2px 8px rgba(98, 187, 177, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              }}
            >
              {/* Inner highlight */}
              <div
                className="absolute inset-0.5 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
                }}
              />

              {/* Icon */}
              {isHost ? (
                <Plus className="w-6 h-6 text-white stroke-[2.5]" />
              ) : (
                <Calendar className="w-5 h-5 text-white stroke-[2.5]" />
              )}
            </motion.div>

            {/* Label below button */}
            <span
              className="absolute -bottom-6 text-[10px] font-medium whitespace-nowrap"
              style={{ color: isHost ? '#6da315' : '#4a9a91' }}
            >
              {isHost ? 'Create' : 'Bookings'}
            </span>
          </motion.button>

          {/* Right Navigation Items */}
          {rightNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const isPressed = pressedItem === item.id

            return (
              <motion.button
                key={item.id}
                variants={navItemVariants}
                initial="initial"
                whileTap="tap"
                whileHover="hover"
                onClick={() => handleNavClick(item)}
                onTouchStart={() => setPressedItem(item.id)}
                onTouchEnd={() => setPressedItem(null)}
                className="relative flex flex-col items-center justify-center w-16 h-full"
              >
                {/* Ripple Effect */}
                <AnimatePresence>
                  {isPressed && (
                    <motion.div
                      variants={rippleVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.4 }}
                      className="absolute w-8 h-8 rounded-full bg-brand-primary/20"
                    />
                  )}
                </AnimatePresence>

                {/* Active Indicator */}
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute top-1 w-6 h-1 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #62BBB1, #88C51C)',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <Icon
                  className={`w-5 h-5 mb-0.5 transition-all duration-200 ${
                    active
                      ? 'text-brand-primary stroke-[2.5]'
                      : 'text-[#64748B] stroke-2'
                  }`}
                />

                {/* Label */}
                <span
                  className={`text-[10px] font-medium transition-all duration-200 ${
                    active ? 'text-brand-primary' : 'text-[#94A3B8]'
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Safe area padding for iOS devices */}
      <div className="h-safe-area-inset-bottom bg-transparent" />
    </nav>
  )
}
