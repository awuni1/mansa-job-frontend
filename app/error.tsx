'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/GlassCard'
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        // Log the error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Page error:', error)
        }
    }, [error])

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <GlassCard className="!p-8 max-w-md text-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-orange-500" />
                </div>
                
                <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
                <p className="text-muted-foreground mb-6">
                    We had trouble loading this page. This might be temporary, so please try again.
                </p>

                {process.env.NODE_ENV === 'development' && error.message && (
                    <div className="mb-6 p-4 bg-muted rounded-lg text-left overflow-auto max-h-32">
                        <p className="text-xs font-mono text-muted-foreground">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="flex gap-3 justify-center">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </Button>
                    <Button
                        onClick={() => reset()}
                        className="gap-2 gradient-african text-white"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                </div>
            </GlassCard>
        </div>
    )
}
