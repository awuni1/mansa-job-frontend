'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    BarChart3, TrendingUp, TrendingDown, Users, Eye,
    FileText, Clock, Target, Calendar, ArrowRight
} from 'lucide-react'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface AnalyticsData {
    totalViews: number
    viewsChange: number
    totalApplications: number
    applicationsChange: number
    activeJobs: number
    avgTimeToHire: number
    conversionRate: number
    viewsByDay: { date: string; views: number; applications: number }[]
    topJobs: { title: string; views: number; applications: number }[]
    sourceBreakdown: { source: string; count: number; percentage: number }[]
}

interface AnalyticsDashboardProps {
    data: AnalyticsData
    period?: '7d' | '30d' | '90d'
    onPeriodChange?: (period: '7d' | '30d' | '90d') => void
    className?: string
}

export function AnalyticsDashboard({
    data,
    period = '30d',
    onPeriodChange,
    className
}: AnalyticsDashboardProps) {
    const [selectedPeriod, setSelectedPeriod] = useState(period)

    const handlePeriodChange = (p: '7d' | '30d' | '90d') => {
        setSelectedPeriod(p)
        onPeriodChange?.(p)
    }

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    const maxViews = Math.max(...data.viewsByDay.map(d => d.views))
    const maxApps = Math.max(...data.viewsByDay.map(d => d.applications))

    return (
        <div className={cn("space-y-6", className)}>
            {/* Period Selector */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Analytics Overview</h2>
                <div className="flex gap-1 p-1 rounded-lg bg-muted">
                    {['7d', '30d', '90d'].map((p) => (
                        <button
                            key={p}
                            onClick={() => handlePeriodChange(p as '7d' | '30d' | '90d')}
                            className={cn(
                                "px-4 py-1.5 rounded-md text-sm font-medium transition",
                                selectedPeriod === p
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted-foreground/10"
                            )}
                        >
                            {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard className="!p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <Eye className="w-5 h-5 text-blue-500" />
                        </div>
                        <span className={cn(
                            "flex items-center gap-1 text-sm",
                            data.viewsChange >= 0 ? "text-accent" : "text-destructive"
                        )}>
                            {data.viewsChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(data.viewsChange)}%
                        </span>
                    </div>
                    <p className="text-2xl font-bold">{formatNumber(data.totalViews)}</p>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                </GlassCard>

                <GlassCard className="!p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-accent/10">
                            <FileText className="w-5 h-5 text-accent" />
                        </div>
                        <span className={cn(
                            "flex items-center gap-1 text-sm",
                            data.applicationsChange >= 0 ? "text-accent" : "text-destructive"
                        )}>
                            {data.applicationsChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(data.applicationsChange)}%
                        </span>
                    </div>
                    <p className="text-2xl font-bold">{formatNumber(data.totalApplications)}</p>
                    <p className="text-sm text-muted-foreground">Applications</p>
                </GlassCard>

                <GlassCard className="!p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-secondary/10">
                            <Target className="w-5 h-5 text-secondary" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold">{data.conversionRate}%</p>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                </GlassCard>

                <GlassCard className="!p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                            <Clock className="w-5 h-5 text-purple-500" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold">{data.avgTimeToHire}</p>
                    <p className="text-sm text-muted-foreground">Avg. Days to Hire</p>
                </GlassCard>
            </div>

            {/* Chart */}
            <GlassCard className="!p-6">
                <h3 className="font-semibold mb-4">Views & Applications Trend</h3>
                <div className="h-48 flex items-end gap-1">
                    {data.viewsByDay.map((day, i) => (
                        <div key={day.date} className="flex-1 flex flex-col items-center justify-end gap-1">
                            {/* Views bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(day.views / maxViews) * 100}%` }}
                                transition={{ delay: i * 0.05 }}
                                className="w-full bg-blue-500/20 rounded-t-sm relative group"
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-popover text-xs opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                                    {day.views} views
                                </div>
                            </motion.div>
                            {/* Applications bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(day.applications / maxViews) * 100}%` }}
                                transition={{ delay: i * 0.05 + 0.1 }}
                                className="w-full bg-accent rounded-t-sm"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground overflow-x-auto">
                    {data.viewsByDay.filter((_, i) => i % 5 === 0).map((day) => (
                        <span key={day.date}>{day.date}</span>
                    ))}
                </div>
                <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-blue-500/20" />
                        <span className="text-sm text-muted-foreground">Views</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-accent" />
                        <span className="text-sm text-muted-foreground">Applications</span>
                    </div>
                </div>
            </GlassCard>

            {/* Bottom Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Top Performing Jobs */}
                <GlassCard className="!p-6">
                    <h3 className="font-semibold mb-4">Top Performing Jobs</h3>
                    <div className="space-y-3">
                        {data.topJobs.map((job, i) => (
                            <div key={job.title} className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{job.title}</p>
                                    <div className="flex gap-3 text-xs text-muted-foreground">
                                        <span>{formatNumber(job.views)} views</span>
                                        <span>{job.applications} apps</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Traffic Sources */}
                <GlassCard className="!p-6">
                    <h3 className="font-semibold mb-4">Application Sources</h3>
                    <div className="space-y-3">
                        {data.sourceBreakdown.map((source) => (
                            <div key={source.source}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{source.source}</span>
                                    <span className="text-muted-foreground">{source.percentage}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${source.percentage}%` }}
                                        transition={{ duration: 0.5 }}
                                        className="h-full gradient-african rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}
