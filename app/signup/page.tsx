'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Mail, Lock, User, Building2, Chrome, Linkedin, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SignupPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [role, setRole] = useState<'seeker' | 'employer' | null>(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (!agreedToTerms) {
            setError('Please agree to the terms and conditions')
            return
        }

        setLoading(true)
        setError(null)

        const supabase = createClient()
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role?.toUpperCase(),
                    company_name: role === 'employer' ? companyName : null,
                }
            }
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/dashboard')
            router.refresh()
        }
    }

    const handleSocialSignup = (provider: string) => {
        console.log(`Sign up with ${provider}`)
    }

    const passwordStrength = () => {
        if (!password) return 0
        let strength = 0
        if (password.length >= 8) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++
        return strength
    }

    const strengthColors = ['bg-destructive', 'bg-orange-500', 'bg-yellow-500', 'bg-accent']
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
            <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-xl gradient-african flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">M</span>
                    </div>
                    <span className="font-bold text-2xl">Mansa</span>
                </Link>

                <GlassCard className="!p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">Create your account</h1>
                        <p className="text-muted-foreground">
                            Join Africa&apos;s fastest-growing job platform
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* Step 1: Role Selection */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <p className="text-sm font-medium mb-4">I want to:</p>
                                <div className="space-y-3 mb-6">
                                    <button
                                        onClick={() => { setRole('seeker'); setStep(2) }}
                                        className={cn(
                                            "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left",
                                            role === 'seeker'
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        )}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <User className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Find a Job</p>
                                            <p className="text-sm text-muted-foreground">Browse and apply to opportunities</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => { setRole('employer'); setStep(2) }}
                                        className={cn(
                                            "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left",
                                            role === 'employer'
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        )}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-secondary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Hire Talent</p>
                                            <p className="text-sm text-muted-foreground">Post jobs and find candidates</p>
                                        </div>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Account Details */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                {/* Social Signup */}
                                <div className="space-y-2 mb-6">
                                    <Button
                                        variant="outline"
                                        className="w-full min-h-12"
                                        onClick={() => handleSocialSignup('google')}
                                    >
                                        <Chrome className="w-5 h-5 mr-2" />
                                        Continue with Google
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full min-h-12"
                                        onClick={() => handleSocialSignup('linkedin')}
                                    >
                                        <Linkedin className="w-5 h-5 mr-2" />
                                        Continue with LinkedIn
                                    </Button>
                                </div>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">or</span>
                                    </div>
                                </div>

                                <form onSubmit={handleSignup} className="space-y-4">
                                    <div>
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <div className="relative mt-1.5">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="fullName"
                                                placeholder="John Doe"
                                                className="pl-10 min-h-12"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {role === 'employer' && (
                                        <div>
                                            <Label htmlFor="companyName">Company Name</Label>
                                            <div className="relative mt-1.5">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <Input
                                                    id="companyName"
                                                    placeholder="Acme Inc."
                                                    className="pl-10 min-h-12"
                                                    value={companyName}
                                                    onChange={(e) => setCompanyName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative mt-1.5">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                className="pl-10 min-h-12"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative mt-1.5">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                className="pl-10 pr-10 min-h-12"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {password && (
                                            <div className="mt-2">
                                                <div className="flex gap-1 mb-1">
                                                    {[0, 1, 2, 3].map((i) => (
                                                        <div
                                                            key={i}
                                                            className={cn(
                                                                "h-1 flex-1 rounded-full transition-colors",
                                                                i < passwordStrength() ? strengthColors[passwordStrength() - 1] : "bg-muted"
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Password strength: {strengthLabels[passwordStrength() - 1] || 'Too weak'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <div className="relative mt-1.5">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10 min-h-12"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            {confirmPassword && password === confirmPassword && (
                                                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                                            )}
                                        </div>
                                    </div>

                                    <label className="flex items-start gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            className="rounded mt-1"
                                        />
                                        <span className="text-muted-foreground">
                                            I agree to the{' '}
                                            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                                            {' '}and{' '}
                                            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                                        </span>
                                    </label>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep(1)}
                                            className="min-h-12"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-1 gradient-african text-white min-h-12 text-base font-semibold"
                                            disabled={loading}
                                        >
                                            {loading ? 'Creating account...' : 'Create Account'}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    )
}
