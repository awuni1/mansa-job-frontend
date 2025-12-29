'use client'

import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X, MapPin, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { JobCard3D, JobCard3DSkeleton } from '@/components/JobCard3D';
import { GlassFilterModal, FilterButton } from '@/components/GlassFilterModal';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface Job {
    id: number;
    title: string;
    company: {
        name: string;
        location: string;
        logo: string | null;
    };
    location: string;
    job_type: string;
    salary_range: string;
    created_at: string;
    skills?: string[];
}

const filterPills = [
    { id: 'remote', label: 'Remote', active: false },
    { id: 'full_time', label: 'Full-time', active: false },
    { id: 'tech', label: 'Tech', active: false },
    { id: 'entry', label: 'Entry Level', active: false },
];

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
    const [activePills, setActivePills] = useState<string[]>([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async (query = '', loc = '') => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append('search', query);
            if (loc) params.append('location', loc);

            const res = await api.get(`/jobs/?${params.toString()}`);
            setJobs(res.data.results || res.data);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
            // Mock data for demo
            setJobs([
                {
                    id: 1,
                    title: "Senior Frontend Developer",
                    company: { name: "Andela", location: "Lagos", logo: null },
                    location: "Remote",
                    job_type: "full_time",
                    salary_range: "$80K - $120K",
                    created_at: new Date().toISOString(),
                    skills: ["React", "TypeScript", "Next.js"]
                },
                {
                    id: 2,
                    title: "Product Manager",
                    company: { name: "Flutterwave", location: "Lagos", logo: null },
                    location: "Lagos, Nigeria",
                    job_type: "full_time",
                    salary_range: "$70K - $100K",
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                    skills: ["Agile", "Product Strategy"]
                },
                {
                    id: 3,
                    title: "DevOps Engineer",
                    company: { name: "Paystack", location: "Accra", logo: null },
                    location: "Accra, Ghana",
                    job_type: "full_time",
                    salary_range: "$60K - $90K",
                    created_at: new Date(Date.now() - 172800000).toISOString(),
                    skills: ["AWS", "Docker", "Kubernetes"]
                },
                {
                    id: 4,
                    title: "Backend Engineer",
                    company: { name: "Jumia", location: "Cairo", logo: null },
                    location: "Cairo, Egypt",
                    job_type: "full_time",
                    salary_range: "$50K - $80K",
                    created_at: new Date(Date.now() - 259200000).toISOString(),
                    skills: ["Python", "Django", "PostgreSQL"]
                },
                {
                    id: 5,
                    title: "UI/UX Designer",
                    company: { name: "Safaricom", location: "Nairobi", logo: null },
                    location: "Nairobi, Kenya",
                    job_type: "full_time",
                    salary_range: "$45K - $70K",
                    created_at: new Date(Date.now() - 345600000).toISOString(),
                    skills: ["Figma", "User Research", "Prototyping"]
                },
                {
                    id: 6,
                    title: "Data Scientist",
                    company: { name: "MTN", location: "Johannesburg", logo: null },
                    location: "Johannesburg, SA",
                    job_type: "full_time",
                    salary_range: "$70K - $100K",
                    created_at: new Date(Date.now() - 432000000).toISOString(),
                    skills: ["Python", "Machine Learning", "SQL"]
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchJobs(search, location);
    };

    const togglePill = (pillId: string) => {
        setActivePills(prev =>
            prev.includes(pillId)
                ? prev.filter(id => id !== pillId)
                : [...prev, pillId]
        );
    };

    const handleApplyFilters = (filters: Record<string, string[]>) => {
        setActiveFilters(filters);
        // Apply filters to job fetch
        fetchJobs(search, location);
    };

    const getActiveFilterCount = () => {
        return Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0) + activePills.length;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/5 to-transparent pt-6 pb-4 sm:pt-10 sm:pb-6">
                <div className="container mx-auto px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl sm:text-3xl font-bold mb-2"
                    >
                        Find Your Next Role
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground"
                    >
                        {jobs.length > 0 ? `${jobs.length} opportunities available` : 'Searching for jobs...'}
                    </motion.p>
                </div>
            </div>

            {/* Search Bar - Sticky */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 py-3">
                <div className="container mx-auto px-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="flex-1 flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="Job title or keyword"
                                    className="pl-10 min-h-12 bg-muted/50"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="relative flex-1 hidden sm:block">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="Location"
                                    className="pl-10 min-h-12 bg-muted/50"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="gradient-african text-white min-h-12 px-6 hidden sm:flex">
                            Search
                        </Button>
                        <Button type="submit" className="gradient-african text-white min-h-12 min-w-12 sm:hidden">
                            <Search className="w-5 h-5" />
                        </Button>
                    </form>

                    {/* Filter Pills - Mobile scrollable */}
                    <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full border transition whitespace-nowrap touch-target",
                                getActiveFilterCount() > 0
                                    ? "bg-primary/10 border-primary/30 text-primary"
                                    : "bg-muted border-transparent hover:border-border"
                            )}
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                            {getActiveFilterCount() > 0 && (
                                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                    {getActiveFilterCount()}
                                </span>
                            )}
                        </button>

                        {filterPills.map((pill) => (
                            <button
                                key={pill.id}
                                onClick={() => togglePill(pill.id)}
                                className={cn(
                                    "px-4 py-2 rounded-full border transition whitespace-nowrap touch-target",
                                    activePills.includes(pill.id)
                                        ? "bg-primary/10 border-primary/30 text-primary"
                                        : "bg-muted border-transparent hover:border-border"
                                )}
                            >
                                {pill.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-8">
                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-32">
                            <GlassCard className="!p-4">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filters
                                </h3>

                                {/* Location Filter */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium mb-2 block">Location</label>
                                    <div className="space-y-2">
                                        {['Remote', 'Lagos, Nigeria', 'Accra, Ghana', 'Nairobi, Kenya', 'Cape Town, SA'].map((loc) => (
                                            <label key={loc} className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" className="rounded border-border" />
                                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition">{loc}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Job Type Filter */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium mb-2 block">Job Type</label>
                                    <div className="space-y-2">
                                        {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" className="rounded border-border" />
                                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Experience Level */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium mb-2 block">Experience Level</label>
                                    <div className="space-y-2">
                                        {['Entry Level', 'Mid Level', 'Senior', 'Lead/Manager'].map((level) => (
                                            <label key={level} className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" className="rounded border-border" />
                                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition">{level}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Button variant="outline" className="w-full" onClick={() => { }}>
                                    Clear All
                                </Button>
                            </GlassCard>
                        </div>
                    </aside>

                    {/* Job Listings */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <JobCard3DSkeleton key={i} />
                                ))}
                            </div>
                        ) : jobs.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20"
                            >
                                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                    <Briefcase className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                                <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                                <Button onClick={() => { setSearch(''); setLocation(''); fetchJobs(); }}>
                                    Clear Search
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="grid gap-4 sm:gap-6 md:grid-cols-2"
                            >
                                {jobs.map((job) => (
                                    <motion.div key={job.id} variants={itemVariants}>
                                        <JobCard3D job={job} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* Load More */}
                        {jobs.length > 0 && !loading && (
                            <div className="text-center mt-10">
                                <Button variant="outline" size="lg" className="min-h-12">
                                    Load More Jobs
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Button */}
            <FilterButton
                onClick={() => setIsFilterOpen(true)}
                activeCount={getActiveFilterCount()}
            />

            {/* Filter Modal */}
            <GlassFilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={handleApplyFilters}
                filters={activeFilters}
            />
        </div>
    );
}
