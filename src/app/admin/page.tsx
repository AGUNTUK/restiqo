'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Shield,
  BarChart3,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

// Mock admin data
const mockStats = [
  { label: 'Total Users', value: '2,543', icon: Users, change: '+12%', color: 'bg-blue-500' },
  { label: 'Total Properties', value: '458', icon: Building2, change: '+8%', color: 'bg-green-500' },
  { label: 'Total Bookings', value: '1,234', icon: Calendar, change: '+23%', color: 'bg-purple-500' },
  { label: 'Revenue', value: '৳12.5M', icon: DollarSign, change: '+18%', color: 'bg-yellow-500' },
]

const mockPendingProperties = [
  {
    id: '1',
    title: 'Beach House Paradise',
    host: 'John Smith',
    type: 'apartment',
    location: 'Cox\'s Bazar',
    price: 12000,
    submitted: '2024-02-15',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400',
  },
  {
    id: '2',
    title: 'Mountain Retreat',
    host: 'Jane Doe',
    type: 'hotel',
    location: 'Bandarban',
    price: 18000,
    submitted: '2024-02-14',
    image: 'https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=400',
  },
  {
    id: '3',
    title: 'City Tour Experience',
    host: 'Mike Johnson',
    type: 'tour',
    location: 'Dhaka',
    price: 5000,
    submitted: '2024-02-13',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
  },
]

const mockRecentUsers = [
  {
    id: '1',
    name: 'Alice Rahman',
    email: 'alice@example.com',
    role: 'guest',
    joined: '2024-02-15',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
  {
    id: '2',
    name: 'Bob Ahmed',
    email: 'bob@example.com',
    role: 'host',
    joined: '2024-02-14',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    id: '3',
    name: 'Carol Khan',
    email: 'carol@example.com',
    role: 'guest',
    joined: '2024-02-13',
    status: 'suspended',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
]

const mockFlaggedReviews = [
  {
    id: '1',
    property: 'Luxury Apartment',
    user: 'User123',
    rating: 2,
    comment: 'This place was terrible! The host was rude and the place was dirty.',
    flagged: 'Inappropriate content',
    date: '2024-02-15',
  },
  {
    id: '2',
    property: 'Beach Resort',
    user: 'Traveler456',
    rating: 1,
    comment: 'Worst experience ever! Do not book this place!!!',
    flagged: 'Spam',
    date: '2024-02-14',
  },
]

export default function AdminPanelPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showPropertyModal, setShowPropertyModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto py-8">
          <div className="skeleton h-8 w-48 rounded-lg mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-2xl" />
            ))}
          </div>
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-brand-secondary/10">
            <Shield className="w-8 h-8 text-brand-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">Manage users, properties, and platform settings</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'properties', label: 'Pending Approval', icon: Building2 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'reviews', label: 'Flagged Reviews', icon: AlertCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-secondary text-white'
                  : 'bg-white/70 text-gray-700 hover:bg-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {mockStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="clay-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pending Properties */}
              <div className="clay-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pending Approvals
                  </h3>
                  <Badge variant="outline">{mockPendingProperties.length}</Badge>
                </div>
                <div className="space-y-3">
                  {mockPendingProperties.slice(0, 3).map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50"
                    >
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {property.title}
                        </p>
                        <p className="text-sm text-gray-500">{property.host}</p>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setActiveTab('properties')}
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flagged Reviews */}
              <div className="clay-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Flagged Reviews
                  </h3>
                  <Badge variant="outline">{mockFlaggedReviews.length}</Badge>
                </div>
                <div className="space-y-3">
                  {mockFlaggedReviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900">{review.property}</p>
                        <p className="text-sm text-gray-500 truncate">{review.comment}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab('reviews')}
                      >
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Pending Properties Tab */}
        {activeTab === 'properties' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Properties Pending Approval
            </h2>
            <div className="clay-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                        Property
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                        Host
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                        Submitted
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockPendingProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <span className="font-medium text-gray-900">
                              {property.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{property.host}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">{property.type}</Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{property.location}</td>
                        <td className="px-6 py-4 text-gray-900">
                          {formatPrice(property.price)}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{property.submitted}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </button>
                            <button className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                              <XCircle className="w-5 h-5 text-red-600" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                              <Eye className="w-5 h-5 text-gray-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Users</h2>
            <div className="clay-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockRecentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="font-medium text-gray-900">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={user.role === 'host' ? 'accent' : 'outline'}
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{user.joined}</td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={user.status === 'active' ? 'primary' : 'outline'}
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Flagged Reviews Tab */}
        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Flagged Reviews
            </h2>
            <div className="space-y-4">
              {mockFlaggedReviews.map((review) => (
                <div key={review.id} className="clay-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.property}</h3>
                      <p className="text-sm text-gray-500">by {review.user}</p>
                    </div>
                    <Badge variant="outline" className="!bg-red-50 !text-red-600 !border-red-200">
                      {review.flagged}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{review.date}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Dismiss
                      </Button>
                      <Button variant="accent" size="sm" className="!bg-red-500 hover:!bg-red-600">
                        Remove Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
