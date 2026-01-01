'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Star, ThumbsUp, ThumbsDown, MessageSquare, Building2,
    Briefcase, TrendingUp, Users, Heart, AlertCircle, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface Review {
    id: number
    overall_rating: number
    title: string
    pros: string
    cons: string
    job_title: string
    employment_status: string
    created_at: string
    helpful_count: number
    is_helpful: boolean
    work_life_balance: number
    salary_benefits: number
    job_security: number
    management: number
    culture: number
    reviewer_name: string
    is_anonymous: boolean
}

interface CompanyReviewsProps {
    companySlug: string
    companyName?: string
    className?: string
}

const categoryLabels = {
    work_life_balance: 'Work-Life Balance',
    salary_benefits: 'Compensation & Benefits',
    management: 'Management',
    culture: 'Company Culture',
    job_security: 'Job Security'
}

const categoryIcons = {
    work_life_balance: Heart,
    salary_benefits: TrendingUp,
    management: Users,
    culture: Building2,
    job_security: Briefcase
}

export function CompanyReviews({
    companySlug,
    companyName = 'Company',
    className
}: CompanyReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [sortBy, setSortBy] = useState<'recent' | 'helpful'>('recent')
    const [filterRating, setFilterRating] = useState<number | null>(null)

    useEffect(() => {
        fetchReviews()
    }, [companySlug, sortBy, filterRating])

    const fetchReviews = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
            const token = localStorage.getItem('auth_token')
            
            let url = `${API_URL}/companies/${companySlug}/reviews/?sort=${sortBy === 'helpful' ? 'helpful' : '-created_at'}`
            if (filterRating) {
                url += `&rating=${filterRating}`
            }

            const response = await fetch(url, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            })

            if (response.ok) {
                const data = await response.json()
                setReviews(data)
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleMarkHelpful = async (reviewId: number) => {
        const token = localStorage.getItem('auth_token')
        if (!token) {
            alert('Please log in to mark reviews as helpful')
            return
        }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
            const response = await fetch(`${API_URL}/companies/reviews/${reviewId}/helpful/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                fetchReviews() // Refresh reviews
            }
        } catch (error) {
            console.error('Failed to mark review as helpful:', error)
        }
    }

    const renderStars = (rating: number, interactive = false, onRating?: (r: number) => void) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => interactive && onRating?.(star)}
                        className={cn(
                            interactive && "hover:scale-110 transition-transform cursor-pointer"
                        )}
                        disabled={!interactive}
                    >
                        <Star className={cn(
                            "w-5 h-5",
                            star <= rating
                                ? "fill-secondary text-secondary"
                                : "text-muted-foreground/30"
                        )} />
                    </button>
                ))}
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        })
    }

    const filteredReviews = reviews
        .filter(r => filterRating === null || Math.round(r.overall_rating) === filterRating)
        .sort((a, b) => {
            if (sortBy === 'helpful') return b.helpful_count - a.helpful_count
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })

    // Calculate statistics
    const totalReviews = reviews.length
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.overall_rating, 0) / reviews.length
        : 0

    const categoryAverages = {
        work_life_balance: reviews.length > 0
            ? reviews.reduce((sum, r) => sum + (r.work_life_balance || 0), 0) / reviews.length
            : 0,
        salary_benefits: reviews.length > 0
            ? reviews.reduce((sum, r) => sum + (r.salary_benefits || 0), 0) / reviews.length
            : 0,
        job_security: reviews.length > 0
            ? reviews.reduce((sum, r) => sum + (r.job_security || 0), 0) / reviews.length
            : 0,
        management: reviews.length > 0
            ? reviews.reduce((sum, r) => sum + (r.management || 0), 0) / reviews.length
            : 0,
        culture: reviews.length > 0
            ? reviews.reduce((sum, r) => sum + (r.culture || 0), 0) / reviews.length
            : 0
    }

    // Calculate recommendation percentage (assuming ratings >= 4 mean they would recommend)
    const recommendPercentage = reviews.length > 0
        ? Math.round((reviews.filter(r => r.overall_rating >= 4).length / reviews.length) * 100)
        : 0

    return (
        <div className={cn("space-y-6", className)}>
            {/* Overview Card */}
            <GradientCard className="!p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Overall Rating */}
                    <div className="text-center md:text-left md:border-r md:pr-6 border-border/50">
                        <p className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</p>
                        {renderStars(averageRating)}
                        <p className="text-sm text-muted-foreground mt-2">
                            Based on {totalReviews} reviews
                        </p>
                    </div>

                    {/* Category Breakdowns */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(categoryAverages).map(([key, value]) => {
                            const Icon = categoryIcons[key as keyof typeof categoryIcons]
                            return (
                                <div key={key} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{value.toFixed(1)}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {categoryLabels[key as keyof typeof categoryLabels]}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Recommend */}
                    <div className="text-center md:text-right md:border-l md:pl-6 border-border/50">
                        <p className="text-3xl font-bold text-accent">{recommendPercentage}%</p>
                        <p className="text-sm text-muted-foreground">
                            Would recommend<br />to a friend
                        </p>
                    </div>
                </div>
            </GradientCard>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => setFilterRating(null)}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap",
                            filterRating === null
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                        )}
                    >
                        All Reviews
                    </button>
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => setFilterRating(rating)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1",
                                filterRating === rating
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted hover:bg-muted/80"
                            )}
                        >
                            {rating} <Star className="w-3 h-3 fill-current" />
                        </button>
                    ))}
                </div>

                <Button onClick={() => setShowForm(!showForm)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Write Review
                </Button>
            </div>

            {/* Review Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <ReviewForm
                        companyName={companyName}
                        onSubmit={async (review) => {
                            // Submit to API
                            const token = localStorage.getItem('auth_token')
                            if (!token) {
                                alert('Please log in to submit a review')
                                return
                            }
                            try {
                                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
                                const response = await fetch(`${API_URL}/companies/${companySlug}/reviews/`, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Bearer ${token}`,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(review)
                                })
                                if (response.ok) {
                                    fetchReviews() // Refresh reviews
                                    setShowForm(false)
                                } else {
                                    alert('Failed to submit review')
                                }
                            } catch (error) {
                                console.error('Failed to submit review:', error)
                                alert('Failed to submit review')
                            }
                        }}
                        onCancel={() => setShowForm(false)}
                    />
                </motion.div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.map((review) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <GlassCard className="!p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {renderStars(review.overall_rating)}
                                        <span className="font-bold">{review.title}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {review.job_title} · {review.employment_status} · {formatDate(review.created_at)}
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm font-medium text-accent mb-1">Pros</p>
                                    <p className="text-sm text-muted-foreground">{review.pros}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-destructive mb-1">Cons</p>
                                    <p className="text-sm text-muted-foreground">{review.cons}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                                <p className="text-sm text-muted-foreground">Was this review helpful?</p>
                                <button
                                    onClick={() => handleMarkHelpful(review.id)}
                                    className={cn(
                                        "flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-muted transition text-sm",
                                        review.is_helpful && "bg-primary/10 text-primary"
                                    )}
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    {review.helpful_count}
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}

                {filteredReviews.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p>No reviews found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// Review Form Component
function ReviewForm({
    companyName,
    onSubmit,
    onCancel
}: {
    companyName: string
    onSubmit: (review: Partial<Review>) => void
    onCancel: () => void
}) {
    const [overall_rating, setOverallRating] = useState(0)
    const [title, setTitle] = useState('')
    const [pros, setPros] = useState('')
    const [cons, setCons] = useState('')
    const [job_title, setJobTitle] = useState('')
    const [employment_status, setEmploymentStatus] = useState('current')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ overall_rating, title, pros, cons, job_title, employment_status })
    }

    return (
        <GlassCard className="!p-6">
            <h3 className="text-lg font-bold mb-4">Review {companyName}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">Overall Rating *</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setOverallRating(star)}
                                className="hover:scale-110 transition-transform"
                            >
                                <Star className={cn(
                                    "w-8 h-8",
                                    star <= overall_rating
                                        ? "fill-secondary text-secondary"
                                        : "text-muted-foreground/30"
                                )} />
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium mb-1.5 block">Review Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Summarize your experience"
                        className="w-full p-3 rounded-lg border border-input bg-background"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium mb-1.5 block">Your Job Title *</label>
                    <input
                        type="text"
                        value={job_title}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Software Engineer"
                        className="w-full p-3 rounded-lg border border-input bg-background"
                        required
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Pros *</label>
                        <textarea
                            value={pros}
                            onChange={(e) => setPros(e.target.value)}
                            placeholder="What did you like?"
                            className="w-full p-3 rounded-lg border border-input bg-background min-h-[100px]"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1.5 block">Cons *</label>
                        <textarea
                            value={cons}
                            onChange={(e) => setCons(e.target.value)}
                            placeholder="What could be improved?"
                            className="w-full p-3 rounded-lg border border-input bg-background min-h-[100px]"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium mb-1.5 block">Employment Status *</label>
                    <select
                        value={employment_status}
                        onChange={(e) => setEmploymentStatus(e.target.value)}
                        className="w-full p-3 rounded-lg border border-input bg-background"
                        required
                    >
                        <option value="current">Current Employee</option>
                        <option value="former">Former Employee</option>
                        <option value="freelance">Freelance/Contract</option>
                        <option value="intern">Intern</option>
                    </select>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" className="gradient-african text-white">
                        Submit Review
                    </Button>
                </div>
            </form>
        </GlassCard>
    )
}
