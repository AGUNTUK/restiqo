'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Plus,
  Building2,
  Calendar,
  DollarSign,
  Star,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

// Mock host data
const mockProperties = [
  {
    id: '1',
    title: 'Luxury Downtown Apartment',
    type: 'apartment',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    price: 8500,
    rating: 4.9,
    reviews: 128,
    bookings: 45,
    revenue: 382500,
  },
  {
    id: '2',
    title: 'Cozy Studio Near Lake',
    type: 'apartment',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    price: 3500,
    rating: 4.7,
    reviews: 89,
    bookings: 32,
    revenue: 112000,
  },
  {
    id: '3',
    title: 'Modern Loft Space',
    type: 'apartment',
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    price: 5500,
    rating: 0,
    reviews: 0,
    bookings: 0,
    revenue: 0,
  },
]

const mockBookings = [
  {
    id: '1',
    guest: 'John Doe',
    property: 'Luxury Downtown Apartment',
    checkIn: '2024-02-20',
    checkOut: '2024-02-25',
    status: 'confirmed',
    total: 42500,
  },
  {
    id: '2',
    guest: 'Jane Smith',
    property: 'Cozy Studio Near Lake',
    checkIn: '2024-02-22',
    checkOut: '2024-02-24',
    status: 'pending',
    total: 7000,
  },
]

const stats = [
  { label: 'Total Properties', value: '3', icon: Building2, change: '+1' },
  { label: 'Total Bookings', value: '77', icon: Calendar, change: '+12' },
  { label: 'Total Revenue', value: '৳494,500', icon: DollarSign, change: '+15%' },
  { label: 'Average Rating', value: '4.8', icon: Star, change: '+0.2' },
]

export default function HostDashboardPage() {
  const [properties, setProperties] = useState(mockProperties)
  const [bookings, setBookings] = useState(mockBookings)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
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

  const handleDeleteProperty = () => {
    if (selectedProperty) {
      setProperties(properties.filter((p) => p.id !== selectedProperty))
      setShowDeleteModal(false)
      setSelectedProperty(null)
    }
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
            <p className="text-gray-600">Manage your properties and bookings</p>
          </div>
          <Link href="/host/properties/new">
            <Button variant="accent" leftIcon={<Plus className="w-5 h-5" />}>
              Add New Property
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="clay-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-brand-primary/10">
                  <stat.icon className="w-6 h-6 text-brand-primary" />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Properties Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Properties</h2>
          <div className="clay-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Bookings
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Revenue
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{property.title}</p>
                            <p className="text-sm text-gray-500 capitalize">{property.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={property.status === 'active' ? 'primary' : 'outline'}
                        >
                          {property.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {formatPrice(property.price)}
                        <span className="text-gray-500 text-sm">/night</span>
                      </td>
                      <td className="px-6 py-4">
                        {property.rating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{property.rating}</span>
                            <span className="text-gray-500 text-sm">({property.reviews})</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">No reviews</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {property.bookings}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {formatPrice(property.revenue)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/property/${property.id}`}>
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                          </Link>
                          <Link href={`/host/properties/${property.id}/edit`}>
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                              <Edit className="w-4 h-4 text-gray-500" />
                            </button>
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedProperty(property.id)
                              setShowDeleteModal(true)
                            }}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                          >
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
        </div>

        {/* Recent Bookings */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          <div className="clay-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Guest
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Property
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Check In
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Check Out
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {booking.guest}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{booking.property}</td>
                      <td className="px-6 py-4 text-gray-600">{booking.checkIn}</td>
                      <td className="px-6 py-4 text-gray-600">{booking.checkOut}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={booking.status === 'confirmed' ? 'primary' : 'outline'}
                        >
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {formatPrice(booking.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Property"
        size="sm"
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Are you sure you want to delete this property?
          </h3>
          <p className="text-gray-600 mb-6">
            This action cannot be undone. All bookings and data associated with this
            property will be permanently removed.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              className="flex-1 !bg-red-500 hover:!bg-red-600"
              onClick={handleDeleteProperty}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
