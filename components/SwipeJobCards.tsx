'use client'

import { useState } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import {
    Heart, X, MapPin, Briefcase, DollarSign,
    RotateCcw, Bookmark, Share2, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Job {
    id: string | number
    title: string
    company: {
        name: string
        logo?: string
    }
    location: string
    jobType: string
    salary: string
    skills: string[]
    description: string
}

interface SwipeJobCardsProps {
    jobs: Job[]
    onSwipeRight: (job: Job) => void  // Apply
    onSwipeLeft: (job: Job) => void   // Skip
    onSave?: (job: Job) => void
    className?: string
}

export function SwipeJobCards({
    jobs,
    onSwipeRight,
    onSwipeLeft,
    onSave,
    className
}: SwipeJobCardsProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState<'left' | 'right' | null>(null)
    const [showDetails, setShowDetails] = useState(false)
    const [history, setHistory] = useState<number[]>([])

    const currentJob = jobs[currentIndex]
    const hasMore = currentIndex < jobs.length

    const handleSwipe = (dir: 'left' | 'right') => {
        if (!currentJob) return

        setDirection(dir)
        setHistory([...history, currentIndex])

        setTimeout(() => {
            if (dir === 'right') {
                onSwipeRight(currentJob)
            } else {
                onSwipeLeft(currentJob)
            }
            setCurrentIndex(currentIndex + 1)
            setDirection(null)
            setShowDetails(false)
        }, 300)
    }

    const handleDragEnd = (event: any, info: PanInfo) => {
        const threshold = 100
        if (info.offset.x > threshold) {
            handleSwipe('right')
        } else if (info.offset.x < -threshold) {
            handleSwipe('left')
        }
    }

    const handleUndo = () => {
        if (history.length === 0) return
        const prevIndex = history[history.length - 1]
        setHistory(history.slice(0, -1))
        setCurrentIndex(prevIndex)
    }

    const formatJobType = (type: string) => {
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    if (!hasMore) {
        return (
            <div className={cn("flex flex-col items-center justify-center py-16", className)}>
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Briefcase className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No more jobs</h3>
                <p className="text-muted-foreground text-center mb-6">
                    You&apos;ve gone through all available jobs.<br />
                    Check back later for new opportunities!
                </p>
                {history.length > 0 && (
                    <Button onClick={handleUndo} variant="outline">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className={cn("relative max-w-md mx-auto", className)}>
            {/* Card Stack */}
            <div className="relative h-[500px] sm:h-[550px]">
                {/* Background cards */}
                {jobs.slice(currentIndex + 1, currentIndex + 3).map((job, i) => (
                    <div
                        key={job.id}
                        className="absolute inset-x-0 top-0 bg-card rounded-3xl shadow-lg"
                        style={{
                            transform: `scale(${0.95 - i * 0.05}) translateY(${(i + 1) * 20}px)`,
                            zIndex: 10 - i
                        }}
                    >
                        <div className="h-[500px] sm:h-[550px]" />
                    </div>
                ))}

                {/* Current card */}
                <motion.div
                    key={currentJob.id}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    animate={{
                        x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
                        rotate: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
                        opacity: direction ? 0 : 1
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-card rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing z-20"
                >
                    {/* Swipe Indicators */}
                    <motion.div
                        className="absolute top-8 left-8 px-4 py-2 rounded-xl bg-destructive/90 text-white font-bold text-xl rotate-[-15deg] z-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: direction === 'left' ? 1 : 0 }}
                    >
                        SKIP
                    </motion.div>
                    <motion.div
                        className="absolute top-8 right-8 px-4 py-2 rounded-xl bg-accent/90 text-white font-bold text-xl rotate-[15deg] z-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: direction === 'right' ? 1 : 0 }}
                    >
                        APPLY
                    </motion.div>

                    {/* Card Content */}
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="gradient-african p-6 text-white">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                    {currentJob.company.logo ? (
                                        <img
                                            src={currentJob.company.logo}
                                            alt={currentJob.company.name}
                                            className="w-full h-full rounded-2xl object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold">
                                            {currentJob.company.name.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-xl font-bold line-clamp-2">{currentJob.title}</h2>
                                    <p className="opacity-90">{currentJob.company.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-sm">
                                    <MapPin className="w-3 h-3" />
                                    {currentJob.location}
                                </span>
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-sm">
                                    <Briefcase className="w-3 h-3" />
                                    {formatJobType(currentJob.jobType)}
                                </span>
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
                                    <DollarSign className="w-3 h-3" />
                                    {currentJob.salary}
                                </span>
                            </div>

                            {/* Skills */}
                            <div className="mb-4">
                                <h3 className="text-sm font-medium mb-2">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentJob.skills.slice(0, 6).map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="flex items-center gap-1 text-sm text-primary mb-2"
                                >
                                    <ChevronDown className={cn(
                                        "w-4 h-4 transition-transform",
                                        showDetails && "rotate-180"
                                    )} />
                                    {showDetails ? 'Hide' : 'Show'} description
                                </button>
                                <AnimatePresence>
                                    {showDetails && (
                                        <motion.p
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="text-sm text-muted-foreground overflow-hidden"
                                        >
                                            {currentJob.description}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 mt-6">
                <motion.button
                    onClick={() => handleSwipe('left')}
                    className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <X className="w-8 h-8" />
                </motion.button>

                {history.length > 0 && (
                    <motion.button
                        onClick={handleUndo}
                        className="w-12 h-12 rounded-full bg-muted flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <RotateCcw className="w-5 h-5" />
                    </motion.button>
                )}

                <motion.button
                    onClick={() => onSave?.(currentJob)}
                    className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Bookmark className="w-5 h-5" />
                </motion.button>

                <motion.button
                    onClick={() => handleSwipe('right')}
                    className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Heart className="w-8 h-8" />
                </motion.button>
            </div>

            {/* Progress */}
            <div className="text-center mt-4 text-sm text-muted-foreground">
                {currentIndex + 1} of {jobs.length} jobs
            </div>
        </div>
    )
}
