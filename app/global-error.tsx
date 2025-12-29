'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/GlassCard'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global error:', error)
    }, [error])

    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                    <GlassCard className="!p-8 max-w-md text-center">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                        </div>
                        
                        <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
                        <p className="text-muted-foreground mb-6">
                            A critical error occurred. Please try refreshing the page or go back to home.
                        </p>

                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => reset()}
                                className="gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </Button>
                            <Link href="/">
                                <Button className="gap-2">
                                    <Home className="w-4 h-4" />
                                    Go Home
                                </Button>
                            </Link>
                        </div>
                    </GlassCard>
                </div>
            </body>
        </html>
    )
}
