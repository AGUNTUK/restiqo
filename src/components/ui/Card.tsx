'use client'

import { motion } from 'framer-motion'
import { Heart, Star, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/types/database'

interface CardProps {
  property: Property
  onWishlistToggle?: (propertyId: string) => void
  isWishlisted?: boolean
}

export default function Card({ property, onWishlistToggle, isWishlisted = false }: CardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const primaryImage = property.images?.[0] || '/placeholder-property.jpg'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="neu-card group h-full"
    >
      <Link href={`/property/${property.id}`} className="flex flex-col h-full">
        {/* Image Container - Fixed Height */}
        <div className="relative h-56 overflow-hidden flex-shrink-0 rounded-t-3xl">
          <Image
            src={primaryImage}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Property Type Badge */}
          <div className="absolute top-4 left-4">
            <span className="neu-badge-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
              {property.property_type}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              onWishlistToggle?.(property.id)
            }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-4 right-4 p-2.5 rounded-full transition-all duration-200 neu-icon hover:scale-110 focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-[#64748B]'
                }`}
              aria-hidden="true"
            />
          </button>

          {/* Rating Badge */}
          <div className="absolute bottom-4 left-4">
            <div className="neu-badge flex items-center gap-1.5 px-3 py-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-[#1E293B]">
                {property.rating.toFixed(1)}
              </span>
              <span className="text-xs text-[#64748B]">
                ({property.review_count})
              </span>
            </div>
          </div>
        </div>

        {/* Content - Flex column with auto margin for footer */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-[#64748B] mb-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">{property.city}, {property.country}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-[#1E293B] mb-2 line-clamp-1 group-hover:text-brand-primary transition-colors">
            {property.title}
          </h3>

          {/* Description - Limited to 2 lines */}
          <p className="text-sm text-[#64748B] mb-4 line-clamp-2 min-h-[2.5rem]">
            {property.description}
          </p>

          {/* Amenities - Fixed height container */}
          <div className="flex flex-wrap gap-2 mb-4 min-h-[28px]">
            {property.amenities?.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="text-xs px-2.5 py-1 neu-badge text-[#64748B] whitespace-nowrap"
              >
                {amenity}
              </span>
            ))}
            {property.amenities?.length > 3 && (
              <span className="text-xs px-2.5 py-1 neu-badge text-[#64748B] whitespace-nowrap">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>

          {/* Spacer to push price section to bottom */}
          <div className="flex-grow"></div>

          {/* Price and CTA - Anchored to bottom */}
          <div className="flex items-center justify-between pt-4 mt-auto">
            <div>
              <span className="text-xl font-bold text-[#1E293B]">
                {formatPrice(property.price_per_night)}
              </span>
              <span className="text-sm text-[#64748B]">
                {property.property_type === 'tour' ? '/person' : '/night'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#64748B]">
              {property.property_type !== 'tour' && (
                <>
                  <span>{property.bedrooms} beds</span>
                  <span className="text-[#94A3B8]">•</span>
                  <span>{property.max_guests} guests</span>
                </>
              )}
              {property.property_type === 'tour' && (
                <span>{property.max_guests} max guests</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
