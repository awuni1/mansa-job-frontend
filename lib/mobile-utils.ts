'use client'

import { useState, useEffect, useCallback } from 'react'

// Breakpoint values matching Tailwind defaults
export const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const

type Breakpoint = keyof typeof breakpoints

// Hook to detect current breakpoint
export function useBreakpoint() {
    const [breakpoint, setBreakpoint] = useState<Breakpoint | 'xs'>('xs')

    useEffect(() => {
        const getBreakpoint = (): Breakpoint | 'xs' => {
            const width = window.innerWidth
            if (width >= breakpoints['2xl']) return '2xl'
            if (width >= breakpoints.xl) return 'xl'
            if (width >= breakpoints.lg) return 'lg'
            if (width >= breakpoints.md) return 'md'
            if (width >= breakpoints.sm) return 'sm'
            return 'xs'
        }

        const handleResize = () => setBreakpoint(getBreakpoint())
        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return breakpoint
}

// Hook to check if mobile device
export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < breakpoints.md)
        checkMobile()

        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return isMobile
}

// Hook for touch gestures
export function useSwipeGesture(
    onSwipeLeft?: () => void,
    onSwipeRight?: () => void,
    threshold = 50
) {
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }, [])

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }, [])

    const onTouchEnd = useCallback(() => {
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > threshold
        const isRightSwipe = distance < -threshold

        if (isLeftSwipe && onSwipeLeft) onSwipeLeft()
        if (isRightSwipe && onSwipeRight) onSwipeRight()
    }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight])

    return { onTouchStart, onTouchMove, onTouchEnd }
}

// Hook for pull-to-refresh
export function usePullToRefresh(onRefresh: () => Promise<void>) {
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [pullDistance, setPullDistance] = useState(0)
    const [startY, setStartY] = useState(0)
    const threshold = 80

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        if (window.scrollY === 0) {
            setStartY(e.touches[0].clientY)
        }
    }, [])

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        if (startY === 0 || isRefreshing) return

        const currentY = e.touches[0].clientY
        const distance = Math.max(0, (currentY - startY) * 0.5)
        setPullDistance(Math.min(distance, threshold * 1.5))
    }, [startY, isRefreshing])

    const onTouchEnd = useCallback(async () => {
        if (pullDistance >= threshold && !isRefreshing) {
            setIsRefreshing(true)
            await onRefresh()
            setIsRefreshing(false)
        }
        setPullDistance(0)
        setStartY(0)
    }, [pullDistance, isRefreshing, onRefresh])

    return {
        isRefreshing,
        pullDistance,
        handlers: { onTouchStart, onTouchMove, onTouchEnd }
    }
}

// Hook for safe area detection
export function useSafeArea() {
    const [safeArea, setSafeArea] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    })

    useEffect(() => {
        const computedStyle = getComputedStyle(document.documentElement)
        setSafeArea({
            top: parseInt(computedStyle.getPropertyValue('--sat') || '0'),
            bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0'),
            left: parseInt(computedStyle.getPropertyValue('--sal') || '0'),
            right: parseInt(computedStyle.getPropertyValue('--sar') || '0'),
        })
    }, [])

    return safeArea
}

// Haptic feedback (for supported devices)
export function useHaptic() {
    const trigger = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
        if ('vibrate' in navigator) {
            const patterns = {
                light: [10],
                medium: [20],
                heavy: [30, 10, 30]
            }
            navigator.vibrate(patterns[type])
        }
    }, [])

    return { trigger }
}

// Viewport height fix for mobile browsers
export function useVH() {
    useEffect(() => {
        const setVH = () => {
            const vh = window.innerHeight * 0.01
            document.documentElement.style.setProperty('--vh', `${vh}px`)
        }

        setVH()
        window.addEventListener('resize', setVH)
        return () => window.removeEventListener('resize', setVH)
    }, [])
}
