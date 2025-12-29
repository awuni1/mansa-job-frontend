'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, Bell, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/jobs', icon: Briefcase, label: 'Jobs' },
    { href: '/alerts', icon: Bell, label: 'Alerts' },
    { href: '/profile', icon: User, label: 'Profile' },
]

export function MobileBottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Glassmorphism background */}
            <div className="glass-card border-t border-white/20 safe-bottom">
                <div className="flex items-center justify-around px-2 py-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href))

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex flex-col items-center justify-center",
                                    "min-w-[64px] min-h-[56px] rounded-2xl",
                                    "transition-all duration-300 touch-target",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="bottomNavIndicator"
                                        className="absolute inset-0 bg-primary/10 rounded-2xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}

                                <item.icon
                                    className={cn(
                                        "w-6 h-6 relative z-10 transition-transform",
                                        isActive && "scale-110"
                                    )}
                                />
                                <span className={cn(
                                    "text-xs mt-1 relative z-10 font-medium",
                                    isActive && "font-semibold"
                                )}>
                                    {item.label}
                                </span>

                                {/* Notification badge example for Alerts */}
                                {item.label === 'Alerts' && (
                                    <span className="absolute top-1 right-3 w-2 h-2 bg-secondary rounded-full" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
