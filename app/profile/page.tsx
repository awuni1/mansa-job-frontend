'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Briefcase, Code, FolderOpen,
    ChevronRight, ChevronLeft, Check, Camera,
    Plus, X, Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

const steps = [
    { id: 1, title: 'Personal', icon: User },
    { id: 2, title: 'Experience', icon: Briefcase },
    { id: 3, title: 'Skills', icon: Code },
    { id: 4, title: 'Portfolio', icon: FolderOpen },
]

const skillSuggestions = [
    'React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Django',
    'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Tailwind CSS',
    'Vue.js', 'Angular', 'Java', 'Go', 'Kubernetes', 'CI/CD'
]

export default function ProfilePage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        headline: '',
        bio: '',
        experiences: [{ company: '', role: '', startDate: '', endDate: '', current: false, description: '' }],
        skills: [] as string[],
        portfolio: [{ title: '', url: '', description: '' }]
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleExperienceChange = (index: number, field: string, value: string | boolean) => {
        setFormData(prev => {
            const experiences = [...prev.experiences]
            experiences[index] = { ...experiences[index], [field]: value }
            return { ...prev, experiences }
        })
    }

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experiences: [...prev.experiences, { company: '', role: '', startDate: '', endDate: '', current: false, description: '' }]
        }))
    }

    const removeExperience = (index: number) => {
        setFormData(prev => ({
            ...prev,
            experiences: prev.experiences.filter((_, i) => i !== index)
        }))
    }

    const toggleSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }))
    }

    const handlePortfolioChange = (index: number, field: string, value: string) => {
        setFormData(prev => {
            const portfolio = [...prev.portfolio]
            portfolio[index] = { ...portfolio[index], [field]: value }
            return { ...prev, portfolio }
        })
    }

    const addPortfolioItem = () => {
        setFormData(prev => ({
            ...prev,
            portfolio: [...prev.portfolio, { title: '', url: '', description: '' }]
        }))
    }

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

    const handleSave = () => {
        console.log('Saving profile:', formData)
        alert('Profile saved successfully!')
    }

    return (
        <div className="min-h-screen bg-background py-6 sm:py-10">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Complete Your Profile</h1>
                    <p className="text-muted-foreground">Stand out to employers with a complete profile</p>
                </motion.div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex justify-between relative">
                        {/* Progress line */}
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
                                    "text-xs mt-2 font-medium hidden sm:block",
                                    currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {step.title}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <AnimatePresence mode="wait">
                    {/* Step 1: Personal */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <GlassCard className="!p-6 sm:!p-8">
                                <h2 className="text-xl font-bold mb-6">Personal Information</h2>

                                {/* Avatar Upload */}
                                <div className="flex justify-center mb-8">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full gradient-african flex items-center justify-center">
                                            <User className="w-10 h-10 text-white" />
                                        </div>
                                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow-lg">
                                            <Camera className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            className="mt-1.5"
                                            placeholder="Kofi"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            className="mt-1.5"
                                            placeholder="Mensah"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="mt-1.5"
                                            placeholder="kofi@example.com"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="mt-1.5"
                                            placeholder="+233 20 123 4567"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            className="mt-1.5"
                                            placeholder="Accra, Ghana"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="headline">Professional Headline</Label>
                                        <Input
                                            id="headline"
                                            value={formData.headline}
                                            onChange={(e) => handleInputChange('headline', e.target.value)}
                                            className="mt-1.5"
                                            placeholder="Senior Frontend Developer | React & TypeScript Expert"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <textarea
                                            id="bio"
                                            value={formData.bio}
                                            onChange={(e) => handleInputChange('bio', e.target.value)}
                                            className="mt-1.5 w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                            placeholder="Brief description about yourself..."
                                        />
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* Step 2: Experience */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <GlassCard className="!p-6 sm:!p-8">
                                <h2 className="text-xl font-bold mb-6">Work Experience</h2>

                                <div className="space-y-6">
                                    {formData.experiences.map((exp, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-muted/50 relative">
                                            {formData.experiences.length > 1 && (
                                                <button
                                                    onClick={() => removeExperience(index)}
                                                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-destructive/10 text-destructive"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}

                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Company</Label>
                                                    <Input
                                                        value={exp.company}
                                                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                                        className="mt-1.5"
                                                        placeholder="Andela"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Role</Label>
                                                    <Input
                                                        value={exp.role}
                                                        onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                                                        className="mt-1.5"
                                                        placeholder="Senior Developer"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Start Date</Label>
                                                    <Input
                                                        type="month"
                                                        value={exp.startDate}
                                                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                                                        className="mt-1.5"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>End Date</Label>
                                                    <Input
                                                        type="month"
                                                        value={exp.endDate}
                                                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                                                        className="mt-1.5"
                                                        disabled={exp.current}
                                                    />
                                                    <label className="flex items-center gap-2 mt-2 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={exp.current}
                                                            onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                                                            className="rounded"
                                                        />
                                                        I currently work here
                                                    </label>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <Label>Description</Label>
                                                    <textarea
                                                        value={exp.description}
                                                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                                        className="mt-1.5 w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                                        placeholder="Key responsibilities and achievements..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button variant="outline" className="w-full mt-4" onClick={addExperience}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Experience
                                </Button>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* Step 3: Skills */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <GlassCard className="!p-6 sm:!p-8">
                                <h2 className="text-xl font-bold mb-2">Skills</h2>
                                <p className="text-muted-foreground text-sm mb-6">Select your top skills to showcase to employers</p>

                                {/* Selected Skills */}
                                {formData.skills.length > 0 && (
                                    <div className="mb-6">
                                        <Label className="mb-2 block">Selected Skills ({formData.skills.length})</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.skills.map((skill) => (
                                                <motion.button
                                                    key={skill}
                                                    onClick={() => toggleSkill(skill)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium"
                                                    layoutId={`skill-${skill}`}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {skill}
                                                    <X className="w-3 h-3" />
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Suggested Skills */}
                                <div>
                                    <Label className="mb-2 block">Suggested Skills</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {skillSuggestions.filter(s => !formData.skills.includes(s)).map((skill) => (
                                            <motion.button
                                                key={skill}
                                                onClick={() => toggleSkill(skill)}
                                                className="px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-sm font-medium transition"
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {skill}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Skill Input */}
                                <div className="mt-6">
                                    <Label htmlFor="customSkill">Add Custom Skill</Label>
                                    <div className="flex gap-2 mt-1.5">
                                        <Input
                                            id="customSkill"
                                            placeholder="Enter a skill..."
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && e.currentTarget.value) {
                                                    toggleSkill(e.currentTarget.value)
                                                    e.currentTarget.value = ''
                                                }
                                            }}
                                        />
                                        <Button variant="outline">Add</Button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* Step 4: Portfolio */}
                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <GlassCard className="!p-6 sm:!p-8">
                                <h2 className="text-xl font-bold mb-2">Portfolio</h2>
                                <p className="text-muted-foreground text-sm mb-6">Showcase your best work to potential employers</p>

                                <div className="space-y-4">
                                    {formData.portfolio.map((item, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-muted/50">
                                            <div className="grid gap-4">
                                                <div>
                                                    <Label>Project Title</Label>
                                                    <Input
                                                        value={item.title}
                                                        onChange={(e) => handlePortfolioChange(index, 'title', e.target.value)}
                                                        className="mt-1.5"
                                                        placeholder="E-commerce Platform"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>URL</Label>
                                                    <Input
                                                        value={item.url}
                                                        onChange={(e) => handlePortfolioChange(index, 'url', e.target.value)}
                                                        className="mt-1.5"
                                                        placeholder="https://project.com"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Description</Label>
                                                    <textarea
                                                        value={item.description}
                                                        onChange={(e) => handlePortfolioChange(index, 'description', e.target.value)}
                                                        className="mt-1.5 w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                                        placeholder="Brief description of the project..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button variant="outline" className="w-full mt-4" onClick={addPortfolioItem}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Project
                                </Button>
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

                    {currentStep < 4 ? (
                        <Button onClick={nextStep} className="gradient-african text-white min-h-12">
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleSave} className="gradient-african text-white min-h-12">
                            <Save className="w-4 h-4 mr-2" />
                            Save Profile
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
