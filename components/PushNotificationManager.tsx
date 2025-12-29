'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, Briefcase, MessageSquare, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Notification {
    id: string
    type: 'new_job' | 'application_update' | 'message' | 'review'
    title: string
    body: string
    link?: string
    read: boolean
    createdAt: string
}

interface PushNotificationManagerProps {
    notifications: Notification[]
    onMarkRead?: (id: string) => void
    onMarkAllRead?: () => void
    onClear?: (id: string) => void
    className?: string
}

export function PushNotificationManager({
    notifications,
    onMarkRead,
    onMarkAllRead,
    onClear,
    className
}: PushNotificationManagerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [permission, setPermission] = useState<NotificationPermission>('default')

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission)
        }
    }, [])

    const requestPermission = async () => {
        if ('Notification' in window) {
            const result = await Notification.requestPermission()
            setPermission(result)

            if (result === 'granted') {
                // Register service worker for push notifications
                if ('serviceWorker' in navigator) {
                    try {
                        const registration = await navigator.serviceWorker.register('/sw.js')
                        console.log('Service worker registered:', registration)
                    } catch (error) {
                        console.error('Service worker registration failed:', error)
                    }
                }
            }
        }
    }

    const unreadCount = notifications.filter(n => !n.read).length

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'new_job': return Briefcase
            case 'application_update': return Check
            case 'message': return MessageSquare
            case 'review': return Star
            default: return Bell
        }
    }

    const getIconColor = (type: Notification['type']) => {
        switch (type) {
            case 'new_job': return 'bg-primary/20 text-primary'
            case 'application_update': return 'bg-accent/20 text-accent'
            case 'message': return 'bg-secondary/20 text-secondary'
            case 'review': return 'bg-purple-500/20 text-purple-500'
            default: return 'bg-muted text-muted-foreground'
        }
    }

    const formatTime = (date: string) => {
        const now = new Date()
        const notifDate = new Date(date)
        const diffMs = now.getTime() - notifDate.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        if (diffMins < 1) return 'Just now'
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays < 7) return `${diffDays}d ago`
        return notifDate.toLocaleDateString()
    }

    return (
        <div className={cn("relative", className)}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-muted transition"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-popover border rounded-xl shadow-xl z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="font-semibold">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={onMarkAllRead}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* Permission Banner */}
                            {permission === 'default' && (
                                <div className="p-4 bg-primary/5 border-b">
                                    <p className="text-sm mb-2">
                                        Enable push notifications to never miss an update
                                    </p>
                                    <Button size="sm" onClick={requestPermission}>
                                        Enable Notifications
                                    </Button>
                                </div>
                            )}

                            {/* Notifications List */}
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <Bell className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                        <p>No notifications yet</p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => {
                                        const Icon = getIcon(notification.type)
                                        return (
                                            <div
                                                key={notification.id}
                                                className={cn(
                                                    "flex gap-3 p-4 border-b hover:bg-muted/50 transition cursor-pointer",
                                                    !notification.read && "bg-primary/5"
                                                )}
                                                onClick={() => {
                                                    onMarkRead?.(notification.id)
                                                    if (notification.link) {
                                                        window.location.href = notification.link
                                                    }
                                                }}
                                            >
                                                <div className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                                    getIconColor(notification.type)
                                                )}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn(
                                                        "text-sm line-clamp-1",
                                                        !notification.read && "font-medium"
                                                    )}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {notification.body}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {formatTime(notification.createdAt)}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onClear?.(notification.id)
                                                    }}
                                                    className="p-1 rounded hover:bg-muted transition opacity-0 group-hover:opacity-100"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="p-3 border-t text-center">
                                    <button className="text-sm text-primary hover:underline">
                                        View all notifications
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

// Helper function to send push notification
export function sendPushNotification(title: string, body: string, icon?: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: icon || '/icon-192.png',
            badge: '/badge.png'
        })
    }
}
