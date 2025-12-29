'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase, Users, Eye, TrendingUp, Plus,
    MoreVertical, Edit, Trash2, Pause, Play,
    ChevronRight, Filter, Search, Download
} from "lucide-react";
import { GlassCard, GradientCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/input";
import { DashboardSkeleton } from "@/components/ui/SkeletonLoader";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock data
const stats = [
    { label: 'Active Jobs', value: 12, change: '+2', icon: Briefcase, color: 'text-primary' },
    { label: 'Total Views', value: 4520, change: '+18%', icon: Eye, color: 'text-secondary' },
    { label: 'Applications', value: 156, change: '+24', icon: Users, color: 'text-accent' },
    { label: 'Hire Rate', value: 34, suffix: '%', change: '+5%', icon: TrendingUp, color: 'text-emerald-500' },
];

const postedJobs = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        location: 'Remote',
        type: 'Full-time',
        applicants: 45,
        views: 890,
        status: 'active',
        posted: '2025-12-15'
    },
    {
        id: 2,
        title: 'Product Manager',
        location: 'Lagos, Nigeria',
        type: 'Full-time',
        applicants: 32,
        views: 567,
        status: 'active',
        posted: '2025-12-18'
    },
    {
        id: 3,
        title: 'DevOps Engineer',
        location: 'Accra, Ghana',
        type: 'Contract',
        applicants: 28,
        views: 445,
        status: 'paused',
        posted: '2025-12-10'
    },
];

const candidates = [
    {
        id: 1,
        name: 'Kofi Mensah',
        role: 'Senior Frontend Developer',
        matchScore: 95,
        appliedDate: '2025-12-28',
        status: 'shortlisted'
    },
    {
        id: 2,
        name: 'Amina Ibrahim',
        role: 'Senior Frontend Developer',
        matchScore: 88,
        appliedDate: '2025-12-27',
        status: 'new'
    },
    {
        id: 3,
        name: 'David Okonkwo',
        role: 'Product Manager',
        matchScore: 92,
        appliedDate: '2025-12-26',
        status: 'interview'
    },
];

export default function EmployerDashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
            } else {
                setUser(user);
            }
            setLoading(false);
        };
        checkUser();
    }, [router, supabase]);

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; color: string }> = {
            active: { label: 'Active', color: 'bg-accent/10 text-accent' },
            paused: { label: 'Paused', color: 'bg-muted text-muted-foreground' },
            closed: { label: 'Closed', color: 'bg-destructive/10 text-destructive' },
            new: { label: 'New', color: 'bg-primary/10 text-primary' },
            shortlisted: { label: 'Shortlisted', color: 'bg-secondary/10 text-secondary' },
            interview: { label: 'Interview', color: 'bg-accent/10 text-accent' },
        };
        const config = statusConfig[status] || statusConfig.active;
        return (
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", config.color)}>
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-10">
                <DashboardSkeleton />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/5 to-transparent pt-6 pb-8">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Employer Dashboard</h1>
                            <p className="text-muted-foreground">
                                Manage your job postings and candidates
                            </p>
                        </div>
                        <Link href="/post-job">
                            <Button className="gradient-african text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Post New Job
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {stats.map((stat) => (
                        <GlassCard key={stat.label} className="!p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium text-accent">{stat.change}</span>
                            </div>
                            <p className="text-2xl font-bold mb-0.5">
                                {stat.value.toLocaleString()}{stat.suffix}
                            </p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </GlassCard>
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Job Postings */}
                    <div className="lg:col-span-2">
                        <GlassCard className="!p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-xl font-bold">Your Job Postings</h2>
                                <div className="flex gap-2">
                                    <div className="relative flex-1 sm:w-48">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search jobs..."
                                            className="pl-9"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="outline" size="icon">
                                        <Filter className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {postedJobs.map((job) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition group"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold truncate">{job.title}</h3>
                                                {getStatusBadge(job.status)}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {job.location} • {job.type}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-6 text-sm">
                                            <div className="text-center">
                                                <p className="font-bold text-primary">{job.applicants}</p>
                                                <p className="text-xs text-muted-foreground">Applicants</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold">{job.views}</p>
                                                <p className="text-xs text-muted-foreground">Views</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                {job.status === 'active' ? (
                                                    <Pause className="w-4 h-4" />
                                                ) : (
                                                    <Play className="w-4 h-4" />
                                                )}
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center mt-6 pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Showing {postedJobs.length} of {postedJobs.length} jobs
                                </p>
                                <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Candidate Shortlist */}
                    <div>
                        <GlassCard className="!p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Top Candidates</h2>
                                <Link href="/dashboard/employer/candidates" className="text-sm text-primary hover:underline">
                                    View All
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {candidates.map((candidate) => (
                                    <div
                                        key={candidate.id}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition cursor-pointer group"
                                    >
                                        <div className="w-10 h-10 rounded-full gradient-african flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold">{candidate.name.charAt(0)}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium truncate">{candidate.name}</p>
                                                {getStatusBadge(candidate.status)}
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">
                                                Applied for {candidate.role}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-accent">{candidate.matchScore}%</p>
                                            <p className="text-xs text-muted-foreground">Match</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button variant="outline" className="w-full mt-4">
                                View All Candidates
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </GlassCard>

                        {/* Quick Actions */}
                        <GradientCard className="mt-6">
                            <h3 className="font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <Link href="/post-job" className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Post New Job
                                    </Button>
                                </Link>
                                <Link href="/companies/edit" className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Company Profile
                                    </Button>
                                </Link>
                            </div>
                        </GradientCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
