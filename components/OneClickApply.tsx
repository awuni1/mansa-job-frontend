'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Zap, FileText, Upload, Check, Loader2,
    ChevronDown, ChevronUp, Edit2, Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface SavedProfile {
    resumeUrl: string
    resumeName: string
    coverLetterTemplate: string
    name: string
    email: string
    phone: string
}

interface OneClickApplyProps {
    jobId: string | number
    jobTitle: string
    companyName: string
    savedProfile?: SavedProfile
    onApply: (jobId: string | number, coverLetter?: string) => Promise<void>
    className?: string
}

export function OneClickApply({
    jobId,
    jobTitle,
    companyName,
    savedProfile,
    onApply,
    className
}: OneClickApplyProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [customCoverLetter, setCustomCoverLetter] = useState('')
    const [isApplying, setIsApplying] = useState(false)
    const [isApplied, setIsApplied] = useState(false)
    const [showCustomize, setShowCustomize] = useState(false)

    // Generate default cover letter
    const generateCoverLetter = () => {
        if (!savedProfile) return ''
        return savedProfile.coverLetterTemplate
            .replace('{company}', companyName)
            .replace('{position}', jobTitle)
            .replace('{name}', savedProfile.name)
    }

    const handleQuickApply = async () => {
        setIsApplying(true)
        try {
            await onApply(jobId, customCoverLetter || generateCoverLetter())
            setIsApplied(true)
        } catch (error) {
            console.error('Application failed:', error)
        } finally {
            setIsApplying(false)
        }
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

    if (!savedProfile) {
        return (
            <div className={cn("p-4 rounded-xl bg-muted border border-border", className)}>
                <div className="flex items-center gap-3 mb-3">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <p className="font-medium">Set up One-Click Apply</p>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                    Upload your resume and create a cover letter template to apply instantly.
                </p>
                <Button variant="outline" size="sm">
                    Set Up Profile
                </Button>
            </div>
        )
    }

    return (
        <div className={className}>
            <GlassCard className="!p-4">
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

                {/* Saved Profile Info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>Using: {savedProfile.resumeName}</span>
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
                                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                                    <div className="p-2 rounded-lg bg-muted/50">
                                        <p className="text-muted-foreground">Name</p>
                                        <p className="font-medium">{savedProfile.name}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-muted/50">
                                        <p className="text-muted-foreground">Email</p>
                                        <p className="font-medium truncate">{savedProfile.email}</p>
                                    </div>
                                </div>

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
