'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    MapPin, Briefcase, Clock, DollarSign, Users, Building2,
    Globe, Mail, Share2, Bookmark, ArrowLeft, Check, ExternalLink,
    Calendar, Star
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { JobCard3D, JobCard3DSkeleton } from '@/components/JobCard3D'
import { Skeleton } from '@/components/ui/SkeletonLoader'
import { cn } from '@/lib/utils'

interface JobDetails {
    id: number
    title: string
    company: {
        id: number
        name: string
        logo: string | null
        location: string
        website?: string
        size?: string
        industry?: string
    }
    location: string
    job_type: string
    salary_range: string
    experience_level: string
    created_at: string
    description: string
    requirements: string[]
    responsibilities: string[]
    benefits: string[]
    skills: string[]
    application_deadline?: string
}

// Mock similar jobs
const similarJobs = [
    {
        id: 101,
        title: "Frontend Developer",
        company: { name: "TechCorp", logo: null, location: "Lagos" },
        location: "Remote",
        job_type: "full_time",
        salary_range: "$60K - $90K",
        created_at: new Date().toISOString(),
        skills: ["React", "Vue.js", "CSS"]
    },
    {
        id: 102,
        title: "React Developer",
        company: { name: "StartupXYZ", logo: null, location: "Nairobi" },
        location: "Nairobi, Kenya",
        job_type: "full_time",
        salary_range: "$50K - $80K",
        created_at: new Date().toISOString(),
        skills: ["React", "Node.js"]
    },
    {
        id: 103,
        title: "Full Stack Developer",
        company: { name: "Innovate Inc", logo: null, location: "Accra" },
        location: "Accra, Ghana",
        job_type: "full_time",
        salary_range: "$70K - $100K",
        created_at: new Date().toISOString(),
        skills: ["TypeScript", "Python", "AWS"]
    },
]

