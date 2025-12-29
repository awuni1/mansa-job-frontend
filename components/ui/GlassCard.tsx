'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'subtle'
    hover?: boolean
    glow?: boolean
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, variant = 'default', hover = true, glow = false, children, ...props }, ref) => {
        const variants = {
            default: 'glass-card',
            elevated: 'glass-card shadow-xl',
            subtle: 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-white/10'
        }

        return (
            <div
                ref={ref}
                className={cn(
                    variants[variant],
                    'rounded-2xl p-6 transition-all duration-300',
                    hover && 'hover-lift',
                    glow && 'pulse-glow',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)

GlassCard.displayName = 'GlassCard'

// Gradient border variant
interface GradientCardProps extends HTMLAttributes<HTMLDivElement> {
    gradientDirection?: 'to-r' | 'to-br' | 'to-b'
}

const GradientCard = forwardRef<HTMLDivElement, GradientCardProps>(
    ({ className, gradientDirection = 'to-br', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'relative p-[2px] rounded-2xl overflow-hidden',
                    'bg-gradient-to-br from-indigo via-emerald to-gold',
                    className
                )}
                style={{
                    backgroundImage: `linear-gradient(${gradientDirection === 'to-r' ? '90deg' : gradientDirection === 'to-br' ? '135deg' : '180deg'}, var(--indigo), var(--emerald), var(--gold))`
                }}
                {...props}
            >
                <div className="bg-card rounded-[14px] p-6 h-full">
                    {children}
                </div>
            </div>
        )
    }
)

GradientCard.displayName = 'GradientCard'

// Shimmer card for loading states
const ShimmerCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'relative overflow-hidden rounded-2xl bg-muted',
                    'shimmer',
                    className
                )}
                {...props}
            />
        )
    }
)

ShimmerCard.displayName = 'ShimmerCard'

export { GlassCard, GradientCard, ShimmerCard }
