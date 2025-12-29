'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Mail, Lock, Chrome, Linkedin, Github, Eye, EyeOff, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/dashboard')
            router.refresh()
        }
    }

    const handleDemoLogin = async (role: 'seeker' | 'employer') => {
        setLoading(true)
        // Simulate demo login
        await new Promise(resolve => setTimeout(resolve, 1000))
        router.push(role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker')
    }

    const handleSocialLogin = (provider: string) => {
        // Implement social login
        console.log(`Login with ${provider}`)
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

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
                        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
                        <p className="text-muted-foreground">
                            Sign in to continue to your account
                        </p>
                    </div>

                    {/* Demo Mode Buttons */}
                    <div className="mb-6 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-secondary" />
                            <span className="text-sm font-medium">Quick Demo Access</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleDemoLogin('seeker')}
                                disabled={loading}
                                className="text-sm"
                            >
                                Job Seeker Demo
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleDemoLogin('employer')}
                                disabled={loading}
                                className="text-sm"
                            >
                                Employer Demo
                            </Button>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="space-y-2 mb-6">
                        <Button
                            variant="outline"
                            className="w-full min-h-12"
                            onClick={() => handleSocialLogin('google')}
                        >
                            <Chrome className="w-5 h-5 mr-2" />
                            Continue with Google
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                className="min-h-12"
                                onClick={() => handleSocialLogin('linkedin')}
                            >
                                <Linkedin className="w-5 h-5 mr-2" />
                                LinkedIn
                            </Button>
                            <Button
                                variant="outline"
                                className="min-h-12"
                                onClick={() => handleSocialLogin('github')}
                            >
                                <Github className="w-5 h-5 mr-2" />
                                GitHub
                            </Button>
                        </div>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
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
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
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
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full gradient-african text-white min-h-12 text-base font-semibold"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="font-medium text-primary hover:underline">
                            Sign up for free
                        </Link>
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    )
}
