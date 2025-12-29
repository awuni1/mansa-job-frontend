'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase, FileText, Bookmark, BarChart3, Upload,
    CheckCircle, Clock, XCircle, Eye, TrendingUp,
    Calendar, MapPin, ChevronRight
} from "lucide-react";
import { GlassCard, GradientCard } from "@/components/ui/GlassCard";
import { DashboardSkeleton } from "@/components/ui/SkeletonLoader";
import { cn } from "@/lib/utils";
import Link from "next/link";

const tabs = [
    { id: 'active', label: 'Active', icon: Briefcase },
    { id: 'applied', label: 'Applied', icon: FileText },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

// Mock data
const stats = [
    { label: 'Profile Views', value: 234, change: '+12%', icon: Eye, color: 'text-primary' },
    { label: 'Applications', value: 15, change: '+3', icon: FileText, color: 'text-accent' },
    { label: 'Interviews', value: 4, change: '+1', icon: Calendar, color: 'text-secondary' },
    { label: 'Job Match', value: 89, suffix: '%', icon: TrendingUp, color: 'text-emerald-500' },
];

const applications = [
    {
        id: 1,
        job: 'Senior Frontend Developer',
        company: 'Andela',
        location: 'Remote',
        status: 'in_review',
        appliedDate: '2025-12-27',
        logo: 'A'
    },
    {
        id: 2,
        job: 'Product Manager',
        company: 'Flutterwave',
        location: 'Lagos, Nigeria',
        status: 'interview',
        appliedDate: '2025-12-25',
        logo: 'F'
    },
    {
        id: 3,
        job: 'Full Stack Developer',
        company: 'Paystack',
        location: 'Accra, Ghana',
        status: 'pending',
        appliedDate: '2025-12-20',
        logo: 'P'
    },
];

const savedJobs = [
    {
        id: 101,
        title: 'DevOps Engineer',
        company: 'MTN',
        location: 'Johannesburg, SA',
        salary: '$60K - $90K',
        logo: 'M'
    },
    {
        id: 102,
        title: 'Data Scientist',
        company: 'Safaricom',
        location: 'Nairobi, Kenya',
        salary: '$50K - $80K',
        logo: 'S'
    },
];

export default function SeekerDashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active');
    const [parsing, setParsing] = useState(false);
    const [parsedData, setParsedData] = useState<any>(null);
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

    const handleResumeUpload = async () => {
        setParsing(true);
        setTimeout(() => {
            setParsing(false);
            setParsedData({
                skills: ['React', 'Next.js', 'Python', 'Django', 'TypeScript', 'Node.js'],
                experience: '5 Years',
                education: 'BSc Computer Science'
            });
        }, 2000);
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
            pending: { label: 'Pending', color: 'bg-muted text-muted-foreground', icon: Clock },
            in_review: { label: 'In Review', color: 'bg-primary/10 text-primary', icon: Eye },
            interview: { label: 'Interview', color: 'bg-accent/10 text-accent', icon: Calendar },
            rejected: { label: 'Rejected', color: 'bg-destructive/10 text-destructive', icon: XCircle },
            accepted: { label: 'Accepted', color: 'bg-emerald-500/10 text-emerald-500', icon: CheckCircle },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", config.color)}>
                <config.icon className="w-3 h-3" />
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
                            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Welcome back!</h1>
                            <p className="text-muted-foreground">
                                {user?.email} • <span className="text-primary font-medium">Job Seeker</span>
                            </p>
                        </div>
                        <Link href="/profile">
                            <Button className="gradient-african text-white">
                                Complete Profile
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
                    {stats.map((stat, index) => (
                        <GlassCard key={stat.label} className="!p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className={cn("p-2 rounded-lg bg-muted", stat.color)}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-medium text-accent">{stat.change}</span>
                            </div>
                            <p className="text-2xl font-bold mb-0.5">
                                {stat.value}{stat.suffix}
                            </p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </GlassCard>
                    ))}
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition whitespace-nowrap touch-target",
                                activeTab === tab.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted hover:bg-muted/80"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'active' && (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid lg:grid-cols-2 gap-6"
                        >
                            {/* Resume Parser */}
                            <GlassCard className="!p-6">
                                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    AI Resume Parser
                                </h2>
                                <p className="text-muted-foreground text-sm mb-6">
                                    Upload your resume to automatically extract skills and experience
                                </p>

                                <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition cursor-pointer mb-4">
                                    <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                                    <Button onClick={handleResumeUpload} disabled={parsing} className="min-h-12">
                                        {parsing ? 'Analyzing...' : 'Upload Resume (PDF)'}
                                    </Button>
                                </div>

                                {parsedData && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-accent/5 border border-accent/20 p-4 rounded-xl"
                                    >
                                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-accent">
                                            <CheckCircle className="w-4 h-4" />
                                            Analysis Complete
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-xs font-bold uppercase text-muted-foreground">Skills</span>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {parsedData.skills.map((s: string) => (
                                                        <span key={s} className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-xs font-bold uppercase text-muted-foreground">Experience</span>
                                                    <p className="font-medium">{parsedData.experience}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold uppercase text-muted-foreground">Education</span>
                                                    <p className="font-medium">{parsedData.education}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </GlassCard>

                            {/* Recent Activity */}
                            <GlassCard className="!p-6">
                                <h2 className="text-xl font-bold mb-4">Recent Applications</h2>
                                <div className="space-y-3">
                                    {applications.slice(0, 3).map((app) => (
                                        <Link key={app.id} href={`/jobs/${app.id}`} className="block">
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition group">
                                                <div className="w-10 h-10 rounded-lg gradient-african flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-bold">{app.logo}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate group-hover:text-primary transition">{app.job}</p>
                                                    <p className="text-sm text-muted-foreground">{app.company}</p>
                                                </div>
                                                {getStatusBadge(app.status)}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('applied')}>
                                    View All Applications
                                </Button>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'applied' && (
                        <motion.div
                            key="applied"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <GlassCard className="!p-6">
                                <h2 className="text-xl font-bold mb-4">Your Applications</h2>
                                <div className="space-y-3">
                                    {applications.map((app) => (
                                        <Link key={app.id} href={`/jobs/${app.id}`} className="block">
                                            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition group">
                                                <div className="w-12 h-12 rounded-xl gradient-african flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-bold text-lg">{app.logo}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold truncate group-hover:text-primary transition">{app.job}</p>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <span>{app.company}</span>
                                                        <span>•</span>
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{app.location}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {getStatusBadge(app.status)}
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Applied {new Date(app.appliedDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'saved' && (
                        <motion.div
                            key="saved"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <GlassCard className="!p-6">
                                <h2 className="text-xl font-bold mb-4">Saved Jobs</h2>
                                <div className="space-y-3">
                                    {savedJobs.map((job) => (
                                        <Link key={job.id} href={`/jobs/${job.id}`} className="block">
                                            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition group">
                                                <div className="w-12 h-12 rounded-xl gradient-african flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-bold text-lg">{job.logo}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold truncate group-hover:text-primary transition">{job.title}</p>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <span>{job.company}</span>
                                                        <span>•</span>
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{job.location}</span>
                                                    </div>
                                                </div>
                                                <span className="text-accent font-medium">{job.salary}</span>
                                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <GradientCard>
                                <div className="text-center py-12">
                                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">Analytics Coming Soon</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        Track your profile views, application success rates, and more detailed analytics.
                                    </p>
                                </div>
                            </GradientCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
