'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    MapPin, Users, Globe, Building2, Calendar,
    Briefcase, ExternalLink, Star, ChevronRight, Linkedin, Twitter
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { JobCard3D } from '@/components/JobCard3D'
import { cn } from '@/lib/utils'

// Mock company data
const mockCompany = {
    id: 1,
    name: 'Andela',
    logo: null,
    tagline: 'Connecting Brilliance with Opportunity',
    description: `Andela is a global talent network that connects companies with vetted, remote engineers in emerging markets. We believe brilliance is evenly distributed, but opportunity is not. Our mission is to unlock human potential at scale.
    
Since 2014, we've connected thousands of engineers with companies around the world, providing access to in-demand technical skills.`,
    industry: 'Technology',
    size: '1000-5000',
    founded: '2014',
    headquarters: 'Lagos, Nigeria',
    website: 'https://andela.com',
    linkedin: 'https://linkedin.com/company/andela',
    twitter: 'https://twitter.com/andaborhood',
    techStack: ['React', 'Python', 'Node.js', 'AWS', 'PostgreSQL', 'Docker'],
    benefits: [
        'Remote-first culture',
        'Competitive salary',
        'Health insurance',
        'Learning budget',
        'Flexible hours',
        'Stock options'
    ],
    stats: {
        employees: 2500,
        openJobs: 45,
        avgRating: 4.5,
        reviews: 234
    }
}

const mockJobs = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        company: { name: "Andela", logo: null, location: "Lagos, Nigeria" },
        location: "Remote",
        job_type: "full_time",
        salary_range: "$80K - $120K",
        created_at: new Date().toISOString(),
        skills: ["React", "TypeScript", "Next.js"]
    },
    {
        id: 2,
        title: "Backend Engineer",
        company: { name: "Andela", logo: null, location: "Lagos, Nigeria" },
        location: "Remote",
        job_type: "full_time",
        salary_range: "$70K - $100K",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        skills: ["Python", "Django", "PostgreSQL"]
    },
    {
        id: 3,
        title: "DevOps Engineer",
        company: { name: "Andela", logo: null, location: "Lagos, Nigeria" },
        location: "Remote",
        job_type: "full_time",
        salary_range: "$75K - $110K",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        skills: ["AWS", "Kubernetes", "Docker"]
    },
]

const teamMembers = [
    { name: 'Christina Sass', role: 'CEO', avatar: 'C' },
    { name: 'Jeremy Johnson', role: 'President', avatar: 'J' },
    { name: 'Seni Sulyman', role: 'VP of Global Operations', avatar: 'S' },
]

const timeline = [
    { year: '2014', event: 'Founded in Lagos, Nigeria' },
    { year: '2016', event: 'Expanded to Kenya and Uganda' },
    { year: '2018', event: 'Launched remote engineering network' },
    { year: '2021', event: 'Reached 2500+ engineers globally' },
    { year: '2023', event: 'Opened Rwanda technology hub' },
]

export default function CompanyProfilePage() {
    const { id } = useParams()
    const company = mockCompany

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Banner */}
            <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary via-primary/80 to-secondary">
                <div className="absolute inset-0 bg-grid-white/10" />
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10 pb-20">
                {/* Company Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <GlassCard className="!p-6 sm:!p-8">
                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* Logo */}
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl gradient-african flex items-center justify-center flex-shrink-0">
                                {company.logo ? (
                                    <img src={company.logo} alt={company.name} className="w-full h-full rounded-2xl object-cover" />
                                ) : (
                                    <span className="text-white font-bold text-4xl sm:text-5xl">{company.name.charAt(0)}</span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold mb-1">{company.name}</h1>
                                        <p className="text-muted-foreground mb-3">{company.tagline}</p>

                                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Building2 className="w-4 h-4" />
                                                {company.industry}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                {company.size} employees
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {company.headquarters}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Founded {company.founded}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" className="w-10 h-10">
                                                <Globe className="w-4 h-4" />
                                            </Button>
                                        </a>
                                        <a href={company.linkedin} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" className="w-10 h-10">
                                                <Linkedin className="w-4 h-4" />
                                            </Button>
                                        </a>
                                        <a href={company.twitter} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon" className="w-10 h-10">
                                                <Twitter className="w-4 h-4" />
                                            </Button>
                                        </a>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t">
                                    <div>
                                        <p className="text-2xl font-bold text-primary">{company.stats.openJobs}</p>
                                        <p className="text-sm text-muted-foreground">Open positions</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{company.stats.employees.toLocaleString()}</p>
                                        <p className="text-sm text-muted-foreground">Employees</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-5 h-5 fill-secondary text-secondary" />
                                                <span className="text-2xl font-bold">{company.stats.avgRating}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{company.stats.reviews} reviews</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6 mt-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <GlassCard className="!p-6">
                                <h2 className="text-xl font-bold mb-4">About {company.name}</h2>
                                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                                    {company.description}
                                </p>
                            </GlassCard>
                        </motion.div>

                        {/* Tech Stack */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <GlassCard className="!p-6">
                                <h2 className="text-xl font-bold mb-4">Tech Stack</h2>
                                <div className="flex flex-wrap gap-2">
                                    {company.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* Open Positions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Open Positions ({mockJobs.length})</h2>
                                <Link href={`/jobs?company=${company.name}`} className="text-sm text-primary hover:underline">
                                    View all
                                </Link>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {mockJobs.map((job) => (
                                    <JobCard3D key={job.id} job={job} />
                                ))}
                            </div>
                        </motion.div>

                        {/* Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <GlassCard className="!p-6">
                                <h2 className="text-xl font-bold mb-6">Company Timeline</h2>
                                <div className="relative">
                                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />
                                    <div className="space-y-6">
                                        {timeline.map((item, index) => (
                                            <div key={item.year} className="flex gap-4 relative">
                                                <div className="w-6 h-6 rounded-full gradient-african flex-shrink-0 z-10" />
                                                <div>
                                                    <p className="font-bold text-primary">{item.year}</p>
                                                    <p className="text-muted-foreground">{item.event}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Benefits */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <GradientCard>
                                <h3 className="font-bold mb-4">Benefits & Perks</h3>
                                <ul className="space-y-2">
                                    {company.benefits.map((benefit) => (
                                        <li key={benefit} className="flex items-center gap-2 text-sm">
                                            <div className="w-2 h-2 rounded-full bg-accent" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </GradientCard>
                        </motion.div>

                        {/* Team */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <GlassCard className="!p-5">
                                <h3 className="font-bold mb-4">Leadership Team</h3>
                                <div className="space-y-3">
                                    {teamMembers.map((member) => (
                                        <div key={member.name} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full gradient-african flex items-center justify-center">
                                                <span className="text-white font-bold">{member.avatar}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{member.name}</p>
                                                <p className="text-xs text-muted-foreground">{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <GlassCard className="!p-5 text-center">
                                <Briefcase className="w-10 h-10 text-primary mx-auto mb-3" />
                                <h3 className="font-bold mb-2">Want to work here?</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Join {company.name} and be part of something amazing.
                                </p>
                                <Link href={`/jobs?company=${company.name}`}>
                                    <Button className="w-full gradient-african text-white">
                                        View All Jobs
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </GlassCard>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
