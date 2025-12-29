'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Bell, Plus, Edit, Trash2, ToggleLeft, ToggleRight,
    MapPin, Briefcase, DollarSign, Clock, Search, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

// Mock alerts data
const mockAlerts = [
    {
        id: 1,
        name: 'Frontend Developer in Lagos',
        query: 'Frontend Developer',
        location: 'Lagos, Nigeria',
        jobType: 'Full-time',
        salary: '$50K+',
        frequency: 'daily',
        enabled: true,
        matchCount: 12,
        createdAt: '2025-12-20'
    },
    {
        id: 2,
        name: 'Remote React Jobs',
        query: 'React Developer',
        location: 'Remote',
        jobType: 'Any',
        salary: '$60K+',
        frequency: 'instant',
        enabled: true,
        matchCount: 8,
        createdAt: '2025-12-15'
    },
    {
        id: 3,
        name: 'Product Manager Roles',
        query: 'Product Manager',
        location: 'Any',
        jobType: 'Full-time',
        salary: 'Any',
        frequency: 'weekly',
        enabled: false,
        matchCount: 5,
        createdAt: '2025-12-10'
    },
]

export default function AlertsPage() {
    const [alerts, setAlerts] = useState(mockAlerts)
    const [isCreating, setIsCreating] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [newAlert, setNewAlert] = useState({
        name: '',
        query: '',
        location: '',
        jobType: 'any',
        frequency: 'daily'
    })

    const toggleAlert = (id: number) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
        ))
    }

    const deleteAlert = (id: number) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id))
    }

    const handleCreateAlert = () => {
        if (!newAlert.query) return

        const alert = {
            id: Date.now(),
            name: newAlert.name || `${newAlert.query} in ${newAlert.location || 'Any location'}`,
            query: newAlert.query,
            location: newAlert.location || 'Any',
            jobType: newAlert.jobType,
            salary: 'Any',
            frequency: newAlert.frequency,
            enabled: true,
            matchCount: 0,
            createdAt: new Date().toISOString().split('T')[0]
        }

        setAlerts(prev => [alert, ...prev])
        setNewAlert({ name: '', query: '', location: '', jobType: 'any', frequency: 'daily' })
        setIsCreating(false)
    }

    const getFrequencyLabel = (freq: string) => {
        const labels: Record<string, string> = {
            instant: 'Instant',
            daily: 'Daily digest',
            weekly: 'Weekly digest'
        }
        return labels[freq] || freq
    }

    return (
        <div className="min-h-screen bg-background py-6 sm:py-10">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Job Alerts</h1>
                        <p className="text-muted-foreground">Get notified when new jobs match your criteria</p>
                    </div>
                    <Button
                        onClick={() => setIsCreating(true)}
                        className="gradient-african text-white"
                        disabled={isCreating}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Alert
                    </Button>
                </motion.div>

                {/* Create Alert Form */}
                <AnimatePresence>
                    {isCreating && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 overflow-hidden"
                        >
                            <GradientCard className="!p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold">Create New Alert</h2>
                                    <button onClick={() => setIsCreating(false)} className="p-1 hover:bg-muted rounded">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="text-sm font-medium mb-1.5 block">Search Keywords *</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                placeholder="e.g. Frontend Developer, React, Node.js"
                                                className="pl-10"
                                                value={newAlert.query}
                                                onChange={(e) => setNewAlert(prev => ({ ...prev, query: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                placeholder="Any location"
                                                className="pl-10"
                                                value={newAlert.location}
                                                onChange={(e) => setNewAlert(prev => ({ ...prev, location: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Job Type</label>
                                        <select
                                            className="w-full h-10 rounded-lg border border-input bg-background px-3"
                                            value={newAlert.jobType}
                                            onChange={(e) => setNewAlert(prev => ({ ...prev, jobType: e.target.value }))}
                                        >
                                            <option value="any">Any type</option>
                                            <option value="full_time">Full-time</option>
                                            <option value="part_time">Part-time</option>
                                            <option value="contract">Contract</option>
                                            <option value="remote">Remote</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Alert Frequency</label>
                                        <select
                                            className="w-full h-10 rounded-lg border border-input bg-background px-3"
                                            value={newAlert.frequency}
                                            onChange={(e) => setNewAlert(prev => ({ ...prev, frequency: e.target.value }))}
                                        >
                                            <option value="instant">Instant (as they come)</option>
                                            <option value="daily">Daily digest</option>
                                            <option value="weekly">Weekly digest</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Alert Name (optional)</label>
                                        <Input
                                            placeholder="My job alert"
                                            value={newAlert.name}
                                            onChange={(e) => setNewAlert(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-6">
                                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreateAlert}
                                        disabled={!newAlert.query}
                                        className="gradient-african text-white"
                                    >
                                        Create Alert
                                    </Button>
                                </div>
                            </GradientCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Alerts List */}
                {alerts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16"
                    >
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No alerts yet</h3>
                        <p className="text-muted-foreground mb-6">Create an alert to get notified about new jobs</p>
                        <Button onClick={() => setIsCreating(true)} className="gradient-african text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Alert
                        </Button>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {alerts.map((alert, index) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <GlassCard className={cn(
                                    "!p-5 transition-opacity",
                                    !alert.enabled && "opacity-60"
                                )}>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Bell className={cn(
                                                    "w-5 h-5 flex-shrink-0",
                                                    alert.enabled ? "text-primary" : "text-muted-foreground"
                                                )} />
                                                <h3 className="font-semibold truncate">{alert.name}</h3>
                                            </div>

                                            <div className="flex flex-wrap gap-2 text-sm">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted">
                                                    <Search className="w-3 h-3" />
                                                    {alert.query}
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted">
                                                    <MapPin className="w-3 h-3" />
                                                    {alert.location}
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted">
                                                    <Clock className="w-3 h-3" />
                                                    {getFrequencyLabel(alert.frequency)}
                                                </span>
                                            </div>

                                            {alert.matchCount > 0 && (
                                                <p className="text-sm text-accent mt-2">
                                                    {alert.matchCount} new matches
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleAlert(alert.id)}
                                                className={cn(
                                                    "p-2 rounded-lg transition",
                                                    alert.enabled ? "text-accent" : "text-muted-foreground"
                                                )}
                                                title={alert.enabled ? 'Disable alert' : 'Enable alert'}
                                            >
                                                {alert.enabled ? (
                                                    <ToggleRight className="w-6 h-6" />
                                                ) : (
                                                    <ToggleLeft className="w-6 h-6" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setEditingId(alert.id)}
                                                className="p-2 rounded-lg hover:bg-muted transition"
                                                title="Edit alert"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteAlert(alert.id)}
                                                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition"
                                                title="Delete alert"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
