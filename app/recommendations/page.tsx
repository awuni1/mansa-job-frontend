'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp, Sparkles, Target, CheckCircle, AlertCircle,
    Briefcase, MapPin, DollarSign, Calendar, ArrowRight, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Job {
    id: number
    title: string
    company: {
        name: string
        logo?: string
        location: string
        is_verified: boolean
    }
    location: string
    employment_type: string
    salary_min?: number
    salary_max?: number
    posted_at: string
    description: string
}

interface JobMatch {
    id: number
    job: Job
    match_score: number
    strengths: string[]
    gaps: string[]
    skills_match: number
    recommendation: string
    created_at: string
}

export default function RecommendationsPage() {
    const [matches, setMatches] = useState<JobMatch[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all')

    useEffect(() => {
        fetchRecommendations()
    }, [])

    const fetchRecommendations = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setError('Please log in to view recommendations')
                setLoading(false)
                return
            }

            const response = await fetch(`${API_URL}/api/ai/my-job-matches/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setMatches(data)
            } else {
                setError('Failed to load recommendations')
            }
        } catch (err) {
            console.error('Error fetching recommendations:', err)
            setError('Failed to load recommendations')
        } finally {
            setLoading(false)
        }
    }

    const filteredMatches = matches.filter(match => {
        if (filter === 'high') return match.match_score >= 80
        if (filter === 'medium') return match.match_score >= 60 && match.match_score < 80
        return true
    }).sort((a, b) => b.match_score - a.match_score)

    const getMatchColor = (score: number) => {
        if (score >= 80) return 'text-green-500'
        if (score >= 60) return 'text-yellow-500'
        return 'text-orange-500'
    }

    const getMatchBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-500/10'
        if (score >= 60) return 'bg-yellow-500/10'
        return 'bg-orange-500/10'
    }

    const formatSalary = (min?: number, max?: number) => {
        if (!min && !max) return 'Not specified'
        if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`
        if (min) return `From $${min.toLocaleString()}`
        return `Up to $${max?.toLocaleString()}`
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
        return `${Math.floor(diffDays / 30)} months ago`
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
                <div className="container mx-auto max-w-7xl">
                    <GlassCard className="!p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Unable to Load Recommendations</h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <Button asChild>
                            <Link href="/login">Log In</Link>
                        </Button>
                    </GlassCard>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-8 h-8 text-primary" />
                        <h1 className="text-4xl font-bold">Job Recommendations</h1>
                    </div>
                    <p className="text-muted-foreground">
                        AI-powered job matches based on your profile and skills
                    </p>
                </div>

                {matches.length === 0 ? (
                    <GlassCard className="!p-12 text-center">
                        <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h2 className="text-2xl font-bold mb-2">No Recommendations Yet</h2>
                        <p className="text-muted-foreground mb-6">
                            Complete your profile and apply to jobs to get personalized recommendations
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button asChild variant="outline">
                                <Link href="/profile">Complete Profile</Link>
                            </Button>
                            <Button asChild className="gradient-african text-white">
                                <Link href="/jobs">Browse Jobs</Link>
                            </Button>
                        </div>
                    </GlassCard>
                ) : (
                    <>
                        {/* Stats & Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <GradientCard className="!p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{matches.length}</p>
                                        <p className="text-sm text-muted-foreground">Total Matches</p>
                                    </div>
                                </div>
                            </GradientCard>

                            <button
                                onClick={() => setFilter('all')}
                                className={cn(
                                    "p-4 rounded-xl border-2 text-left transition",
                                    filter === 'all' 
                                        ? 'border-primary bg-primary/10' 
                                        : 'border-border hover:border-primary/50'
                                )}
                            >
                                <p className="text-2xl font-bold">{matches.length}</p>
                                <p className="text-sm text-muted-foreground">All Matches</p>
                            </button>

                            <button
                                onClick={() => setFilter('high')}
                                className={cn(
                                    "p-4 rounded-xl border-2 text-left transition",
                                    filter === 'high' 
                                        ? 'border-green-500 bg-green-500/10' 
                                        : 'border-border hover:border-green-500/50'
                                )}
                            >
                                <p className="text-2xl font-bold text-green-500">
                                    {matches.filter(m => m.match_score >= 80).length}
                                </p>
                                <p className="text-sm text-muted-foreground">High Match (80%+)</p>
                            </button>

                            <button
                                onClick={() => setFilter('medium')}
                                className={cn(
                                    "p-4 rounded-xl border-2 text-left transition",
                                    filter === 'medium' 
                                        ? 'border-yellow-500 bg-yellow-500/10' 
                                        : 'border-border hover:border-yellow-500/50'
                                )}
                            >
                                <p className="text-2xl font-bold text-yellow-500">
                                    {matches.filter(m => m.match_score >= 60 && m.match_score < 80).length}
                                </p>
                                <p className="text-sm text-muted-foreground">Medium Match (60-79%)</p>
                            </button>
                        </div>

                        {/* Job Matches */}
                        <div className="space-y-4">
                            {filteredMatches.map((match, index) => (
                                <motion.div
                                    key={match.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <GlassCard className="!p-6 hover:shadow-lg transition">
                                        <div className="flex flex-col lg:flex-row gap-6">
                                            {/* Match Score */}
                                            <div className="flex-shrink-0">
                                                <div className={cn(
                                                    "w-24 h-24 rounded-2xl flex flex-col items-center justify-center",
                                                    getMatchBgColor(match.match_score)
                                                )}>
                                                    <span className={cn(
                                                        "text-3xl font-bold",
                                                        getMatchColor(match.match_score)
                                                    )}>
                                                        {match.match_score}%
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">Match</span>
                                                </div>
                                            </div>

                                            {/* Job Details */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="text-xl font-bold mb-1">
                                                            {match.job.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <span className="font-medium">{match.job.company.name}</span>
                                                            {match.job.company.is_verified && (
                                                                <CheckCircle className="w-4 h-4 text-blue-500" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button asChild>
                                                        <Link href={`/jobs/${match.job.id}`}>
                                                            View Job
                                                            <ArrowRight className="w-4 h-4 ml-2" />
                                                        </Link>
                                                    </Button>
                                                </div>

                                                {/* Meta Info */}
                                                <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {match.job.location}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Briefcase className="w-4 h-4" />
                                                        {match.job.employment_type}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="w-4 h-4" />
                                                        {formatSalary(match.job.salary_min, match.job.salary_max)}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        Posted {formatDate(match.job.posted_at)}
                                                    </div>
                                                </div>

                                                {/* AI Recommendation */}
                                                <div className="p-3 rounded-lg bg-muted/50 mb-4">
                                                    <p className="text-sm">{match.recommendation}</p>
                                                </div>

                                                {/* Strengths & Gaps */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {match.strengths.length > 0 && (
                                                        <div>
                                                            <p className="text-sm font-medium mb-2 text-green-500">
                                                                ✓ Your Strengths
                                                            </p>
                                                            <ul className="space-y-1">
                                                                {match.strengths.slice(0, 3).map((strength, i) => (
                                                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                                        <span className="text-green-500">•</span>
                                                                        {strength}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {match.gaps.length > 0 && (
                                                        <div>
                                                            <p className="text-sm font-medium mb-2 text-yellow-500">
                                                                ⚠ Areas to Develop
                                                            </p>
                                                            <ul className="space-y-1">
                                                                {match.gaps.slice(0, 3).map((gap, i) => (
                                                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                                        <span className="text-yellow-500">•</span>
                                                                        {gap}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
