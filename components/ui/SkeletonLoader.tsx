'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'circular' | 'rounded' | 'text'
    width?: string | number
    height?: string | number
    animate?: boolean
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, variant = 'default', width, height, animate = true, style, ...props }, ref) => {
        const variants = {
            default: 'rounded-lg',
            circular: 'rounded-full',
            rounded: 'rounded-2xl',
            text: 'rounded h-4'
        }

        return (
            <div
                ref={ref}
                className={cn(
                    'bg-muted',
                    animate && 'skeleton',
                    variants[variant],
                    className
                )}
                style={{
                    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
                    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
                    ...style
                }}
                {...props}
            />
        )
    }
)

Skeleton.displayName = 'Skeleton'

// Job Card Skeleton
function JobCardSkeleton() {
    return (
        <div className="rounded-2xl bg-card border border-border/50 p-5 sm:p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-3">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton variant="rounded" className="w-12 h-12 sm:w-14 sm:h-14" />
            </div>

            <div className="flex gap-3 mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
            </div>

            <div className="flex gap-2 mb-4">
                <Skeleton variant="rounded" className="h-6 w-16 !rounded-full" />
                <Skeleton variant="rounded" className="h-6 w-20 !rounded-full" />
                <Skeleton variant="rounded" className="h-6 w-14 !rounded-full" />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border/50">
                <Skeleton className="h-4 w-28" />
                <div className="flex gap-2">
                    <Skeleton variant="circular" className="w-8 h-8" />
                    <Skeleton variant="circular" className="w-8 h-8" />
                </div>
            </div>
        </div>
    )
}

// Profile Skeleton
function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Skeleton variant="circular" className="w-20 h-20" />
                <div className="flex-1">
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-xl bg-card border p-4">
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    )
}

// Dashboard Stats Skeleton
function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Welcome card */}
            <div className="rounded-2xl bg-card border p-6">
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4" />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="rounded-xl bg-card border p-4">
                        <Skeleton variant="circular" className="w-10 h-10 mb-3" />
                        <Skeleton className="h-6 w-12 mb-1" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ))}
            </div>

            {/* Table skeleton */}
            <div className="rounded-2xl bg-card border overflow-hidden">
                <div className="p-4 border-b">
                    <Skeleton className="h-6 w-32" />
                </div>
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="p-4 border-b last:border-0 flex items-center gap-4">
                        <Skeleton variant="rounded" className="w-10 h-10" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-1/3 mb-1" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                    </div>
                ))}
            </div>
        </div>
    )
}

// List Skeleton
function ListSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <Skeleton variant="rounded" className="w-12 h-12" />
                    <div className="flex-1">
                        <Skeleton className="h-4 w-1/3 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export {
    Skeleton,
    JobCardSkeleton,
    ProfileSkeleton,
    DashboardSkeleton,
    ListSkeleton
}
