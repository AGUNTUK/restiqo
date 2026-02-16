'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  User,
  LogOut,
  Heart,
  Calendar,
  Settings,
  Plus,
  LayoutDashboard,
  ChevronDown,
  Home,
  Shield,
  Building,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/lib/auth'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  const { user, profile, isAuthenticated, isLoading, isHost, isAdmin, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      setIsScrolled(currentScrollY > 20)
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleLogout = async () => {
    await signOut()
    setIsProfileOpen(false)
    setIsMenuOpen(false)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/apartments', label: 'Apartments' },
    { href: '/hotels', label: 'Hotels' },
    { href: '/tours', label: 'Tours' },
  ]

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isProfileOpen) {
        const target = e.target as HTMLElement
        if (!target.closest('.profile-dropdown')) {
          setIsProfileOpen(false)
        }
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isProfileOpen])

  const getDashboardLink = () => {
    if (isAdmin) return '/admin'
    if (isHost) return '/host'
    return '/dashboard'
  }

  const getRoleBadgeStyle = () => {
    if (isAdmin) return 'neu-badge bg-purple-500 text-white shadow-[3px_3px_6px_rgba(168,85,247,0.3),-3px_-3px_6px_rgba(255,255,255,0.8)]'
    if (isHost) return 'neu-badge bg-blue-500 text-white shadow-[3px_3px_6px_rgba(59,130,246,0.3),-3px_-3px_6px_rgba(255,255,255,0.8)]'
    return 'neu-badge-primary'
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-[#EEF2F6]/90 backdrop-blur-md shadow-[0_8px_16px_rgba(0,0,0,0.08)]'
          : 'bg-[#EEF2F6]/70 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <Image
                src="/logo.png"
                alt="Restiqo Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(link.href)
                    ? 'neu-nav-item-active'
                    : 'neu-nav-item hover:shadow-[4px_4px_8px_rgba(0,0,0,0.06),-4px_-4px_8px_rgba(255,255,255,0.8)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2.5 rounded-xl neu-button transition-all duration-200 flex-shrink-0"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[#1E293B]" />
            ) : (
              <Menu className="w-6 h-6 text-[#1E293B]" />
            )}
          </button>

        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#EEF2F6] neu-dropdown mx-4 mb-4 overflow-hidden z-[60]"
          >
            {/* Mobile menu content */}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
