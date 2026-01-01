'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Shield, Award, Star, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VerifiedBadgeProps {
    isVerified: boolean
    verificationRequested?: boolean
    type?: 'company' | 'user'
    size?: 'sm' | 'md' | 'lg'
    showLabel?: boolean
    className?: string
}

const sizeConfig = {
    sm: { icon: 'w-3 h-3', text: 'text-xs', padding: 'px-1.5 py-0.5' },
    md: { icon: 'w-4 h-4', text: 'text-sm', padding: 'px-2 py-1' },
    lg: { icon: 'w-5 h-5', text: 'text-base', padding: 'px-3 py-1.5' }
}

export function VerifiedBadge({
    isVerified,
    verificationRequested = false,
    type = 'company',
    size = 'md',
    showLabel = true,
    className
}: VerifiedBadgeProps) {
    const sizeStyles = sizeConfig[size]

    if (!isVerified && !verificationRequested) {
        return null
    }

    const config = isVerified ? {
        icon: CheckCircle,
        label: type === 'company' ? 'Verified Company' : 'Verified Profile',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30'
    } : {
        icon: AlertCircle,
        label: 'Verification Pending',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30'
    }

    const Icon = config.icon

    return (
        <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
                "inline-flex items-center gap-1 rounded-full font-medium border",
                config.bgColor,
                config.color,
                config.borderColor,
                sizeStyles.padding,
                sizeStyles.text,
                className
            )}
            title={config.label}
        >
            <Icon className={sizeStyles.icon} />
            {showLabel && <span>{config.label}</span>}
        </motion.span>
    )
}

// Tooltip version for compact displays
export function VerifiedBadgeIcon({
    type,
    size = 'md',
    className
}: Omit<VerifiedBadgeProps, 'showLabel'>) {
    const config = badgeConfig[type]
    const sizeStyles = sizeConfig[size]
    const Icon = config.icon

    return (
        <span
            className={cn(config.color, className)}
            title={config.label}
        >
            <Icon className={cn(sizeStyles.icon, type === 'top_rated' && 'fill-current')} />
        </span>
    )
}
