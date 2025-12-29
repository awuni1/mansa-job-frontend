'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Link2, Copy, Check, Users, DollarSign,
    Clock, CheckCircle, XCircle, Plus, Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface Referral {
    id: string
    referrerName: string
    referrerEmail: string
    candidateName: string
    candidateEmail: string
    jobTitle: string
    status: 'pending' | 'applied' | 'interviewing' | 'hired' | 'rejected'
    createdAt: string
    bonus?: number
    bonusStatus?: 'pending' | 'paid'
}

interface ReferralSystemProps {
    referrals: Referral[]
    referralLink: string
    bonusAmount: number
    onCreateReferral?: (email: string, jobId: string) => void
    className?: string
}

const statusConfig = {
    pending: { label: 'Awaiting Application', color: 'bg-muted text-muted-foreground', icon: Clock },
    applied: { label: 'Applied', color: 'bg-blue-500/20 text-blue-600', icon: CheckCircle },
    interviewing: { label: 'Interviewing', color: 'bg-secondary/20 text-secondary', icon: Users },
    hired: { label: 'Hired!', color: 'bg-accent/20 text-accent', icon: CheckCircle },
    rejected: { label: 'Not Selected', color: 'bg-destructive/20 text-destructive', icon: XCircle },
}

export function ReferralSystem({
    referrals,
    referralLink,
    bonusAmount,
    onCreateReferral,
    className
}: ReferralSystemProps) {
    const [copied, setCopied] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [email, setEmail] = useState('')
    const [jobId, setJobId] = useState('')

    const handleCopy = async () => {
        await navigator.clipboard.writeText(referralLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (email && jobId) {
            onCreateReferral?.(email, jobId)
            setEmail('')
            setJobId('')
            setShowForm(false)
        }
    }

    const stats = {
        total: referrals.length,
        applied: referrals.filter(r => r.status !== 'pending').length,
        hired: referrals.filter(r => r.status === 'hired').length,
        earned: referrals.filter(r => r.bonusStatus === 'paid').reduce((sum, r) => sum + (r.bonus || 0), 0),
        pending: referrals.filter(r => r.status === 'hired' && r.bonusStatus === 'pending').reduce((sum, r) => sum + (r.bonus || 0), 0)
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header Card */}
            <GradientCard className="!p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-2">Refer & Earn</h2>
                        <p className="text-muted-foreground">
                            Earn <span className="text-accent font-bold">${bonusAmount}</span> for each successful hire from your referrals
                        </p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)} className="gradient-african text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Refer Someone
                    </Button>
                </div>

                {/* Referral Link */}
                <div className="mt-6 p-4 rounded-xl bg-background/50">
                    <p className="text-sm text-muted-foreground mb-2">Your unique referral link</p>
                    <div className="flex gap-2">
                        <Input
                            value={referralLink}
                            readOnly
                            className="bg-background font-mono text-sm"
                        />
                        <Button onClick={handleCopy} variant="outline">
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-accent" />
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Quick Refer Form */}
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="mt-4 p-4 rounded-xl bg-background/50"
                    >
                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Candidate Email</label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="friend@email.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Job Position</label>
                                <Input
                                    value={jobId}
                                    onChange={(e) => setJobId(e.target.value)}
                                    placeholder="Select or enter job ID"
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full sm:w-auto">
                            <Send className="w-4 h-4 mr-2" />
                            Send Referral Invite
                        </Button>
                    </motion.form>
                )}
            </GradientCard>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard className="!p-4 text-center">
                    <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Referrals</p>
                </GlassCard>
                <GlassCard className="!p-4 text-center">
                    <CheckCircle className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">{stats.applied}</p>
                    <p className="text-sm text-muted-foreground">Applied</p>
                </GlassCard>
                <GlassCard className="!p-4 text-center">
                    <CheckCircle className="w-5 h-5 mx-auto mb-2 text-accent" />
                    <p className="text-2xl font-bold">{stats.hired}</p>
                    <p className="text-sm text-muted-foreground">Hired</p>
                </GlassCard>
                <GlassCard className="!p-4 text-center">
                    <DollarSign className="w-5 h-5 mx-auto mb-2 text-secondary" />
                    <p className="text-2xl font-bold">${stats.earned}</p>
                    <p className="text-sm text-muted-foreground">Earned</p>
                    {stats.pending > 0 && (
                        <p className="text-xs text-secondary mt-1">+${stats.pending} pending</p>
                    )}
                </GlassCard>
            </div>

            {/* Referrals List */}
            <GlassCard className="!p-6">
                <h3 className="font-semibold mb-4">Your Referrals</h3>

                {referrals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Link2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p>No referrals yet</p>
                        <p className="text-sm">Share your link to start earning!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {referrals.map((referral) => {
                            const StatusIcon = statusConfig[referral.status].icon
                            return (
                                <div
                                    key={referral.id}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50"
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full gradient-african flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold">
                                            {referral.candidateName.charAt(0)}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium">{referral.candidateName}</p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {referral.jobTitle}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div className="text-right">
                                        <span className={cn(
                                            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                                            statusConfig[referral.status].color
                                        )}>
                                            <StatusIcon className="w-3 h-3" />
                                            {statusConfig[referral.status].label}
                                        </span>
                                        {referral.status === 'hired' && referral.bonus && (
                                            <p className={cn(
                                                "text-sm font-medium mt-1",
                                                referral.bonusStatus === 'paid' ? "text-accent" : "text-secondary"
                                            )}>
                                                ${referral.bonus} {referral.bonusStatus === 'paid' ? 'earned' : 'pending'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </GlassCard>
        </div>
    )
}
