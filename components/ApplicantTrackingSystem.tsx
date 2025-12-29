'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Users, Search, Filter, Plus, MoreVertical,
    Mail, Phone, Calendar, Star, StarOff, MessageSquare,
    Eye, Download, Trash2, ChevronRight, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface Candidate {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
    appliedFor: string
    appliedAt: string
    status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
    rating: number
    skills: string[]
    resumeUrl?: string
    notes: string[]
}

interface ATSProps {
    candidates: Candidate[]
    onStatusChange?: (id: string, status: Candidate['status']) => void
    onRatingChange?: (id: string, rating: number) => void
    onAddNote?: (id: string, note: string) => void
    className?: string
}

const statusConfig = {
    new: { label: 'New', color: 'bg-blue-500/20 text-blue-600' },
    screening: { label: 'Screening', color: 'bg-secondary/20 text-secondary' },
    interview: { label: 'Interview', color: 'bg-purple-500/20 text-purple-600' },
    offer: { label: 'Offer', color: 'bg-accent/20 text-accent' },
    hired: { label: 'Hired', color: 'bg-accent/20 text-accent' },
    rejected: { label: 'Rejected', color: 'bg-destructive/20 text-destructive' },
}

export function ApplicantTrackingSystem({
    candidates,
    onStatusChange,
    onRatingChange,
    onAddNote,
    className
}: ATSProps) {
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
    const [showMenu, setShowMenu] = useState<string | null>(null)
    const [newNote, setNewNote] = useState('')

    const filteredCandidates = candidates.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.appliedFor.toLowerCase().includes(search.toLowerCase())
        const matchesFilter = filterStatus === 'all' || c.status === filterStatus
        return matchesSearch && matchesFilter
    })

    const getStatusCounts = () => {
        const counts: Record<string, number> = { all: candidates.length }
        candidates.forEach(c => {
            counts[c.status] = (counts[c.status] || 0) + 1
        })
        return counts
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const renderStars = (rating: number, candidateId: string) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => onRatingChange?.(candidateId, star)}
                        className="p-0.5 hover:scale-110 transition-transform"
                    >
                        {star <= rating ? (
                            <Star className="w-4 h-4 fill-secondary text-secondary" />
                        ) : (
                            <StarOff className="w-4 h-4 text-muted-foreground/30" />
                        )}
                    </button>
                ))}
            </div>
        )
    }

    return (
        <div className={cn("flex gap-6", className)}>
            {/* Main Panel */}
            <div className="flex-1">
                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search candidates..."
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {['all', ...Object.keys(statusConfig)].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition",
                                    filterStatus === status
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-muted/80"
                                )}
                            >
                                {status === 'all' ? 'All' : statusConfig[status as keyof typeof statusConfig].label}
                                <span className="ml-1 opacity-70">
                                    ({getStatusCounts()[status] || 0})
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Candidates List */}
                <div className="space-y-3">
                    {filteredCandidates.map((candidate) => (
                        <motion.div
                            key={candidate.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <GlassCard
                                className={cn(
                                    "!p-4 cursor-pointer transition-shadow hover:shadow-lg",
                                    selectedCandidate?.id === candidate.id && "ring-2 ring-primary"
                                )}
                                onClick={() => setSelectedCandidate(candidate)}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-full gradient-african flex items-center justify-center flex-shrink-0">
                                        {candidate.avatar ? (
                                            <img
                                                src={candidate.avatar}
                                                alt={candidate.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-white font-bold">
                                                {candidate.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold truncate">{candidate.name}</h3>
                                            {renderStars(candidate.rating, candidate.id)}
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">
                                            Applied for: {candidate.appliedFor}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                                statusConfig[candidate.status].color
                                            )}>
                                                {statusConfig[candidate.status].label}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(candidate.appliedAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setShowMenu(showMenu === candidate.id ? null : candidate.id)
                                            }}
                                            className="p-2 rounded-lg hover:bg-muted transition"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>

                                        {showMenu === candidate.id && (
                                            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border rounded-lg shadow-lg z-10 py-1">
                                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                                                    <Eye className="w-4 h-4" />
                                                    View Resume
                                                </button>
                                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                                                    <Mail className="w-4 h-4" />
                                                    Send Email
                                                </button>
                                                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted">
                                                    <Calendar className="w-4 h-4" />
                                                    Schedule Interview
                                                </button>
                                                <hr className="my-1" />
                                                <button
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onStatusChange?.(candidate.id, 'rejected')
                                                        setShowMenu(null)
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border/50">
                                    {candidate.skills.slice(0, 5).map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {candidate.skills.length > 5 && (
                                        <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                                            +{candidate.skills.length - 5}
                                        </span>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}

                    {filteredCandidates.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                            <p>No candidates found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Candidate Detail Panel */}
            {selectedCandidate && (
                <div className="w-[350px] hidden lg:block">
                    <GlassCard className="!p-6 sticky top-24">
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 rounded-full gradient-african mx-auto flex items-center justify-center mb-4">
                                <span className="text-white font-bold text-2xl">
                                    {selectedCandidate.name.charAt(0)}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold">{selectedCandidate.name}</h2>
                            <p className="text-muted-foreground">{selectedCandidate.appliedFor}</p>
                            {renderStars(selectedCandidate.rating, selectedCandidate.id)}
                        </div>

                        {/* Contact */}
                        <div className="space-y-3 mb-6">
                            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm truncate">{selectedCandidate.email}</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted hover:bg-muted/80 transition">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm">{selectedCandidate.phone}</span>
                            </button>
                        </div>

                        {/* Status Change */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium mb-2">Change Status</h3>
                            <select
                                value={selectedCandidate.status}
                                onChange={(e) => onStatusChange?.(selectedCandidate.id, e.target.value as Candidate['status'])}
                                className="w-full p-2 rounded-lg border border-input bg-background"
                            >
                                {Object.entries(statusConfig).map(([value, config]) => (
                                    <option key={value} value={value}>
                                        {config.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Notes */}
                        <div>
                            <h3 className="text-sm font-medium mb-2">Notes</h3>
                            <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                                {selectedCandidate.notes.map((note, i) => (
                                    <p key={i} className="text-sm p-2 rounded-lg bg-muted/50">
                                        {note}
                                    </p>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Add a note..."
                                    className="text-sm"
                                />
                                <Button
                                    size="icon"
                                    onClick={() => {
                                        if (newNote.trim()) {
                                            onAddNote?.(selectedCandidate.id, newNote)
                                            setNewNote('')
                                        }
                                    }}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    )
}
