'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Target, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/ui/GlassCard'

interface JobMatchResult {
    matchScore: number
    skillsMatch: string[]
    missingSkills: string[]
    recommendation: string
    strengths: string[]
    gaps: string[]
}

interface JobMatchScoreProps {
    jobId: string | number
    jobTitle: string
    jobSkills: string[]
    jobLocation: string
    salaryRange: string
    experienceLevel: string
    candidateSkills?: string[]
    candidateExperience?: number
    candidateLocation?: string
    desiredSalary?: string
    showDetails?: boolean
    className?: string
}

export function JobMatchScore({
    jobId,
    jobTitle,
    jobSkills,
    jobLocation,
    salaryRange,
    experienceLevel,
    candidateSkills = [],
    candidateExperience = 0,
    candidateLocation = '',
    desiredSalary = '',
    showDetails = false,
    className
}: JobMatchScoreProps) {
    const [matchData, setMatchData] = useState<JobMatchResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showExpanded, setShowExpanded] = useState(false)

    useEffect(() => {
        if (candidateSkills.length > 0) {
            calculateMatch()
        }
    }, [jobId])

    const calculateMatch = async () => {
        if (candidateSkills.length === 0) return

        setLoading(true)
        setError(null)

        try {
            // Get auth token
            const token = localStorage.getItem('auth_token')
            if (!token) {
                setError('Please log in to see match score')
                setLoading(false)
                return
            }

            // Call new backend AI API
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
            const response = await fetch(`${API_URL}/ai/job-match/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    job_id: jobId,
                    candidate_profile: {
                        skills: candidateSkills,
                        yearsExperience: candidateExperience,
                        location: candidateLocation,
                        desiredSalary
                    }
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const result = await response.json()
            setMatchData(result)
        } catch (err) {
            console.error('Match calculation error:', err)
            setError('Failed to calculate match')
        } finally {
            setLoading(false)
        }
    }

    // Simple match calculation as fallback
    const simpleMatch = () => {
        if (candidateSkills.length === 0) return null
        const matchedSkills = candidateSkills.filter(skill =>
            jobSkills.some(js => js.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(js.toLowerCase()))
        )
        return Math.round((matchedSkills.length / Math.max(jobSkills.length, 1)) * 100)
    }

    const score = matchData?.matchScore ?? simpleMatch()

    const getScoreColor = (s: number) => {
        if (s >= 80) return 'text-accent'
        if (s >= 60) return 'text-secondary'
        if (s >= 40) return 'text-orange-500'
        return 'text-destructive'
    }

    const getScoreBg = (s: number) => {
        if (s >= 80) return 'bg-accent/20'
        if (s >= 60) return 'bg-secondary/20'
        if (s >= 40) return 'bg-orange-500/20'
        return 'bg-destructive/20'
    }

    if (loading) {
        return (
            <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
                <Loader2 className="w-4 h-4 animate-spin" />
                Calculating match...
            </div>
        )
    }

    if (score === null) {
        return null
    }

    return (
        <div className={className}>
            {/* Score Badge */}
            <motion.button
                onClick={() => setShowExpanded(!showExpanded)}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition",
                    getScoreBg(score),
                    getScoreColor(score)
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Target className="w-4 h-4" />
                {score}% Match
                {score >= 80 && <Sparkles className="w-3 h-3" />}
            </motion.button>

            {/* Expanded Details */}
            {showExpanded && matchData && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3"
                >
                    <GlassCard className="!p-4">
                        <div className="space-y-3">
                            {/* Recommendation */}
                            <p className="text-sm text-muted-foreground">
                                {matchData.recommendation}
                            </p>

                            {/* Matched Skills */}
                            {matchData.skillsMatch.length > 0 && (
                                <div>
                                    <p className="text-xs font-medium text-accent mb-1 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Matching Skills
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {matchData.skillsMatch.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Missing Skills */}
                            {matchData.missingSkills.length > 0 && (
                                <div>
                                    <p className="text-xs font-medium text-orange-500 mb-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Skills to Develop
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {matchData.missingSkills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-xs"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Strengths */}
                            {matchData.strengths.length > 0 && (
                                <div>
                                    <p className="text-xs font-medium mb-1 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3 text-accent" />
                                        Your Strengths
                                    </p>
                                    <ul className="text-xs text-muted-foreground space-y-0.5">
                                        {matchData.strengths.map((s, i) => (
                                            <li key={i}>• {s}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </motion.div>
            )}
        </div>
    )
}

// Compact version for job cards
export function JobMatchBadge({
    score,
    size = 'sm'
}: {
    score: number
    size?: 'sm' | 'md'
}) {
    const getScoreColor = (s: number) => {
        if (s >= 80) return 'bg-accent/20 text-accent'
        if (s >= 60) return 'bg-secondary/20 text-secondary'
        if (s >= 40) return 'bg-orange-500/20 text-orange-500'
        return 'bg-destructive/20 text-destructive'
    }

    return (
        <span className={cn(
            "inline-flex items-center gap-1 rounded-full font-medium",
            size === 'sm' ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
            getScoreColor(score)
        )}>
            <Target className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} />
            {score}%
        </span>
    )
}
