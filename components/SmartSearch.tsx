'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Search, Loader2, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchFilters {
    keywords: string[]
    location: string | null
    jobType: string | null
    experienceLevel: string | null
    salaryMin: number | null
    salaryMax: number | null
    skills: string[]
}

interface SmartSearchProps {
    onSearch: (query: string, filters: SearchFilters) => void
    placeholder?: string
    className?: string
}

export function SmartSearch({ onSearch, placeholder = "Try: 'Remote React jobs in Nigeria paying $60k+'", className }: SmartSearchProps) {
    const [query, setQuery] = useState('')
    const [isListening, setIsListening] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [parsedFilters, setParsedFilters] = useState<SearchFilters | null>(null)
    const [showFilters, setShowFilters] = useState(false)
    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition()
            recognition.continuous = false
            recognition.interimResults = false
            recognition.lang = 'en-US'

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                setQuery(transcript)
                setIsListening(false)
                handleSmartSearch(transcript)
            }

            recognition.onerror = () => {
                setIsListening(false)
            }

            recognition.onend = () => {
                setIsListening(false)
            }

            recognitionRef.current = recognition
        }
    }, [])

    const toggleVoice = () => {
        if (isListening) {
            recognitionRef.current?.stop()
            setIsListening(false)
        } else if (recognitionRef.current) {
            recognitionRef.current.start()
            setIsListening(true)
        }
    }

    const handleSmartSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return

        setIsProcessing(true)

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'parseSearch',
                    data: { query: searchQuery }
                })
            })

            const result = await response.json()
            if (result.success) {
                setParsedFilters(result.data)
                setShowFilters(true)
                onSearch(searchQuery, result.data)
            }
        } catch (error) {
            // Fallback to basic search
            onSearch(searchQuery, {
                keywords: searchQuery.split(' '),
                location: null,
                jobType: null,
                experienceLevel: null,
                salaryMin: null,
                salaryMax: null,
                skills: []
            })
        } finally {
            setIsProcessing(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleSmartSearch(query)
    }

    const clearFilters = () => {
        setParsedFilters(null)
        setShowFilters(false)
        setQuery('')
    }

    const formatJobType = (type: string | null) => {
        if (!type) return null
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    return (
        <div className={className}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="pl-12 pr-24 h-14 text-base rounded-xl bg-background/50 border-2 border-border focus:border-primary"
                    />

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {/* Voice Search Button */}
                        {recognitionRef.current && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={toggleVoice}
                                className={cn(
                                    "rounded-lg transition",
                                    isListening && "bg-destructive/10 text-destructive animate-pulse"
                                )}
                            >
                                {isListening ? (
                                    <MicOff className="w-5 h-5" />
                                ) : (
                                    <Mic className="w-5 h-5" />
                                )}
                            </Button>
                        )}

                        {/* Search Button */}
                        <Button
                            type="submit"
                            disabled={isProcessing}
                            className="gradient-african text-white rounded-lg h-10"
                        >
                            {isProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </form>

            {/* AI Parsed Filters */}
            <AnimatePresence>
                {showFilters && parsedFilters && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 flex flex-wrap items-center gap-2"
                    >
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI detected:
                        </span>

                        {parsedFilters.keywords.length > 0 && (
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                {parsedFilters.keywords.join(', ')}
                            </span>
                        )}

                        {parsedFilters.location && (
                            <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                                📍 {parsedFilters.location}
                            </span>
                        )}

                        {parsedFilters.jobType && (
                            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
                                💼 {formatJobType(parsedFilters.jobType)}
                            </span>
                        )}

                        {parsedFilters.experienceLevel && (
                            <span className="px-3 py-1 rounded-full bg-muted text-foreground text-sm">
                                📊 {parsedFilters.experienceLevel.charAt(0).toUpperCase() + parsedFilters.experienceLevel.slice(1)} level
                            </span>
                        )}

                        {(parsedFilters.salaryMin || parsedFilters.salaryMax) && (
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-sm">
                                💰 ${parsedFilters.salaryMin?.toLocaleString() || '0'}
                                {parsedFilters.salaryMax && ` - $${parsedFilters.salaryMax.toLocaleString()}`}
                            </span>
                        )}

                        {parsedFilters.skills.length > 0 && (
                            <>
                                {parsedFilters.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </>
                        )}

                        <button
                            onClick={clearFilters}
                            className="p-1 rounded-full hover:bg-muted transition"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
