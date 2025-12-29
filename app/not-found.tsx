'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative z-10 text-center max-w-md">
                {/* Animated 404 */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="mb-8"
                >
                    <h1 className="text-[120px] sm:text-[180px] font-extrabold leading-none gradient-african-text">
                        404
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                        Oops! Page not found
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                        Let&apos;s get you back on track.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/">
                            <Button className="gradient-african text-white min-h-12 px-6 w-full sm:w-auto">
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </Button>
                        </Link>
                        <Link href="/jobs">
                            <Button variant="outline" className="min-h-12 px-6 w-full sm:w-auto">
                                <Search className="w-4 h-4 mr-2" />
                                Browse Jobs
                            </Button>
                        </Link>
                    </div>

                    <button
                        onClick={() => window.history.back()}
                        className="mt-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Go back
                    </button>
                </motion.div>
            </div>
        </div>
    )
}
