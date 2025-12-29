'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Briefcase, MapPin, DollarSign, Clock, Users, FileText,
    ChevronLeft, ChevronRight, Check, Eye, Edit, Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

const steps = [
    { id: 1, title: 'Basics', icon: Briefcase },
    { id: 2, title: 'Details', icon: FileText },
    { id: 3, title: 'Requirements', icon: Users },
    { id: 4, title: 'Compensation', icon: DollarSign },
    { id: 5, title: 'Preview', icon: Eye },
]

const jobTypes = ['full_time', 'part_time', 'contract', 'internship', 'freelance']
const experienceLevels = ['entry', 'mid', 'senior', 'lead', 'executive']

export default function PostJobPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        jobType: 'full_time',
        remote: false,
        description: '',
        responsibilities: '',
        requirements: '',
        skills: [] as string[],
        experienceLevel: 'mid',
        salaryMin: '',
        salaryMax: '',
        salaryCurrency: 'USD',
        benefits: '',
        applicationDeadline: '',
        applicationEmail: '',
        applicationUrl: ''
    })
    const [skillInput, setSkillInput] = useState('')

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const addSkill = () => {
        if (skillInput && !formData.skills.includes(skillInput)) {
            handleChange('skills', [...formData.skills, skillInput])
            setSkillInput('')
        }
    }

    const removeSkill = (skill: string) => {
        handleChange('skills', formData.skills.filter(s => s !== skill))
    }

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    const handleSubmit = () => {
        console.log('Submitting job:', formData)
        alert('Job posted successfully!')
    }

    const formatJobType = (type: string) => {
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    return (
        <div className="min-h-screen bg-background py-6 sm:py-10">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Post a New Job</h1>
                    <p className="text-muted-foreground">Find the perfect candidate for your team</p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        {/* Progress Steps */}
                        <div className="mb-8 overflow-x-auto pb-2">
                            <div className="flex justify-between min-w-[400px] relative">
                                <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
                                <div
                                    className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                                />

                                {steps.map((step) => (
                                    <button
                                        key={step.id}
                                        onClick={() => setCurrentStep(step.id)}
                                        className="relative flex flex-col items-center"
                                    >
                                        <div
                                            className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center transition-all z-10",
                                                currentStep >= step.id
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {currentStep > step.id ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <step.icon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <span className={cn(
                                            "text-xs mt-2 font-medium",
                                            currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                                        )}>
                                            {step.title}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* Step 1: Basics */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <GlassCard className="!p-6 sm:!p-8">
                                        <h2 className="text-xl font-bold mb-6">Basic Information</h2>

                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="title">Job Title *</Label>
                                                <Input
                                                    id="title"
                                                    value={formData.title}
                                                    onChange={(e) => handleChange('title', e.target.value)}
                                                    className="mt-1.5"
                                                    placeholder="e.g. Senior Frontend Developer"
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="location">Location *</Label>
                                                <div className="relative mt-1.5">
                                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                    <Input
                                                        id="location"
                                                        value={formData.location}
                                                        onChange={(e) => handleChange('location', e.target.value)}
                                                        className="pl-10"
                                                        placeholder="e.g. Lagos, Nigeria"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label>Job Type *</Label>
                                                <div className="flex flex-wrap gap-2 mt-1.5">
                                                    {jobTypes.map((type) => (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            onClick={() => handleChange('jobType', type)}
                                                            className={cn(
                                                                "px-4 py-2 rounded-lg border transition",
                                                                formData.jobType === type
                                                                    ? "bg-primary text-primary-foreground border-primary"
                                                                    : "border-input hover:border-primary/50"
                                                            )}
                                                        >
                                                            {formatJobType(type)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.remote}
                                                    onChange={(e) => handleChange('remote', e.target.checked)}
                                                    className="rounded"
                                                />
                                                <span>This is a remote position</span>
                                            </label>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            )}

                            {/* Step 2: Details */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <GlassCard className="!p-6 sm:!p-8">
                                        <h2 className="text-xl font-bold mb-6">Job Details</h2>

                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="description">Job Description *</Label>
                                                <textarea
                                                    id="description"
                                                    value={formData.description}
                                                    onChange={(e) => handleChange('description', e.target.value)}
                                                    className="mt-1.5 w-full min-h-[150px] rounded-lg border border-input bg-background px-3 py-2"
                                                    placeholder="Describe the role, team, and what the ideal candidate will be doing..."
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="responsibilities">Key Responsibilities</Label>
                                                <textarea
                                                    id="responsibilities"
                                                    value={formData.responsibilities}
                                                    onChange={(e) => handleChange('responsibilities', e.target.value)}
                                                    className="mt-1.5 w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2"
                                                    placeholder="Enter each responsibility on a new line..."
                                                />
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            )}

                            {/* Step 3: Requirements */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <GlassCard className="!p-6 sm:!p-8">
                                        <h2 className="text-xl font-bold mb-6">Requirements & Skills</h2>

                                        <div className="space-y-4">
                                            <div>
                                                <Label>Experience Level *</Label>
                                                <div className="flex flex-wrap gap-2 mt-1.5">
                                                    {experienceLevels.map((level) => (
                                                        <button
                                                            key={level}
                                                            type="button"
                                                            onClick={() => handleChange('experienceLevel', level)}
                                                            className={cn(
                                                                "px-4 py-2 rounded-lg border transition capitalize",
                                                                formData.experienceLevel === level
                                                                    ? "bg-primary text-primary-foreground border-primary"
                                                                    : "border-input hover:border-primary/50"
                                                            )}
                                                        >
                                                            {level}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="requirements">Requirements</Label>
                                                <textarea
                                                    id="requirements"
                                                    value={formData.requirements}
                                                    onChange={(e) => handleChange('requirements', e.target.value)}
                                                    className="mt-1.5 w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2"
                                                    placeholder="Enter each requirement on a new line..."
                                                />
                                            </div>

                                            <div>
                                                <Label>Required Skills</Label>
                                                <div className="flex gap-2 mt-1.5">
                                                    <Input
                                                        value={skillInput}
                                                        onChange={(e) => setSkillInput(e.target.value)}
                                                        placeholder="Add a skill"
                                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                                    />
                                                    <Button type="button" onClick={addSkill}>Add</Button>
                                                </div>
                                                {formData.skills.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {formData.skills.map((skill) => (
                                                            <span
                                                                key={skill}
                                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                                                            >
                                                                {skill}
                                                                <button onClick={() => removeSkill(skill)} className="hover:text-destructive">×</button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            )}

                            {/* Step 4: Compensation */}
                            {currentStep === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <GlassCard className="!p-6 sm:!p-8">
                                        <h2 className="text-xl font-bold mb-6">Compensation & Benefits</h2>

                                        <div className="space-y-4">
                                            <div>
                                                <Label>Salary Range</Label>
                                                <div className="grid grid-cols-3 gap-2 mt-1.5">
                                                    <Input
                                                        type="number"
                                                        value={formData.salaryMin}
                                                        onChange={(e) => handleChange('salaryMin', e.target.value)}
                                                        placeholder="Min"
                                                    />
                                                    <Input
                                                        type="number"
                                                        value={formData.salaryMax}
                                                        onChange={(e) => handleChange('salaryMax', e.target.value)}
                                                        placeholder="Max"
                                                    />
                                                    <select
                                                        value={formData.salaryCurrency}
                                                        onChange={(e) => handleChange('salaryCurrency', e.target.value)}
                                                        className="rounded-lg border border-input bg-background px-3"
                                                    >
                                                        <option value="USD">USD</option>
                                                        <option value="EUR">EUR</option>
                                                        <option value="GBP">GBP</option>
                                                        <option value="NGN">NGN</option>
                                                        <option value="GHS">GHS</option>
                                                        <option value="KES">KES</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="benefits">Benefits</Label>
                                                <textarea
                                                    id="benefits"
                                                    value={formData.benefits}
                                                    onChange={(e) => handleChange('benefits', e.target.value)}
                                                    className="mt-1.5 w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2"
                                                    placeholder="e.g. Health insurance, Remote work, Learning budget..."
                                                />
                                            </div>

                                            <div>
                                                <Label htmlFor="deadline">Application Deadline</Label>
                                                <Input
                                                    id="deadline"
                                                    type="date"
                                                    value={formData.applicationDeadline}
                                                    onChange={(e) => handleChange('applicationDeadline', e.target.value)}
                                                    className="mt-1.5"
                                                />
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            )}

                            {/* Step 5: Preview */}
                            {currentStep === 5 && (
                                <motion.div
                                    key="step5"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <GlassCard className="!p-6 sm:!p-8">
                                        <h2 className="text-xl font-bold mb-6">Preview Your Job Post</h2>

                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-2xl font-bold">{formData.title || 'Job Title'}</h3>
                                                <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {formData.location || 'Location'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Briefcase className="w-4 h-4" />
                                                        {formatJobType(formData.jobType)}
                                                    </span>
                                                    {formData.remote && (
                                                        <span className="px-2 py-0.5 rounded bg-accent/10 text-accent">Remote</span>
                                                    )}
                                                </div>
                                            </div>

                                            {formData.salaryMin && formData.salaryMax && (
                                                <div className="text-lg font-semibold text-accent">
                                                    {formData.salaryCurrency} {formData.salaryMin} - {formData.salaryMax}
                                                </div>
                                            )}

                                            {formData.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.skills.map((skill) => (
                                                        <span key={skill} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {formData.description && (
                                                <div>
                                                    <h4 className="font-semibold mb-2">Description</h4>
                                                    <p className="text-muted-foreground whitespace-pre-line">{formData.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="min-h-12"
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Previous
                            </Button>

                            {currentStep < 5 ? (
                                <Button onClick={nextStep} className="gradient-african text-white min-h-12">
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button onClick={handleSubmit} className="gradient-african text-white min-h-12">
                                    <Send className="w-4 h-4 mr-2" />
                                    Publish Job
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Live Preview Sidebar */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24">
                            <GradientCard>
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    Live Preview
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Title:</span>
                                        <p className="font-medium">{formData.title || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Location:</span>
                                        <p className="font-medium">{formData.location || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Type:</span>
                                        <p className="font-medium">{formatJobType(formData.jobType)}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Remote:</span>
                                        <p className="font-medium">{formData.remote ? 'Yes' : 'No'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Skills:</span>
                                        <p className="font-medium">{formData.skills.join(', ') || '-'}</p>
                                    </div>
                                    {formData.salaryMin && (
                                        <div>
                                            <span className="text-muted-foreground">Salary:</span>
                                            <p className="font-medium text-accent">
                                                {formData.salaryCurrency} {formData.salaryMin} - {formData.salaryMax}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </GradientCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
