'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
    Search, MapPin, Users, Building2, Star,
    Filter, ChevronRight, Briefcase, Globe
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { Skeleton } from '@/components/ui/SkeletonLoader'
import { cn } from '@/lib/utils'
import api from '@/lib/api'

interface Company {
    id: number
    name: string
    slug: string
    logo: string | null
    location: string
    description: string
    industry?: string
    size?: string
    website?: string
    is_verified: boolean
    open_jobs?: number
    rating?: number
}

const industries = [
    'All Industries',
    'Technology',
    'Fintech',
    'E-commerce',
    'Telecom',
    'Healthcare',
    'Education',
    'Finance',
    'Logistics',
]

const companySizes = [
    'All Sizes',
    '1-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+',
]

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selectedIndustry, setSelectedIndustry] = useState('All Industries')
    const [selectedSize, setSelectedSize] = useState('All Sizes')

    useEffect(() => {
        fetchCompanies()
    }, [])

    const fetchCompanies = async () => {
        setLoading(true)
        try {
            const res = await api.get('/companies/')
            setCompanies(res.data.results || res.data)
        } catch (error) {
            console.error('Failed to fetch companies', error)
            // Mock data for demo/fallback
            setCompanies([
                {
                    id: 1,
                    name: 'Andela',
                    slug: 'andela',
                    logo: null,
                    location: 'Lagos, Nigeria',
                    description: 'Connecting brilliance with opportunity. Building distributed engineering teams with Africa\'s top talent.',
                    industry: 'Technology',
                    size: '1000+',
                    website: 'https://andela.com',
                    is_verified: true,
                    open_jobs: 45,
                    rating: 4.5
                },
                {
                    id: 2,
                    name: 'Flutterwave',
                    slug: 'flutterwave',
                    logo: null,
                    location: 'Lagos, Nigeria',
                    description: 'Making it easier and cheaper for businesses across Africa to make and accept payments.',
                    industry: 'Fintech',
                    size: '501-1000',
                    website: 'https://flutterwave.com',
                    is_verified: true,
                    open_jobs: 32,
                    rating: 4.3
                },
                {
                    id: 3,
                    name: 'Paystack',
                    slug: 'paystack',
                    logo: null,
                    location: 'Lagos, Nigeria',
                    description: 'Modern online and offline payments for Africa. Now part of Stripe.',
                    industry: 'Fintech',
                    size: '201-500',
                    website: 'https://paystack.com',
                    is_verified: true,
                    open_jobs: 28,
                    rating: 4.6
                },
                {
                    id: 4,
                    name: 'Jumia',
                    slug: 'jumia',
                    logo: null,
                    location: 'Lagos, Nigeria',
                    description: 'Africa\'s leading e-commerce platform. Shop for everything from electronics to fashion.',
                    industry: 'E-commerce',
                    size: '1000+',
                    website: 'https://jumia.com',
                    is_verified: true,
                    open_jobs: 56,
                    rating: 3.9
                },
                {
                    id: 5,
                    name: 'MTN',
                    slug: 'mtn',
                    logo: null,
                    location: 'Johannesburg, South Africa',
                    description: 'Africa\'s largest mobile network operator, connecting people across the continent.',
                    industry: 'Telecom',
                    size: '1000+',
                    website: 'https://mtn.com',
                    is_verified: true,
                    open_jobs: 89,
                    rating: 4.0
                },
                {
                    id: 6,
                    name: 'Safaricom',
                    slug: 'safaricom',
                    logo: null,
                    location: 'Nairobi, Kenya',
                    description: 'Kenya\'s leading telecommunications company. Home of M-Pesa.',
                    industry: 'Telecom',
                    size: '1000+',
                    website: 'https://safaricom.co.ke',
                    is_verified: true,
                    open_jobs: 67,
                    rating: 4.2
                },
                {
                    id: 7,
                    name: 'Interswitch',
                    slug: 'interswitch',
                    logo: null,
                    location: 'Lagos, Nigeria',
                    description: 'Integrated payments and digital commerce platform driving the transformation of Africa.',
                    industry: 'Fintech',
                    size: '501-1000',
                    website: 'https://interswitchgroup.com',
                    is_verified: true,
                    open_jobs: 23,
                    rating: 4.1
                },
                {
                    id: 8,
                    name: 'Chipper Cash',
                    slug: 'chipper-cash',
                    logo: null,
                    location: 'San Francisco, USA',
                    description: 'Free cross-border payments across Africa. Send and receive money instantly.',
                    industry: 'Fintech',
                    size: '201-500',
                    website: 'https://chippercash.com',
                    is_verified: true,
                    open_jobs: 18,
                    rating: 4.4
                },
            ])
        } finally {
            setLoading(false)
        }
    }

    const filteredCompanies = companies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase()) ||
            company.description.toLowerCase().includes(search.toLowerCase()) ||
            company.location.toLowerCase().includes(search.toLowerCase())
        const matchesIndustry = selectedIndustry === 'All Industries' || company.industry === selectedIndustry
        const matchesSize = selectedSize === 'All Sizes' || company.size === selectedSize
        return matchesSearch && matchesIndustry && matchesSize
    })

    const CompanySkeleton = () => (
        <GlassCard className="!p-6">
            <div className="flex gap-4">
                <Skeleton className="w-16 h-16 rounded-xl" />
                <div className="flex-1">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
        </GlassCard>
    )

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-primary/10 via-background to-background pt-8 pb-12">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto mb-8"
                    >
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                            Discover Top Companies in <span className="gradient-african-text">Africa</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Explore leading companies across the continent and find your next career opportunity
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl mx-auto"
                    >
                        <GlassCard className="!p-2">
                            <div className="flex items-center gap-2">
                                <Search className="w-5 h-5 text-muted-foreground ml-3" />
                                <Input
                                    placeholder="Search companies by name, industry, or location..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border-0 bg-transparent focus-visible:ring-0"
                                />
                                <Button className="gradient-african text-white">
                                    Search
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-3 mb-8"
                >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Filter className="w-4 h-4" />
                        <span>Filters:</span>
                    </div>
                    
                    {/* Industry Filter */}
                    <div className="flex flex-wrap gap-2">
                        {industries.map((industry) => (
                            <button
                                key={industry}
                                onClick={() => setSelectedIndustry(industry)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-sm font-medium transition",
                                    selectedIndustry === industry
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-muted/80"
                                )}
                            >
                                {industry}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between mb-6"
                >
                    <p className="text-muted-foreground">
                        Showing <span className="font-semibold text-foreground">{filteredCompanies.length}</span> companies
                    </p>
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="bg-muted px-3 py-1.5 rounded-lg text-sm"
                    >
                        {companySizes.map((size) => (
                            <option key={size} value={size}>{size} employees</option>
                        ))}
                    </select>
                </motion.div>

                {/* Companies Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <CompanySkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        {filteredCompanies.map((company, index) => (
                            <motion.div
                                key={company.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link href={`/companies/${company.id}`}>
                                    <GlassCard className="!p-6 hover:border-primary/30 transition-all duration-300 group cursor-pointer h-full">
                                        <div className="flex gap-4">
                                            {/* Logo */}
                                            <div className="w-16 h-16 rounded-xl gradient-african flex items-center justify-center flex-shrink-0">
                                                {company.logo ? (
                                                    <img src={company.logo} alt={company.name} className="w-full h-full rounded-xl object-cover" />
                                                ) : (
                                                    <span className="text-white font-bold text-2xl">
                                                        {company.name.charAt(0)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-lg group-hover:text-primary transition">
                                                            {company.name}
                                                        </h3>
                                                        {company.is_verified && (
                                                            <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-xs font-medium">
                                                                ✓ Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                                </div>

                                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        {company.location}
                                                    </span>
                                                    {company.industry && (
                                                        <span className="flex items-center gap-1">
                                                            <Building2 className="w-3.5 h-3.5" />
                                                            {company.industry}
                                                        </span>
                                                    )}
                                                    {company.size && (
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-3.5 h-3.5" />
                                                            {company.size}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                    {company.description}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        {company.open_jobs !== undefined && (
                                                            <span className="flex items-center gap-1 text-sm font-medium text-primary">
                                                                <Briefcase className="w-4 h-4" />
                                                                {company.open_jobs} open jobs
                                                            </span>
                                                        )}
                                                    </div>
                                                    {company.rating && (
                                                        <span className="flex items-center gap-1 text-sm">
                                                            <Star className="w-4 h-4 fill-secondary text-secondary" />
                                                            {company.rating}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && filteredCompanies.length === 0 && (
                    <div className="text-center py-16">
                        <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No companies found</h3>
                        <p className="text-muted-foreground mb-6">
                            Try adjusting your search or filters
                        </p>
                        <Button onClick={() => { setSearch(''); setSelectedIndustry('All Industries'); setSelectedSize('All Sizes'); }}>
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
