'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()

      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        toast.error('Authentication failed')
        router.push('/auth/login')
        return
      }

      if (session) {
        // Check if user profile exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        // Create profile if it doesn't exist
        if (!existingUser) {
          const { error: profileError } = await supabase.from('users').insert({
            id: session.user.id,
            email: session.user.email!,
            full_name: session.user.user_metadata.full_name || session.user.user_metadata.name || null,
            avatar_url: session.user.user_metadata.avatar_url || null,
            role: session.user.user_metadata.role || 'guest',
          })

          if (profileError) {
            console.error('Error creating profile:', profileError)
          }
        }

        toast.success('Successfully signed in!')
        
        const redirectTo = searchParams.get('redirect') || '/dashboard'
        router.push(redirectTo)
        router.refresh()
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="clay p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4" />
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="clay p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
