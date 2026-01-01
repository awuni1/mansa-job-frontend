'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, Briefcase, MapPin, Building2, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'

interface GeneratedJobDescription {
    title: string
    description: string
    responsibilities: string[]
    requirements: string[]
    benefits: string[]
    skills: string[]
}

interface AIJobGeneratorProps {
    onGenerated?: (data: GeneratedJobDescription) => void
    className?: string
}

export function AIJobGenerator({ onGenerated, className }: AIJobGeneratorProps) {
    const [title, setTitle] = useState('')
    const [company, setCompany] = useState('')
    const [location, setLocation] = useState('')
    const [type, setType] = useState('full_time')
    const [requirements, setRequirements] = useState('')
    const [generating, setGenerating] = useState(false)
    const [generatedData, setGeneratedData] = useState<GeneratedJobDescription | null>(null)
    const [error, setError] = useState<string | null>(null)

    const generateDescription = async () => {
        if (!title || !company) {
            setError('Please enter job title and company name')
            return
        }

        setGenerating(true)
        setError(null)

        try {
            // Get auth token
            const token = localStorage.getItem('auth_token')
            if (!token) {
                setError('Please log in to use AI features')
                setGenerating(false)
                return
            }

            // Call new backend AI API
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
            const response = await fetch(`${API_URL}/ai/generate-job-description/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    company,
                    location,
                    type,
                    requirements: requirements.split(',').map(r => r.trim()).filter(Boolean)
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const result = await response.json()

            setGeneratedData(result)
            onGenerated?.(result)
        } catch (err) {
            console.error('Job description generation error:', err)
            setError('Failed to generate description. Please try again.')
        } finally {
            setGenerating(false)
        }
    }

    const reset = () => {
        setGeneratedData(null)
    }

    return (
        <div className={className}>
            {!generatedData ? (
                <GradientCard className="!p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Wand2 className="w-5 h-5 text-secondary" />
                        <h3 className="font-bold">AI Job Description Generator</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="title">Job Title *</Label>
                            <div className="relative mt-1.5">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Senior Frontend Developer"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="company">Company Name *</Label>
                            <div className="relative mt-1.5">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="company"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    placeholder="e.g. TechCorp Africa"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="location">Location</Label>
                            <div className="relative mt-1.5">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g. Lagos, Nigeria or Remote"
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="type">Job Type</Label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full mt-1.5 h-10 rounded-lg border border-input bg-background px-3"
                            >
                                <option value="full_time">Full-time</option>
                                <option value="part_time">Part-time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="requirements">Key Requirements (comma-separated)</Label>
                            <Input
                                id="requirements"
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                placeholder="e.g. React, TypeScript, 3+ years experience"
                                className="mt-1.5"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            onClick={generateDescription}
                            disabled={generating}
                            className="w-full gradient-african text-white"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating with AI...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Description
                                </>
                            )}
                        </Button>
                    </div>
                </GradientCard>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <GlassCard className="!p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-xl">{generatedData.title}</h3>
                            <Button variant="outline" size="sm" onClick={reset}>
                                Generate Another
                            </Button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {generatedData.description}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Responsibilities</h4>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {generatedData.responsibilities.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Requirements</h4>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {generatedData.requirements.map((r, i) => (
                                        <li key={i}>{r}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Benefits</h4>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {generatedData.benefits.map((b, i) => (
                                        <li key={i}>{b}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Required Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {generatedData.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-6 gradient-african text-white"
                            onClick={() => onGenerated?.(generatedData)}
                        >
                            Use This Description
                        </Button>
                    </GlassCard>
                </motion.div>
            )}
        </div>
    )
}
