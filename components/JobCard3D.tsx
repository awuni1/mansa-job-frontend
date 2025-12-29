'use client'

import { useRef, useState, useCallback, HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, Clock, Bookmark, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface Job {
    id: number | string
    title: string
    company: {
        name: string
        logo?: string | null
        location?: string
    }
    location: string
    job_type: string
    salary_range?: string
    created_at: string
    skills?: string[]
}

interface JobCard3DProps extends HTMLAttributes<HTMLDivElement> {
    job: Job
    onSave?: (jobId: number | string) => void
    onShare?: (jobId: number | string) => void
    isSaved?: boolean
}

export function JobCard3D({
    job,
    onSave,
    onShare,
    isSaved = false,
    className,
    ...props
}: JobCard3DProps) {
    const cardRef = useRef<HTMLDivElement>(null)
    const [rotateX, setRotateX] = useState(0)
    const [rotateY, setRotateY] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return

        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotationX = ((y - centerY) / centerY) * -8
        const rotationY = ((x - centerX) / centerX) * 8

        setRotateX(rotationX)
        setRotateY(rotationY)
    }, [])

    const handleMouseLeave = useCallback(() => {
        setRotateX(0)
        setRotateY(0)
        setIsHovered(false)
    }, [])

    const formatJobType = (type: string) => {
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    const timeAgo = (date: string) => {
        const now = new Date()
        const posted = new Date(date)
        const diff = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24))
        if (diff === 0) return 'Today'
        if (diff === 1) return 'Yesterday'
        if (diff < 7) return `${diff} days ago`
        if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`
        return `${Math.floor(diff / 30)} months ago`
    }

    return (
        <motion.div
            ref={cardRef}
            className={cn(
                "relative group cursor-pointer",
                "perspective-1000",
                className
            )}
            style={{
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            {...props}
        >
            <Link href={`/jobs/${job.id}`}>
                <motion.div
                    className={cn(
                        "relative overflow-hidden rounded-2xl",
                        "bg-card border border-border/50",
                        "p-5 sm:p-6",
                        "transition-shadow duration-300",
                        "hover:shadow-xl hover:shadow-primary/10",
                        "hover:border-primary/30"
                    )}
                    animate={{
                        rotateX,
                        rotateY,
                        scale: isHovered ? 1.02 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                    {/* Shimmer overlay on hover */}
                    <div
                        className={cn(
                            "absolute inset-0 opacity-0 group-hover:opacity-100",
                            "bg-gradient-to-r from-transparent via-white/10 to-transparent",
                            "translate-x-[-100%] group-hover:translate-x-[100%]",
                            "transition-all duration-1000"
                        )}
                    />

                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0 pr-3">
                            <h3 className="font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {job.title}
                            </h3>
                            <p className="text-muted-foreground mt-1 truncate">{job.company.name}</p>
                        </div>

                        {/* Company Logo */}
                        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                            {job.company.logo ? (
                                <img
                                    src={job.company.logo}
                                    alt={job.company.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xl sm:text-2xl font-bold gradient-african-text">
                                    {job.company.name.charAt(0)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate max-w-[120px]">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4" />
                            <span>{formatJobType(job.job_type)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>{timeAgo(job.created_at)}</span>
                        </div>
                    </div>

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills.slice(0, 4).map((skill, index) => (
                                <motion.span
                                    key={skill}
                                    className={cn(
                                        "px-3 py-1 rounded-full text-xs font-medium",
                                        "bg-primary/10 text-primary",
                                        "group-hover:bg-primary/20 transition-colors"
                                    )}
                                    initial={{ scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    {skill}
                                </motion.span>
                            ))}
                            {job.skills.length > 4 && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                    +{job.skills.length - 4}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-3 border-t border-border/50">
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {job.salary_range || 'Competitive salary'}
                        </span>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                            <motion.button
                                className={cn(
                                    "p-2 rounded-full transition-colors touch-target",
                                    isSaved
                                        ? "bg-secondary/20 text-secondary"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onSave?.(job.id)}
                            >
                                <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
                            </motion.button>
                            <motion.button
                                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors touch-target"
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onShare?.(job.id)}
                            >
                                <Share2 className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    )
}

// Skeleton version for loading states
export function JobCard3DSkeleton() {
    return (
        <div className="rounded-2xl bg-card border border-border/50 p-5 sm:p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-3">
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                </div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-muted" />
            </div>

            <div className="flex gap-3 mb-4">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-4 bg-muted rounded w-16" />
            </div>

            <div className="flex gap-2 mb-4">
                <div className="h-6 bg-muted rounded-full w-16" />
                <div className="h-6 bg-muted rounded-full w-20" />
                <div className="h-6 bg-muted rounded-full w-14" />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border/50">
                <div className="h-4 bg-muted rounded w-28" />
                <div className="flex gap-2">
                    <div className="w-8 h-8 bg-muted rounded-full" />
                    <div className="w-8 h-8 bg-muted rounded-full" />
                </div>
            </div>
        </div>
    )
}
