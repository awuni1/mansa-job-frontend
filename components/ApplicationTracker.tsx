'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    GripVertical, MoreVertical, MapPin, Building2, Clock,
    ExternalLink, Trash2, MessageSquare, ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface Application {
    id: string
    jobId: string
    jobTitle: string
    company: string
    companyLogo?: string
    location: string
    appliedAt: string
    status: 'applied' | 'reviewed' | 'interview' | 'offer' | 'hired' | 'rejected'
    notes?: string
    interviewDate?: string
}

interface ApplicationTrackerProps {
    applications: Application[]
    onStatusChange?: (id: string, status: Application['status']) => void
    onDelete?: (id: string) => void
    className?: string
}

const statusConfig = {
    applied: { label: 'Applied', color: 'bg-blue-500/20 text-blue-600', column: 0 },
    reviewed: { label: 'Under Review', color: 'bg-secondary/20 text-secondary', column: 1 },
    interview: { label: 'Interview', color: 'bg-purple-500/20 text-purple-600', column: 2 },
    offer: { label: 'Offer', color: 'bg-accent/20 text-accent', column: 3 },
    hired: { label: 'Hired', color: 'bg-accent/20 text-accent', column: 4 },
    rejected: { label: 'Rejected', color: 'bg-destructive/20 text-destructive', column: -1 },
}

const columns = ['Applied', 'Under Review', 'Interview', 'Offer', 'Hired']

export function ApplicationTracker({
    applications,
    onStatusChange,
    onDelete,
    className
}: ApplicationTrackerProps) {
    const [draggedId, setDraggedId] = useState<string | null>(null)
    const [showMenu, setShowMenu] = useState<string | null>(null)

    const getColumnApps = (colIndex: number) => {
        return applications.filter(app => {
            const config = statusConfig[app.status]
            return config.column === colIndex
        })
    }

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedId(id)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const handleDrop = (e: React.DragEvent, colIndex: number) => {
        e.preventDefault()
        if (!draggedId || !onStatusChange) return

        const statusMap: Record<number, Application['status']> = {
            0: 'applied',
            1: 'reviewed',
            2: 'interview',
            3: 'offer',
            4: 'hired'
        }

        onStatusChange(draggedId, statusMap[colIndex])
        setDraggedId(null)
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <div className={cn("overflow-x-auto pb-4", className)}>
            {/* Kanban Board */}
            <div className="flex gap-4 min-w-[900px]">
                {columns.map((column, colIndex) => (
                    <div
                        key={column}
                        className="flex-1 min-w-[200px]"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, colIndex)}
                    >
                        {/* Column Header */}
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h3 className="font-semibold text-sm">{column}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
                                {getColumnApps(colIndex).length}
                            </span>
                        </div>

                        {/* Column Content */}
                        <div className="space-y-3 min-h-[200px] p-2 rounded-xl bg-muted/30">
                            {getColumnApps(colIndex).map((app) => (
                                <motion.div
                                    key={app.id}
                                    layout
                                    draggable
                                    onDragStart={(e) => handleDragStart(e as any, app.id)}
                                    onDragEnd={() => setDraggedId(null)}
                                    className={cn(
                                        "cursor-grab active:cursor-grabbing",
                                        draggedId === app.id && "opacity-50"
                                    )}
                                >
                                    <GlassCard className="!p-3 hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-2">
                                            <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/jobs/${app.jobId}`}
                                                    className="font-medium text-sm hover:text-primary transition line-clamp-1"
                                                >
                                                    {app.jobTitle}
                                                </Link>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Building2 className="w-3 h-3" />
                                                    {app.company}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDate(app.appliedAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions Menu */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowMenu(showMenu === app.id ? null : app.id)}
                                                    className="p-1 rounded hover:bg-muted transition"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>

                                                {showMenu === app.id && (
                                                    <div className="absolute right-0 top-full mt-1 w-40 bg-popover border rounded-lg shadow-lg z-10 py-1">
                                                        <Link
                                                            href={`/jobs/${app.jobId}`}
                                                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                            View Job
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                onDelete?.(app.id)
                                                                setShowMenu(null)
                                                            }}
                                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Interview Date */}
                                        {app.status === 'interview' && app.interviewDate && (
                                            <div className="mt-2 p-2 rounded-lg bg-purple-500/10 text-purple-600 text-xs flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Interview: {formatDate(app.interviewDate)}
                                            </div>
                                        )}
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Rejected Applications */}
            {applications.filter(a => a.status === 'rejected').length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">
                        Rejected ({applications.filter(a => a.status === 'rejected').length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {applications.filter(a => a.status === 'rejected').map((app) => (
                            <div
                                key={app.id}
                                className="px-3 py-2 rounded-lg bg-muted/50 text-sm text-muted-foreground"
                            >
                                {app.jobTitle} at {app.company}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
