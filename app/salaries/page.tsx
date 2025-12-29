'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp, TrendingDown, Minus, DollarSign,
    MapPin, Briefcase, BarChart3, Loader2, Search, Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface SalaryInsight {
    role: string
    location: string
    currency: string
    salaryRange: {
        min: number
        median: number
        max: number
    }
    factors: string[]
    marketTrend: 'growing' | 'stable' | 'declining'
    demandLevel: 'high' | 'medium' | 'low'
}

export default function SalariesPage() {
    const [role, setRole] = useState('')
    const [location, setLocation] = useState('')
    const [experienceLevel, setExperienceLevel] = useState('mid')
    const [loading, setLoading] = useState(false)
    const [insight, setInsight] = useState<SalaryInsight | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Popular searches for quick access
    const popularSearches = [
        { role: 'Software Engineer', location: 'Lagos, Nigeria' },
        { role: 'Product Manager', location: 'Nairobi, Kenya' },
        { role: 'Data Scientist', location: 'Cape Town, South Africa' },
        { role: 'Frontend Developer', location: 'Accra, Ghana' },
    ]

    const getSalaryInsights = async (searchRole?: string, searchLocation?: string) => {
        const finalRole = searchRole || role
        const finalLocation = searchLocation || location

        if (!finalRole) {
            setError('Please enter a job role')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'getSalaryInsights',
                    data: {
                        role: finalRole,
                        location: finalLocation || 'Africa',
                        experienceLevel
                    }
                })
            })

            const result = await response.json()
            if (result.success) {
                setInsight(result.data)
            } else {
                setError(result.error || 'Failed to get salary insights')
            }
        } catch (err) {
            setError('Failed to get salary insights. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        getSalaryInsights()
    }

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'growing': return <TrendingUp className="w-5 h-5 text-accent" />
            case 'declining': return <TrendingDown className="w-5 h-5 text-destructive" />
            default: return <Minus className="w-5 h-5 text-secondary" />
        }
    }

    const getDemandColor = (level: string) => {
        switch (level) {
            case 'high': return 'text-accent bg-accent/10'
            case 'low': return 'text-orange-500 bg-orange-500/10'
            default: return 'text-secondary bg-secondary/10'
        }
    }

    const formatSalary = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="min-h-screen bg-background py-6 sm:py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm mb-4">
                        <Sparkles className="w-4 h-4" />
                        AI-Powered Insights
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                        Salary Insights
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Get AI-powered salary data for any role across Africa.
                        Understand market rates and make informed career decisions.
                    </p>
                </motion.div>

                {/* Search Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <GradientCard className="!p-6 mb-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Job Role</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            placeholder="e.g. Software Engineer"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="e.g. Lagos, Nigeria"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Experience Level</label>
                                <div className="flex flex-wrap gap-2">
                                    {['entry', 'mid', 'senior', 'lead'].map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setExperienceLevel(level)}
                                            className={cn(
                                                "px-4 py-2 rounded-lg border transition capitalize",
                                                experienceLevel === level
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "border-input hover:border-primary/50"
                                            )}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full gradient-african text-white min-h-12"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Getting Insights...
                                    </>
                                ) : (
                                    <>
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        Get Salary Insights
                                    </>
                                )}
                            </Button>
                        </form>
                    </GradientCard>
                </motion.div>

                {/* Quick Searches */}
                {!insight && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Popular Searches</h3>
                        <div className="flex flex-wrap gap-2">
                            {popularSearches.map((search) => (
                                <button
                                    key={`${search.role}-${search.location}`}
                                    onClick={() => {
                                        setRole(search.role)
                                        setLocation(search.location)
                                        getSalaryInsights(search.role, search.location)
                                    }}
                                    className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition"
                                >
                                    {search.role} in {search.location}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Results */}
                {insight && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Main Salary Card */}
                        <GlassCard className="!p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold">{insight.role}</h2>
                                    <p className="text-muted-foreground flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {insight.location}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getTrendIcon(insight.marketTrend)}
                                    <span className="text-sm capitalize">{insight.marketTrend}</span>
                                </div>
                            </div>

                            {/* Salary Range Visualization */}
                            <div className="mb-8">
                                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                    <span>Min</span>
                                    <span>Median</span>
                                    <span>Max</span>
                                </div>
                                <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 gradient-african rounded-full"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="font-bold">{formatSalary(insight.salaryRange.min)}</span>
                                    <span className="font-bold text-primary">{formatSalary(insight.salaryRange.median)}</span>
                                    <span className="font-bold">{formatSalary(insight.salaryRange.max)}</span>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-muted/50">
                                    <p className="text-sm text-muted-foreground mb-1">Market Demand</p>
                                    <span className={cn(
                                        "inline-block px-3 py-1 rounded-full text-sm font-medium capitalize",
                                        getDemandColor(insight.demandLevel)
                                    )}>
                                        {insight.demandLevel}
                                    </span>
                                </div>
                                <div className="p-4 rounded-xl bg-muted/50">
                                    <p className="text-sm text-muted-foreground mb-1">Experience</p>
                                    <p className="font-semibold capitalize">{experienceLevel} Level</p>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Factors */}
                        {insight.factors.length > 0 && (
                            <GlassCard className="!p-6">
                                <h3 className="font-bold mb-4">Factors Affecting Salary</h3>
                                <ul className="space-y-2">
                                    {insight.factors.map((factor, i) => (
                                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                            {factor}
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        )}

                        {/* Search Again */}
                        <div className="text-center">
                            <Button
                                variant="outline"
                                onClick={() => setInsight(null)}
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Search Another Role
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
