'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  FileText, 
  Check, 
  ArrowRight,
  Home,
  Hotel,
  Compass,
  Shield
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

const benefits = [
  {
    icon: Home,
    title: 'List Your Properties',
    description: 'Showcase your apartments, hotels, or tours to thousands of travelers'
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Receive payments securely with our trusted payment system'
  },
  {
    icon: Building2,
    title: 'Manage Everything',
    description: 'Easy-to-use dashboard to manage bookings, guests, and earnings'
  },
  {
    icon: Compass,
    title: 'Reach More Guests',
    description: 'Get visibility across Bangladesh and attract more customers'
  }
]

const propertyTypes = [
  { id: 'apartment', label: 'Apartment', icon: Home },
  { id: 'hotel', label: 'Hotel', icon: Hotel },
  { id: 'tour', label: 'Tour/Experience', icon: Compass },
]

export default function HostRegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Business Info
    businessName: '',
    businessType: '',
    propertyTypes: [] as string[],
    address: '',
    city: '',
    // Documents
    nidNumber: '',
    tradeLicense: '',
    // Agreement
    agreeTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}
    
    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = 'Full name is required'
      if (!formData.email) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
      if (!formData.phone) newErrors.phone = 'Phone number is required'
      if (!formData.password) newErrors.password = 'Password is required'
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (step === 2) {
      if (!formData.businessName) newErrors.businessName = 'Business name is required'
      if (!formData.businessType) newErrors.businessType = 'Business type is required'
      if (formData.propertyTypes.length === 0) newErrors.propertyTypes = 'Select at least one property type'
      if (!formData.city) newErrors.city = 'City is required'
    }
    
    if (step === 3) {
      if (!formData.nidNumber) newErrors.nidNumber = 'NID number is required'
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handlePropertyTypeToggle = (typeId: string) => {
    setFormData(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(typeId)
        ? prev.propertyTypes.filter(t => t !== typeId)
        : [...prev.propertyTypes, typeId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(3)) return
    
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Registration submitted! We will review your application.')
      router.push('/host/pending')
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-brand-background-light to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Become a Host on Restiqo
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our community of hosts and start earning by sharing your properties and experiences with travelers
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Benefits Section */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="clay-lg p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Why Host with Us?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-brand-primary font-medium hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="clay-lg p-6 sm:p-8"
            >
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                        currentStep >= step
                          ? 'bg-brand-primary text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {currentStep > step ? <Check className="w-5 h-5" /> : step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-16 sm:w-24 h-1 mx-2 rounded transition-colors ${
                          currentStep > step ? 'bg-brand-primary' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step Labels */}
              <div className="flex justify-between mb-8 text-xs sm:text-sm">
                <span className={currentStep >= 1 ? 'text-brand-primary font-medium' : 'text-gray-500'}>
                  Personal Info
                </span>
                <span className={currentStep >= 2 ? 'text-brand-primary font-medium' : 'text-gray-500'}>
                  Business Info
                </span>
                <span className={currentStep >= 3 ? 'text-brand-primary font-medium' : 'text-gray-500'}>
                  Verification
                </span>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
                    
                    <Input
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      error={errors.fullName}
                      leftIcon={<User className="w-5 h-5" />}
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={errors.email}
                      leftIcon={<Mail className="w-5 h-5" />}
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+880 1XXX-XXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      error={errors.phone}
                      leftIcon={<Phone className="w-5 h-5" />}
                    />

                    <Input
                      label="Password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      error={errors.password}
                      leftIcon={<Shield className="w-5 h-5" />}
                    />

                    <Input
                      label="Confirm Password"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      error={errors.confirmPassword}
                      leftIcon={<Shield className="w-5 h-5" />}
                    />
                  </motion.div>
                )}

                {/* Step 2: Business Information */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Business Information</h2>
                    
                    <Input
                      label="Business Name"
                      placeholder="Your business or brand name"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      error={errors.businessName}
                      leftIcon={<Building2 className="w-5 h-5" />}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Type
                      </label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="clay-input w-full px-4 py-3 text-gray-900"
                      >
                        <option value="">Select business type</option>
                        <option value="individual">Individual</option>
                        <option value="company">Company</option>
                        <option value="partnership">Partnership</option>
                      </select>
                      {errors.businessType && (
                        <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Types (Select all that apply)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {propertyTypes.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => handlePropertyTypeToggle(type.id)}
                            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                              formData.propertyTypes.includes(type.id)
                                ? 'border-brand-primary bg-brand-primary/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <type.icon className={`w-5 h-5 ${
                              formData.propertyTypes.includes(type.id) ? 'text-brand-primary' : 'text-gray-500'
                            }`} />
                            <span className={`font-medium ${
                              formData.propertyTypes.includes(type.id) ? 'text-brand-primary' : 'text-gray-700'
                            }`}>
                              {type.label}
                            </span>
                          </button>
                        ))}
                      </div>
                      {errors.propertyTypes && (
                        <p className="text-red-500 text-sm mt-1">{errors.propertyTypes}</p>
                      )}
                    </div>

                    <Input
                      label="Address"
                      placeholder="Your business address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      leftIcon={<MapPin className="w-5 h-5" />}
                    />

                    <Input
                      label="City"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      error={errors.city}
                      leftIcon={<MapPin className="w-5 h-5" />}
                    />
                  </motion.div>
                )}

                {/* Step 3: Verification */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Verification & Documents</h2>
                    
                    <Input
                      label="National ID Number"
                      placeholder="Enter your NID number"
                      value={formData.nidNumber}
                      onChange={(e) => setFormData({ ...formData, nidNumber: e.target.value })}
                      error={errors.nidNumber}
                      leftIcon={<FileText className="w-5 h-5" />}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trade License (Optional)
                      </label>
                      <div className="clay-input p-4">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"
                        />
                        <p className="text-xs text-gray-500 mt-2">Upload PDF, JPG or PNG (max 5MB)</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary mt-0.5"
                        />
                        <span className="text-sm text-gray-600">
                          I agree to the{' '}
                          <Link href="/terms" className="text-brand-primary hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link href="/privacy" className="text-brand-primary hover:underline">
                            Privacy Policy
                          </Link>
                          . I understand that my application will be reviewed before approval.
                        </span>
                      </label>
                      {errors.agreeTerms && (
                        <p className="text-red-500 text-sm mt-2">{errors.agreeTerms}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  {currentStep > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}
                  
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleNext}
                      rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isLoading}
                      rightIcon={<Check className="w-5 h-5" />}
                    >
                      Submit Application
                    </Button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
