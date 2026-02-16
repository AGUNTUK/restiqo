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

  // Handle scroll behavior
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

  // Close dropdown when clicking outside
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

  // Get role-based dashboard link
  const getDashboardLink = () => {
    if (isAdmin) return '/admin'
    if (isHost) return '/host'
    return '/dashboard'
  }

  // Get role badge color
  const getRoleBadgeColor = () => {
    if (isAdmin) return 'bg-purple-100 text-purple-700'
    if (isHost) return 'bg-blue-100 text-blue-700'
    return 'bg-green-100 text-green-700'
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? 'bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(163,177,198,0.3)] border-b border-white/20'
          : 'bg-white/30 backdrop-blur-md border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-brand-primary'
                    : 'text-gray-700 hover:text-brand-primary'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Become a Host Button - only show for non-logged in users or guests */}
            {!isLoading && !isHost && !isAdmin && (
              <Link href={isAuthenticated ? '/host/register' : '/auth/login?redirect=/host/register'}>
                <Button variant="outline" size="sm">
                  Become a Host
                </Button>
              </Link>
            )}
            
            {isLoading ? (
              <div className="w-20 h-9 bg-gray-200 rounded-lg animate-pulse" />
            ) : isAuthenticated ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsProfileOpen(!isProfileOpen)
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.full_name || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-brand-primary" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {profile?.full_name || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="font-medium text-gray-900 truncate">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getRoleBadgeColor()}`}>
                          {isAdmin ? 'Admin' : isHost ? 'Host' : 'Guest'}
                        </span>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {/* Dashboard */}
                        <Link
                          href={getDashboardLink()}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          <span>Dashboard</span>
                        </Link>

                        {/* My Bookings */}
                        <Link
                          href="/dashboard?tab=bookings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Calendar className="w-5 h-5" />
                          <span>My Bookings</span>
                        </Link>

                        {/* Wishlist */}
                        <Link
                          href="/dashboard?tab=wishlist"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Heart className="w-5 h-5" />
                          <span>Wishlist</span>
                        </Link>

                        {/* Host Dashboard - only for hosts */}
                        {isHost && (
                          <Link
                            href="/host"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Home className="w-5 h-5" />
                            <span>Host Dashboard</span>
                          </Link>
                        )}

                        {/* Admin Dashboard - only for admins */}
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Shield className="w-5 h-5" />
                            <span>Admin Panel</span>
                          </Link>
                        )}

                        {/* Add Listing - only for hosts */}
                        {isHost && (
                          <Link
                            href="/host/listings/new"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                            <span>Add New Listing</span>
                          </Link>
                        )}

                        {/* Settings */}
                        <Link
                          href="/dashboard?tab=settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="w-5 h-5" />
                          <span>Settings</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? 'bg-brand-primary/10 text-brand-primary'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Auth Section */}
              <div className="pt-4 border-t border-gray-100">
                {isLoading ? (
                  <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                ) : isAuthenticated ? (
                  <div className="space-y-2">
                    {/* User Info */}
                    <div className="px-4 py-2">
                      <p className="font-medium text-gray-900">{profile?.full_name || 'User'}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getRoleBadgeColor()}`}>
                        {isAdmin ? 'Admin' : isHost ? 'Host' : 'Guest'}
                      </span>
                    </div>

                    <Link
                      href={getDashboardLink()}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/dashboard?tab=bookings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      <Calendar className="w-5 h-5" />
                      <span>My Bookings</span>
                    </Link>

                    {isHost && (
                      <Link
                        href="/host"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <Building className="w-5 h-5" />
                        <span>Host Dashboard</span>
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <Shield className="w-5 h-5" />
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {!isHost && !isAdmin && (
                      <Link
                        href="/auth/login?redirect=/host/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full"
                      >
                        <Button variant="outline" className="w-full">
                          Become a Host
                        </Button>
                      </Link>
                    )}
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full"
                    >
                      <Button variant="ghost" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full"
                    >
                      <Button variant="primary" className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
