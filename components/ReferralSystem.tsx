'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Link2, Copy, Check, Users, DollarSign,
    Clock, CheckCircle, XCircle, Plus, Send, Loader2, Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface Referral {
    id: number
    company_name: string
    candidate_name: string
    candidate_email: string
    candidate_phone: string
    job_title: string
    message: string
    status: 'pending' | 'contacted' | 'interviewing' | 'hired' | 'rejected'
    status_updated_at: string
    reward_amount: string
    reward_paid: boolean
    created_at: string
}

interface ReferralSystemProps {
    companySlug?: string
    className?: string
}

const statusConfig = {
    pending: { label: 'Pending Review', color: 'bg-muted text-muted-foreground', icon: Clock },
    contacted: { label: 'Contacted', color: 'bg-blue-500/20 text-blue-600', icon: CheckCircle },
    interviewing: { label: 'Interviewing', color: 'bg-secondary/20 text-secondary', icon: Users },
    hired: { label: 'Hired!', color: 'bg-accent/20 text-accent', icon: CheckCircle },
    rejected: { label: 'Not Selected', color: 'bg-destructive/20 text-destructive', icon: XCircle },
}

export function ReferralSystem({
    companySlug,
    className
}: ReferralSystemProps) {
    const [referrals, setReferrals] = useState<Referral[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    
    // Form state
    const [candidateName, setCandidateName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [jobId, setJobId] = useState('')
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [message, setMessage] = useState('')
    
    useEffect(() => {
        fetchReferrals()
    }, [])

    const fetchReferrals = async () => {
        try {
            const token = localStorage.getItem('auth_token')
            if (!token) return

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
            const response = await fetch(`${API_URL}/companies/referrals/my/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (response.ok) {
                const data = await response.json()
                setReferrals(data)
            }
        } catch (error) {
            console.error('Failed to fetch referrals:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const token = localStorage.getItem('auth_token')
        if (!token) {
            alert('Please log in to submit referrals')
            return
        }

        setSubmitting(true)

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
            const formDataToSend = new FormData()
            
            formDataToSend.append('company', companySlug || '')
            formDataToSend.append('candidate_name', candidateName)
            formDataToSend.append('candidate_email', email)
            formDataToSend.append('candidate_phone', phone)
            formDataToSend.append('job_title', jobId)
            formDataToSend.append('message', message)
            
            if (resumeFile) {
                formDataToSend.append('candidate_resume', resumeFile)
            }

            const response = await fetch(`${API_URL}/companies/referrals/create/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            })

            if (response.ok) {
                alert('Referral submitted successfully!')
                setCandidateName('')
                setEmail('')
                setPhone('')
                setJobId('')
                setMessage('')
                setResumeFile(null)
                setShowForm(false)
                fetchReferrals()
            } else {
                const error = await response.json()
                alert(`Failed to submit: ${JSON.stringify(error)}`)
            }
        } catch (error) {
            console.error('Referral submission error:', error)
            alert('Failed to submit referral')
        } finally {
            setSubmitting(false)
        }
    }

    const stats = {
        total: referrals.length,
        pending: referrals.filter(r => r.status === 'pending').length,
        applied: referrals.filter(r => r.status === 'contacted' || r.status === 'interviewing').length,
        hired: referrals.filter(r => r.status === 'hired').length,
        earned: referrals.filter(r => r.reward_paid).reduce((sum, r) => sum + parseFloat(r.reward_amount), 0),
        pendingReward: referrals.filter(r => r.status === 'hired' && !r.reward_paid).reduce((sum, r) => sum + parseFloat(r.reward_amount), 0)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Refer Someone Card */}
            <GradientCard className="!p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold mb-1">Refer a Candidate</h3>
                        <p className="text-sm text-muted-foreground">
                            Earn rewards by referring talented candidates
                        </p>
                    </div>
                    <Button onClick={() => setShowForm(!showForm)}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Referral
                    </Button>
                </div>

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
                                            {referral.candidate_name.charAt(0)}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium">{referral.candidate_name}</p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {referral.job_title}
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
                                        {referral.status === 'hired' && referral.reward_amount && (
                                            <p className={cn(
                                                "text-sm font-medium mt-1",
                                                referral.reward_paid ? "text-accent" : "text-secondary"
                                            )}>
                                                ${referral.reward_amount} {referral.reward_paid ? 'earned' : 'pending'}
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