export default function JobDetailsPage() {
    const { id } = useParams()
    const [job, setJob] = useState<JobDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSaved, setIsSaved] = useState(false)
    const [isApplying, setIsApplying] = useState(false)

    useEffect(() => {
        // Simulated fetch - replace with actual API call
        const fetchJob = async () => {
            setLoading(true)
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500))

            // Mock data
            setJob({
                id: Number(id),
                title: "Senior Frontend Developer",
                company: {
                    id: 1,
                    name: "Andela",
                    logo: null,
                    location: "Lagos, Nigeria",
                    website: "https://andela.com",
                    size: "1000-5000",
                    industry: "Technology"
                },
                location: "Remote",
                job_type: "full_time",
                salary_range: "$80,000 - $120,000",
                experience_level: "Senior (5+ years)",
                created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
                description: "We are looking for a Senior Frontend Developer to join our team. You will be responsible for building and maintaining user interfaces for our web applications. This is an exciting opportunity to work with cutting-edge technologies and make a real impact on millions of users across Africa.",
                requirements: [
                    "5+ years of experience in frontend development",
                    "Expert-level knowledge of React and TypeScript",
                    "Experience with Next.js and modern state management",
                    "Strong understanding of web performance optimization",
                    "Excellent problem-solving and communication skills",
                    "Bachelor's degree in Computer Science or related field"
                ],
                responsibilities: [
                    "Build and maintain high-quality web applications",
                    "Collaborate with designers and backend engineers",
                    "Write clean, maintainable, and well-documented code",
                    "Mentor junior developers and conduct code reviews",
                    "Participate in technical discussions and architecture decisions",
                    "Stay up-to-date with the latest frontend technologies"
                ],
                benefits: [
                    "Competitive salary with equity options",
                    "Remote-first work culture",
                    "Health insurance coverage",
                    "Learning and development budget",
                    "Flexible working hours",
                    "Annual company retreats"
                ],
                skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "Testing"],
                application_deadline: new Date(Date.now() + 86400000 * 30).toISOString()
            })
            setLoading(false)
        }

        fetchJob()
    }, [id])

    const handleApply = async () => {
        setIsApplying(true)
        // Simulate application
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsApplying(false)
        // Show success message or redirect
        alert('Application submitted successfully!')
    }

    const formatJobType = (type: string) => {
        return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }

    const daysAgo = (date: string) => {
        const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
        if (diff === 0) return 'Today'
        if (diff === 1) return 'Yesterday'
        return `${diff} days ago`
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background py-6">
                <div className="container mx-auto px-4">
                    <Skeleton className="h-6 w-32 mb-6" />
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <GlassCard className="!p-6">
                                <div className="flex gap-4 mb-6">
                                    <Skeleton className="w-16 h-16 rounded-xl" />
                                    <div className="flex-1">
                                        <Skeleton className="h-8 w-3/4 mb-2" />
                                        <Skeleton className="h-5 w-1/2" />
                                    </div>
                                </div>
                                <div className="flex gap-4 flex-wrap">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-6 w-32" />
                                </div>
                            </GlassCard>
                            <GlassCard className="!p-6">
                                <Skeleton className="h-6 w-40 mb-4" />
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-4/5" />
                                </div>
                            </GlassCard>
                        </div>
                        <div>
                            <Skeleton className="h-48 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Job not found</h2>
                    <p className="text-muted-foreground mb-4">The job you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/jobs">
                        <Button>Browse Jobs</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/5 to-transparent pt-4 pb-6">
                <div className="container mx-auto px-4">
                    <Link
                        href="/jobs"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Jobs
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-32 lg:pb-10">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <GlassCard className="!p-6">
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-xl gradient-african flex items-center justify-center flex-shrink-0">
                                        {job.company.logo ? (
                                            <img src={job.company.logo} alt={job.company.name} className="w-full h-full rounded-xl object-cover" />
                                        ) : (
                                            <span className="text-white font-bold text-2xl">{job.company.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="text-2xl sm:text-3xl font-bold mb-1">{job.title}</h1>
                                        <Link
                                            href={`/companies/${job.company.id}`}
                                            className="text-lg text-muted-foreground hover:text-primary transition"
                                        >
                                            {job.company.name}
                                        </Link>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-sm">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        {job.location}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-sm">
                                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                                        {formatJobType(job.job_type)}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-sm">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        {job.experience_level}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium">
                                        <DollarSign className="w-4 h-4" />
                                        {job.salary_range}
                                    </span>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <GlassCard className="!p-6">
                                <h2 className="text-xl font-bold mb-4">About this role</h2>
                                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                            </GlassCard>
                        </motion.div>

                        {/* Requirements */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <GlassCard className="!p-6">
                                <h2 className="text-xl font-bold mb-4">Requirements</h2>
                                <ul className="space-y-3">
                                    {job.requirements.map((req, index) => (
                                        <li key={index} className="flex gap-3">
                                            <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        </motion.div>

                        {/* Responsibilities */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <GlassCard className="!p-6">
                                <h2 className="text-xl font-bold mb-4">Responsibilities</h2>
                                <ul className="space-y-3">
                                    {job.responsibilities.map((resp, index) => (
                                        <li key={index} className="flex gap-3">
                                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <span className="text-muted-foreground">{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        </motion.div>

                        {/* Benefits */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <GlassCard className="!p-6">
                                <h2 className="text-xl font-bold mb-4">Benefits</h2>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {job.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                            <Star className="w-5 h-5 text-secondary" />
                                            <span>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Apply Card - Desktop */}
                        <div className="hidden lg:block sticky top-24">
                            <GradientCard>
                                <div className="text-center mb-6">
                                    <p className="text-sm text-muted-foreground mb-1">Posted {daysAgo(job.created_at)}</p>
                                    {job.application_deadline && (
                                        <p className="text-sm text-muted-foreground">
                                            Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    className="w-full gradient-african text-white min-h-14 text-base font-semibold mb-3"
                                    onClick={handleApply}
                                    disabled={isApplying}
                                >
                                    {isApplying ? 'Submitting...' : 'Apply Now'}
                                </Button>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 min-h-12"
                                        onClick={() => setIsSaved(!isSaved)}
                                    >
                                        <Bookmark className={cn("w-4 h-4 mr-2", isSaved && "fill-current text-secondary")} />
                                        {isSaved ? 'Saved' : 'Save'}
                                    </Button>
                                    <Button variant="outline" className="flex-1 min-h-12">
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </Button>
                                </div>
                            </GradientCard>

                            {/* Company Card */}
                            <GlassCard className="!p-5 mt-6">
                                <h3 className="font-semibold mb-4">About {job.company.name}</h3>
                                <div className="space-y-3 text-sm">
                                    {job.company.industry && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Building2 className="w-4 h-4" />
                                            {job.company.industry}
                                        </div>
                                    )}
                                    {job.company.size && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="w-4 h-4" />
                                            {job.company.size} employees
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        {job.company.location}
                                    </div>
                                    {job.company.website && (
                                        <a
                                            href={job.company.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-primary hover:underline"
                                        >
                                            <Globe className="w-4 h-4" />
                                            Visit Website
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                                <Link href={`/companies/${job.company.id}`} className="block mt-4">
                                    <Button variant="outline" className="w-full">
                                        View Company Profile
                                    </Button>
                                </Link>
                            </GlassCard>
                        </div>
                    </div>
                </div>

                {/* Similar Jobs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12"
                >
                    <h2 className="text-2xl font-bold mb-6">Similar Jobs</h2>
                    <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {similarJobs.map((job) => (
                            <JobCard3D key={job.id} job={job} />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Mobile Sticky Apply Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 glass-card border-t lg:hidden safe-bottom z-40">
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="min-h-14 min-w-14"
                        onClick={() => setIsSaved(!isSaved)}
                    >
                        <Bookmark className={cn("w-5 h-5", isSaved && "fill-current text-secondary")} />
                    </Button>
                    <Button
                        className="flex-1 gradient-african text-white min-h-14 text-base font-semibold"
                        onClick={handleApply}
                        disabled={isApplying}
                    >
                        {isApplying ? 'Submitting...' : 'Apply Now'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
