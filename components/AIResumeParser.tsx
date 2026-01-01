'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, X, Edit, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface ParsedResume {
    name: string
    email: string
    phone: string
    location: string
    headline: string
    summary: string
    skills: string[]
    experience: Array<{
        company: string
        role: string
        startDate: string
        endDate: string
        description: string
    }>
    education: Array<{
        institution: string
        degree: string
        field: string
        year: string
    }>
}

interface AIResumeParserProps {
    onParsed?: (data: ParsedResume) => void
    className?: string
}

export function AIResumeParser({ onParsed, className }: AIResumeParserProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [parsing, setParsing] = useState(false)
    const [parsedData, setParsedData] = useState<ParsedResume | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type === 'text/plain')) {
            setFile(droppedFile)
            setError(null)
        } else {
            setError('Please upload a PDF or text file')
        }
    }, [])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setError(null)
        }
    }, [])

    const parseResume = async () => {
        if (!file) return

        setParsing(true)
        setError(null)

        try {
            // Read file content
            const text = await file.text()

            // Get auth token
            const token = localStorage.getItem('auth_token')
            if (!token) {
                setError('Please log in to use AI features')
                setParsing(false)
                return
            }

            // Call new backend AI API
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
            const response = await fetch(`${API_URL}/ai/parse-resume/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    resume_text: text
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const result = await response.json()

            if (result.data) {
                setParsedData(result.data)
                onParsed?.(result.data)
            } else if (result.error) {
                setError(result.error)
            } else {
                setError('Failed to parse resume')
            }
        } catch (err) {
            console.error('Resume parsing error:', err)
            setError('Failed to parse resume. Please try again.')
        } finally {
            setParsing(false)
        }
    }

    const reset = () => {
        setFile(null)
        setParsedData(null)
        setError(null)
    }

    return (
        <div className={className}>
            <AnimatePresence mode="wait">
                {!parsedData ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <GradientCard className="!p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-secondary" />
                                <h3 className="font-bold">AI Resume Parser</h3>
                            </div>

                            {/* Drop Zone */}
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={cn(
                                    "border-2 border-dashed rounded-xl p-8 text-center transition-all",
                                    isDragging
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:border-primary/50",
                                    file && "border-accent bg-accent/10"
                                )}
                            >
                                {file ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <FileText className="w-8 h-8 text-accent" />
                                        <div className="text-left">
                                            <p className="font-medium">{file.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                        <button onClick={reset} className="p-1 hover:bg-muted rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                                        <p className="font-medium mb-1">Drop your resume here</p>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            PDF or TXT files accepted
                                        </p>
                                        <label>
                                            <input
                                                type="file"
                                                accept=".pdf,.txt"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                            <span className="inline-block px-4 py-2 rounded-lg bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 transition">
                                                Browse Files
                                            </span>
                                        </label>
                                    </>
                                )}
                            </div>

                            {error && (
                                <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            {file && (
                                <Button
                                    onClick={parseResume}
                                    disabled={parsing}
                                    className="w-full mt-4 gradient-african text-white"
                                >
                                    {parsing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Analyzing with AI...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Parse Resume
                                        </>
                                    )}
                                </Button>
                            )}
                        </GradientCard>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <GlassCard className="!p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-accent" />
                                    <h3 className="font-bold">Resume Parsed Successfully</h3>
                                </div>
                                <Button variant="outline" size="sm" onClick={reset}>
                                    Parse Another
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-muted-foreground">Name</label>
                                        <p className="font-medium">{parsedData.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground">Email</label>
                                        <p className="font-medium">{parsedData.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground">Phone</label>
                                        <p className="font-medium">{parsedData.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground">Location</label>
                                        <p className="font-medium">{parsedData.location}</p>
                                    </div>
                                </div>

                                {/* Headline */}
                                {parsedData.headline && (
                                    <div>
                                        <label className="text-sm text-muted-foreground">Headline</label>
                                        <p className="font-medium">{parsedData.headline}</p>
                                    </div>
                                )}

                                {/* Skills */}
                                {parsedData.skills.length > 0 && (
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Skills</label>
                                        <div className="flex flex-wrap gap-2">
                                            {parsedData.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Experience */}
                                {parsedData.experience.length > 0 && (
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Experience</label>
                                        <div className="space-y-3">
                                            {parsedData.experience.map((exp, i) => (
                                                <div key={i} className="p-3 rounded-lg bg-muted/50">
                                                    <p className="font-medium">{exp.role}</p>
                                                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {exp.startDate} - {exp.endDate}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {parsedData.education.length > 0 && (
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Education</label>
                                        <div className="space-y-2">
                                            {parsedData.education.map((edu, i) => (
                                                <div key={i} className="p-3 rounded-lg bg-muted/50">
                                                    <p className="font-medium">{edu.degree} in {edu.field}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {edu.institution} ({edu.year})
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button
                                className="w-full mt-6 gradient-african text-white"
                                onClick={() => onParsed?.(parsedData)}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Use This Data
                            </Button>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
