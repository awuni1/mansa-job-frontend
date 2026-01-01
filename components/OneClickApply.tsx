'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Zap, FileText, Upload, Check, Loader2,
    ChevronDown, ChevronUp, Edit2, Send, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Resume {
    id: number
    file: string
    file_name: string
    is_primary: boolean
    parsed_data?: {
        name?: string
        email?: string
        phone?: string
        skills?: string[]
        experience?: any[]
    }
    uploaded_at: string
}

interface OneClickApplyProps {
    jobId: string | number
    jobTitle: string
    companyName: string
    onApply: (jobId: string | number, coverLetter?: string, resumeId?: number) => Promise<void>
    className?: string
}

export function OneClickApply({
    jobId,
    jobTitle,
    companyName,
    onApply,
    className
}: OneClickApplyProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [customCoverLetter, setCustomCoverLetter] = useState('')
    const [isApplying, setIsApplying] = useState(false)
    const [isApplied, setIsApplied] = useState(false)
    const [showCustomize, setShowCustomize] = useState(false)
    const [loading, setLoading] = useState(true)
    const [resume, setResume] = useState<Resume | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchPrimaryResume()
    }, [])

    const fetchPrimaryResume = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setLoading(false)
                return
            }

            const response = await fetch(`${API_URL}/api/auth/resumes/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                const primaryResume = data.find((r: Resume) => r.is_primary) || data[0]
                setResume(primaryResume)
            }
        } catch (err) {
            console.error('Failed to fetch resume:', err)
        } finally {
            setLoading(false)
        }
    }

    const generateCoverLetter = () => {
        if (!resume?.parsed_data) return ''
        
        const name = resume.parsed_data.name || 'Applicant'
        return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With my background and skills, I am confident I would be a valuable addition to your team.

${resume.parsed_data.skills && resume.parsed_data.skills.length > 0 
    ? `My key skills include: ${resume.parsed_data.skills.slice(0, 5).join(', ')}.` 
    : ''}

I am excited about the opportunity to contribute to ${companyName} and would welcome the chance to discuss how my experience aligns with your needs.

Thank you for considering my application.

Best regards,
${name}`
    }

    const handleQuickApply = async () => {
        if (!resume) {
            setError('No resume found. Please upload a resume first.')
            return
        }

        setIsApplying(true)
        setError('')
        try {
            await onApply(
                jobId, 
                customCoverLetter || generateCoverLetter(),
                resume.id
            )
            setIsApplied(true)
        } catch (error: any) {
            console.error('Application failed:', error)
            setError(error.message || 'Failed to submit application')
        } finally {
            setIsApplying(false)
        }
    }

    if (loading) {
        return (
            <div className={cn("p-4 rounded-xl bg-muted border border-border flex items-center justify-center", className)}>
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (isApplied) {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn("p-4 rounded-xl bg-accent/10 border border-accent/30", className)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Check className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <p className="font-semibold text-accent">Application Submitted!</p>
                        <p className="text-sm text-muted-foreground">
                            You&apos;ve applied to {jobTitle} at {companyName}
                        </p>
                    </div>
                </div>
            </motion.div>
        )
    }

    if (!resume) {
        return (
            <div className={cn("p-4 rounded-xl bg-muted border border-border", className)}>
                <div className="flex items-center gap-3 mb-3">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <p className="font-medium">Set up One-Click Apply</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                    Upload your resume to enable instant job applications.
                </p>
                <Button variant="outline" size="sm" asChild>
                    <a href="/profile?tab=resumes">Upload Resume</a>
                </Button>
            </div>
        )
    }

    return (
        <div className={className}>
            <GlassCard className="!p-4">
                {/* Error Alert */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                {/* Quick Apply Button */}
                <div className="flex items-center gap-3 mb-4">
                    <motion.button
                        onClick={handleQuickApply}
                        disabled={isApplying}
                        className={cn(
                            "flex-1 py-3 px-4 rounded-xl font-semibold text-white",
                            "gradient-african flex items-center justify-center gap-2",
                            "transition-all hover:shadow-lg hover:shadow-primary/20",
                            isApplying && "opacity-70 cursor-not-allowed"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isApplying ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Applying...
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4" />
                                One-Click Apply
                            </>
                        )}
                    </motion.button>

                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-3 rounded-xl hover:bg-muted transition"
                    >
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                        ) : (
                            <ChevronDown className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Saved Resume Info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>Using: {resume.file_name}</span>
                </div>

                {/* Expanded Options */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 mt-4 border-t border-border">
                                {/* Profile Summary */}
                                {resume.parsed_data && (
                                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                                        {resume.parsed_data.name && (
                                            <div className="p-2 rounded-lg bg-muted/50">
                                                <p className="text-muted-foreground">Name</p>
                                                <p className="font-medium">{resume.parsed_data.name}</p>
                                            </div>
                                        )}
                                        {resume.parsed_data.email && (
                                            <div className="p-2 rounded-lg bg-muted/50">
                                                <p className="text-muted-foreground">Email</p>
                                                <p className="font-medium truncate">{resume.parsed_data.email}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Customize Cover Letter */}
                                <button
                                    onClick={() => setShowCustomize(!showCustomize)}
                                    className="flex items-center gap-2 text-sm text-primary hover:underline mb-3"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    {showCustomize ? 'Hide' : 'Customize'} cover letter
                                </button>

                                {showCustomize && (
                                    <div className="mb-3">
                                        <textarea
                                            value={customCoverLetter || generateCoverLetter()}
                                            onChange={(e) => setCustomCoverLetter(e.target.value)}
                                            className="w-full p-3 rounded-lg border border-input bg-background text-sm min-h-[120px]"
                                            placeholder="Customize your cover letter..."
                                        />
                                    </div>
                                )}

                                {/* Apply with Customization */}
                                <Button
                                    onClick={handleQuickApply}
                                    disabled={isApplying}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Apply with Customization
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlassCard>
        </div>
    )
}
