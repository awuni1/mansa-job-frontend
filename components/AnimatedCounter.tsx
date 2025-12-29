'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
    value: number
    duration?: number
    suffix?: string
    prefix?: string
    className?: string
    formatValue?: (value: number) => string
}

export function AnimatedCounter({
    value,
    duration = 2,
    suffix = '',
    prefix = '',
    className,
    formatValue
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-50px' })
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        if (!isInView) return

        let startTime: number
        let animationFrame: number

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / (duration * 1000), 1)

            // Easing function (ease-out-expo)
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

            setDisplayValue(Math.floor(easeOutExpo * value))

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
            } else {
                setDisplayValue(value)
            }
        }

        animationFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrame)
    }, [isInView, value, duration])

    const formattedValue = formatValue
        ? formatValue(displayValue)
        : displayValue.toLocaleString()

    return (
        <motion.span
            ref={ref}
            className={cn('tabular-nums', className)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {prefix}{formattedValue}{suffix}
        </motion.span>
    )
}

// Compact version for stats
interface StatCounterProps {
    value: number
    label: string
    icon?: React.ReactNode
    suffix?: string
    className?: string
}

export function StatCounter({ value, label, icon, suffix = '', className }: StatCounterProps) {
    return (
        <div className={cn('flex flex-col items-center text-center', className)}>
            {icon && (
                <div className="mb-2 p-2 rounded-full bg-primary/10 text-primary">
                    {icon}
                </div>
            )}
            <AnimatedCounter
                value={value}
                suffix={suffix}
                className="text-3xl sm:text-4xl font-bold gradient-african-text"
            />
            <span className="text-sm text-muted-foreground mt-1">{label}</span>
        </div>
    )
}

// Format large numbers (e.g., 10000 -> 10K)
export function formatLargeNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    }
    return num.toString()
}
