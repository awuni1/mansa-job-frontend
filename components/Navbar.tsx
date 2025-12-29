'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Briefcase, Building2, DollarSign, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: '/jobs', label: 'Find Jobs', icon: Briefcase },
    { href: '/companies', label: 'Companies', icon: Building2 },
    { href: '/salaries', label: 'Salaries', icon: DollarSign },
];

export function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
    };

    return (
        <>
            <header
                className={cn(
                    "sticky top-0 z-50 transition-all duration-300 hidden md:block",
                    isScrolled
                        ? "glass-card border-b border-white/10 shadow-lg"
                        : "bg-transparent"
                )}
            >
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl gradient-african flex items-center justify-center">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <span className="font-bold text-xl">
                            Mansa<span className="gradient-african-text">Jobs</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                                        "hover:bg-primary/10 hover:text-primary",
                                        isActive
                                            ? "text-primary bg-primary/10"
                                            : "text-foreground/70"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/post-job">
                                    <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                                        Post a Job
                                    </Button>
                                </Link>
                                <Link href="/dashboard">
                                    <Button className="gradient-african text-white border-0">
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg hover:bg-muted transition"
                                    title="Log out"
                                >
                                    <LogOut className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" className="font-medium">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="gradient-african text-white border-0 font-medium">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button - Hidden on desktop, shown on tablet */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-muted transition touch-target"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Slide-out Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 w-[280px] glass-card z-50 md:hidden"
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-border/50">
                                    <span className="font-bold text-lg">Menu</span>
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="p-2 rounded-lg hover:bg-muted transition"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* User Info */}
                                {user && (
                                    <div className="p-4 border-b border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full gradient-african flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">
                                                    {user.email?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{user.email}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {user.user_metadata?.role || 'Job Seeker'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Links */}
                                <nav className="flex-1 p-4 space-y-1">
                                    {navLinks.map((link) => {
                                        const isActive = pathname === link.href;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition touch-target",
                                                    isActive
                                                        ? "bg-primary/10 text-primary"
                                                        : "hover:bg-muted"
                                                )}
                                            >
                                                <link.icon className="w-5 h-5" />
                                                {link.label}
                                            </Link>
                                        );
                                    })}

                                    {user && (
                                        <>
                                            <div className="h-px bg-border/50 my-4" />
                                            <Link
                                                href="/dashboard"
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium hover:bg-muted transition touch-target"
                                            >
                                                <LayoutDashboard className="w-5 h-5" />
                                                Dashboard
                                            </Link>
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium hover:bg-muted transition touch-target"
                                            >
                                                <UserIcon className="w-5 h-5" />
                                                Profile
                                            </Link>
                                        </>
                                    )}
                                </nav>

                                {/* Footer Actions */}
                                <div className="p-4 space-y-3 border-t border-border/50 safe-bottom">
                                    {user ? (
                                        <>
                                            <Link href="/post-job" className="block">
                                                <Button className="w-full gradient-african text-white min-h-12">
                                                    Post a Job
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                className="w-full min-h-12"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Log Out
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/signup" className="block">
                                                <Button className="w-full gradient-african text-white min-h-12">
                                                    Get Started
                                                </Button>
                                            </Link>
                                            <Link href="/login" className="block">
                                                <Button variant="outline" className="w-full min-h-12">
                                                    Log In
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
