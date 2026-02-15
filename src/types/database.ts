export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          address: string | null
          role: 'guest' | 'host' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          role?: 'guest' | 'host' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          role?: 'guest' | 'host' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          host_id: string
          title: string
          description: string
          property_type: 'apartment' | 'hotel' | 'tour'
          category: string
          price_per_night: number
          price_per_tour: number | null
          location: string
          address: string
          city: string
          country: string
          latitude: number | null
          longitude: number | null
          bedrooms: number | null
          bathrooms: number | null
          max_guests: number
          rating: number
          review_count: number
          is_available: boolean
          is_approved: boolean
          amenities: string[]
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          host_id: string
          title: string
          description: string
          property_type: 'apartment' | 'hotel' | 'tour'
          category: string
          price_per_night: number
          price_per_tour?: number | null
          location: string
          address: string
          city: string
          country: string
          latitude?: number | null
          longitude?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          max_guests: number
          rating?: number
          review_count?: number
          is_available?: boolean
          is_approved?: boolean
          amenities?: string[]
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          title?: string
          description?: string
          property_type?: 'apartment' | 'hotel' | 'tour'
          category?: string
          price_per_night?: number
          price_per_tour?: number | null
          location?: string
          address?: string
          city?: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          max_guests?: number
          rating?: number
          review_count?: number
          is_available?: boolean
          is_approved?: boolean
          amenities?: string[]
          images?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          property_id: string
          guest_id: string
          check_in: string
          check_out: string
          guests: number
          total_price: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status: 'pending' | 'paid' | 'refunded'
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          guest_id: string
          check_in: string
          check_out: string
          guests: number
          total_price: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'paid' | 'refunded'
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          guest_id?: string
          check_in?: string
          check_out?: string
          guests?: number
          total_price?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'pending' | 'paid' | 'refunded'
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          property_id: string
          user_id: string
          booking_id: string
          rating: number
          comment: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          booking_id: string
          rating: number
          comment: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          booking_id?: string
          rating?: number
          comment?: string
          created_at?: string
          updated_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          created_at?: string
        }
      }
      amenities: {
        Row: {
          id: string
          name: string
          icon: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          category?: string
          created_at?: string
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          url: string
          caption: string | null
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          url: string
          caption?: string | null
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          url?: string
          caption?: string | null
          is_primary?: boolean
          created_at?: string
        }
      }
      tours: {
        Row: {
          id: string
          property_id: string
          duration: string
          included: string[]
          excluded: string[]
          itinerary: Json
          meeting_point: string
          start_time: string
          max_participants: number
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          duration: string
          included?: string[]
          excluded?: string[]
          itinerary?: Json
          meeting_point: string
          start_time: string
          max_participants: number
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          duration?: string
          included?: string[]
          excluded?: string[]
          itinerary?: Json
          meeting_point?: string
          start_time?: string
          max_participants?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Property = Database['public']['Tables']['properties']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Wishlist = Database['public']['Tables']['wishlists']['Row']
export type Amenity = Database['public']['Tables']['amenities']['Row']
export type PropertyImage = Database['public']['Tables']['property_images']['Row']
export type Tour = Database['public']['Tables']['tours']['Row']
