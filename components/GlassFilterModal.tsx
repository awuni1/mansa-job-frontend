'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Filter, MapPin, Briefcase, DollarSign, Clock, Building2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FilterOption {
    value: string
    label: string
    count?: number
}

interface FilterSection {
    id: string
    title: string
    icon: React.ReactNode
    options: FilterOption[]
    type: 'checkbox' | 'radio' | 'range'
}

interface GlassFilterModalProps {
    isOpen: boolean
    onClose: () => void
    onApply: (filters: Record<string, string[]>) => void
    filters?: Record<string, string[]>
}

const defaultFilterSections: FilterSection[] = [
    {
        id: 'location',
        title: 'Location',
        icon: <MapPin className="w-4 h-4" />,
        type: 'checkbox',
        options: [
            { value: 'remote', label: 'Remote', count: 234 },
            { value: 'accra', label: 'Accra, Ghana', count: 156 },
            { value: 'lagos', label: 'Lagos, Nigeria', count: 189 },
            { value: 'nairobi', label: 'Nairobi, Kenya', count: 145 },
            { value: 'cape-town', label: 'Cape Town, SA', count: 98 },
            { value: 'cairo', label: 'Cairo, Egypt', count: 67 },
        ]
    },
    {
        id: 'job_type',
        title: 'Job Type',
        icon: <Briefcase className="w-4 h-4" />,
        type: 'checkbox',
        options: [
            { value: 'full_time', label: 'Full-time', count: 456 },
            { value: 'part_time', label: 'Part-time', count: 123 },
            { value: 'contract', label: 'Contract', count: 89 },
            { value: 'internship', label: 'Internship', count: 45 },
            { value: 'freelance', label: 'Freelance', count: 67 },
        ]
    },
    {
        id: 'experience',
        title: 'Experience Level',
        icon: <Clock className="w-4 h-4" />,
        type: 'checkbox',
        options: [
            { value: 'entry', label: 'Entry Level', count: 234 },
            { value: 'mid', label: 'Mid Level', count: 345 },
            { value: 'senior', label: 'Senior Level', count: 189 },
            { value: 'lead', label: 'Lead/Manager', count: 78 },
            { value: 'executive', label: 'Executive', count: 34 },
        ]
    },
    {
        id: 'salary',
        title: 'Salary Range',
        icon: <DollarSign className="w-4 h-4" />,
        type: 'checkbox',
        options: [
            { value: '0-30k', label: '$0 - $30K', count: 123 },
            { value: '30k-60k', label: '$30K - $60K', count: 234 },
            { value: '60k-100k', label: '$60K - $100K', count: 189 },
            { value: '100k-150k', label: '$100K - $150K', count: 89 },
            { value: '150k+', label: '$150K+', count: 45 },
        ]
    },
    {
        id: 'company_size',
        title: 'Company Size',
        icon: <Building2 className="w-4 h-4" />,
        type: 'checkbox',
        options: [
            { value: 'startup', label: 'Startup (1-50)', count: 234 },
            { value: 'small', label: 'Small (51-200)', count: 189 },
            { value: 'medium', label: 'Medium (201-1000)', count: 145 },
            { value: 'large', label: 'Large (1000+)', count: 98 },
        ]
    },
]

export function GlassFilterModal({
    isOpen,
    onClose,
    onApply,
    filters: initialFilters = {}
}: GlassFilterModalProps) {
    const [filters, setFilters] = useState<Record<string, string[]>>(initialFilters)
    const [expandedSections, setExpandedSections] = useState<string[]>(['location', 'job_type'])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        )
    }

    const toggleFilter = (sectionId: string, value: string) => {
        setFilters(prev => {
            const current = prev[sectionId] || []
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value]
            return { ...prev, [sectionId]: updated }
        })
    }

    const clearFilters = () => {
        setFilters({})
    }

    const getActiveCount = () => {
        return Object.values(filters).reduce((sum, arr) => sum + arr.length, 0)
    }

    const handleApply = () => {
        onApply(filters)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-hidden md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:max-h-[80vh] md:rounded-2xl"
                    >
                        <div className="glass-card rounded-t-3xl md:rounded-2xl h-full flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-primary" />
                                    <h2 className="text-lg font-bold">Filters</h2>
                                    {getActiveCount() > 0 && (
                                        <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                            {getActiveCount()}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {getActiveCount() > 0 && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-sm text-muted-foreground hover:text-foreground transition"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-full hover:bg-muted transition touch-target"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Filter Sections */}
                            <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-2 no-scrollbar">
                                {defaultFilterSections.map((section) => (
                                    <div key={section.id} className="rounded-xl border border-border/50 overflow-hidden">
                                        <button
                                            onClick={() => toggleSection(section.id)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-primary">{section.icon}</span>
                                                <span className="font-medium">{section.title}</span>
                                                {(filters[section.id]?.length || 0) > 0 && (
                                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                                                        {filters[section.id]?.length}
                                                    </span>
                                                )}
                                            </div>
                                            <ChevronDown
                                                className={cn(
                                                    "w-5 h-5 transition-transform",
                                                    expandedSections.includes(section.id) && "rotate-180"
                                                )}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {expandedSections.includes(section.id) && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-4 pb-4 space-y-2">
                                                        {section.options.map((option) => {
                                                            const isSelected = filters[section.id]?.includes(option.value)
                                                            return (
                                                                <button
                                                                    key={option.value}
                                                                    onClick={() => toggleFilter(section.id, option.value)}
                                                                    className={cn(
                                                                        "w-full flex items-center justify-between p-3 rounded-lg transition touch-target",
                                                                        isSelected
                                                                            ? "bg-primary/10 border border-primary/30"
                                                                            : "hover:bg-muted border border-transparent"
                                                                    )}
                                                                >
                                                                    <span className={cn(
                                                                        "font-medium",
                                                                        isSelected && "text-primary"
                                                                    )}>
                                                                        {option.label}
                                                                    </span>
                                                                    <div className="flex items-center gap-2">
                                                                        {option.count && (
                                                                            <span className="text-xs text-muted-foreground">
                                                                                {option.count}
                                                                            </span>
                                                                        )}
                                                                        <div className={cn(
                                                                            "w-5 h-5 rounded border-2 flex items-center justify-center transition",
                                                                            isSelected
                                                                                ? "bg-primary border-primary"
                                                                                : "border-muted-foreground/30"
                                                                        )}>
                                                                            {isSelected && (
                                                                                <motion.svg
                                                                                    initial={{ scale: 0 }}
                                                                                    animate={{ scale: 1 }}
                                                                                    className="w-3 h-3 text-primary-foreground"
                                                                                    viewBox="0 0 24 24"
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="3"
                                                                                >
                                                                                    <path d="M5 12l5 5L20 7" />
                                                                                </motion.svg>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-border/50 safe-bottom">
                                <Button
                                    onClick={handleApply}
                                    className="w-full min-h-14 text-base font-semibold gradient-african"
                                >
                                    Show Results
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

// Floating filter button for mobile
export function FilterButton({
    onClick,
    activeCount = 0
}: {
    onClick: () => void
    activeCount?: number
}) {
    return (
        <motion.button
            onClick={onClick}
            className={cn(
                "fixed bottom-24 right-4 z-40 md:hidden",
                "w-14 h-14 rounded-full",
                "bg-primary text-primary-foreground",
                "flex items-center justify-center",
                "shadow-lg shadow-primary/30",
                "touch-target"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Filter className="w-5 h-5" />
            {activeCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                    {activeCount}
                </span>
            )}
        </motion.button>
    )
}
