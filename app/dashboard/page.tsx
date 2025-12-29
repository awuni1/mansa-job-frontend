'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { DashboardSkeleton } from "@/components/ui/SkeletonLoader";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            setUser(user);
            setLoading(false);

            // Redirect based on role
            const role = user.user_metadata?.role;
            if (role === 'EMPLOYER') {
                router.push('/dashboard/employer');
            } else {
                router.push('/dashboard/seeker');
            }
        };
        checkUser();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-10">
                <DashboardSkeleton />
            </div>
        );
    }

    // Fallback UI while redirecting
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <GlassCard className="!p-8 max-w-md">
                    <h2 className="text-xl font-bold mb-4">Select Your Dashboard</h2>
                    <div className="space-y-3">
                        <Link
                            href="/dashboard/seeker"
                            className="flex items-center justify-between p-4 rounded-xl bg-muted hover:bg-primary/10 transition group"
                        >
                            <div>
                                <p className="font-semibold">Job Seeker</p>
                                <p className="text-sm text-muted-foreground">Track applications and find jobs</p>
                            </div>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/dashboard/employer"
                            className="flex items-center justify-between p-4 rounded-xl bg-muted hover:bg-primary/10 transition group"
                        >
                            <div>
                                <p className="font-semibold">Employer</p>
                                <p className="text-sm text-muted-foreground">Manage jobs and candidates</p>
                            </div>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
}
