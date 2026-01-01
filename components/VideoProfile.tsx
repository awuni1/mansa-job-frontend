'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Video, StopCircle, Play, Pause, RotateCcw,
    Upload, Trash2, Check, Loader2, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface VideoProfileProps {
    existingVideoUrl?: string
    maxDuration?: number // in seconds
    onVideoUploaded?: (url: string) => void
    onVideoDeleted?: () => void
    className?: string
}

export function VideoProfile({
    existingVideoUrl,
    maxDuration = 60,
    onVideoUploaded,
    onVideoDeleted,
    className
}: VideoProfileProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [recordedUrl, setRecordedUrl] = useState<string | null>(existingVideoUrl || null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [countdown, setCountdown] = useState<number | null>(null)
    const [recordingTime, setRecordingTime] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)

    const videoRef = useRef<HTMLVideoElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
            }
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [])

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 1280, height: 720 },
                audio: true
            })
            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.muted = true
                videoRef.current.play()
            }
            setError(null)
        } catch (err) {
            setError('Camera access denied. Please enable camera permissions.')
        }
    }

    const startRecording = async () => {
        await startCamera()

        // Countdown
        for (let i = 3; i > 0; i--) {
            setCountdown(i)
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
        setCountdown(null)

        if (!streamRef.current) return

        chunksRef.current = []
        const mediaRecorder = new MediaRecorder(streamRef.current)
        mediaRecorderRef.current = mediaRecorder

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data)
            }
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' })
            const url = URL.createObjectURL(blob)
            setRecordedUrl(url)
            setRecordedBlob(blob)

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
            }
        }

        mediaRecorder.start()
        setIsRecording(true)
        setRecordingTime(0)

        timerRef.current = setInterval(() => {
            setRecordingTime(prev => {
                if (prev >= maxDuration - 1) {
                    stopRecording()
                    return maxDuration
                }
                return prev + 1
            })
        }, 1000)
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }

    const retake = () => {
        setRecordedUrl(null)
        setRecordedBlob(null)
        setRecordingTime(0)
    }

    const togglePlayback = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleUpload = async () => {
        if (!recordedBlob) return

        setUploading(true)
        setError(null)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setError('Please log in to upload video')
                setUploading(false)
                return
            }

            const formData = new FormData()
            const videoFile = new File([recordedBlob], `video_intro_${Date.now()}.webm`, {
                type: 'video/webm'
            })
            formData.append('video_introduction', videoFile)

            const response = await fetch(`${API_URL}/api/auth/profile/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (response.ok) {
                const data = await response.json()
                onVideoUploaded?.(data.video_introduction)
                setError(null)
            } else {
                const errorData = await response.json()
                setError(errorData.detail || 'Failed to upload video')
            }
        } catch (err: any) {
            console.error('Upload error:', err)
            setError(err.message || 'Failed to upload video. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async () => {
        setUploading(true)
        setError(null)
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setError('Please log in to delete video')
                setUploading(false)
                return
            }

            const response = await fetch(`${API_URL}/api/auth/profile/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    video_introduction: null
                })
            })

            if (response.ok) {
                setRecordedUrl(null)
                setRecordedBlob(null)
                onVideoDeleted?.()
            } else {
                const errorData = await response.json()
                setError(errorData.detail || 'Failed to delete video')
            }
        } catch (err: any) {
            console.error('Delete error:', err)
            setError(err.message || 'Failed to delete video')
        } finally {
            setUploading(false)
        }
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className={className}>
            <GradientCard className="!p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Video className="w-5 h-5 text-secondary" />
                    <h3 className="font-bold">Video Introduction</h3>
                    <span className="text-sm text-muted-foreground">({maxDuration}s max)</span>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {/* Video Preview */}
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src={recordedUrl && !isRecording ? recordedUrl : undefined}
                        playsInline
                        onEnded={() => setIsPlaying(false)}
                    />

                    {/* Countdown Overlay */}
                    {countdown && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <motion.span
                                key={countdown}
                                initial={{ scale: 2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className="text-6xl font-bold text-white"
                            >
                                {countdown}
                            </motion.span>
                        </div>
                    )}

                    {/* Recording Indicator */}
                    {isRecording && (
                        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive text-white text-sm">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            REC {formatTime(recordingTime)}
                        </div>
                    )}

                    {/* Time Remaining */}
                    {isRecording && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 text-white text-sm">
                            {formatTime(maxDuration - recordingTime)} remaining
                        </div>
                    )}

                    {/* Play Button */}
                    {recordedUrl && !isRecording && !isPlaying && (
                        <button
                            onClick={togglePlayback}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                                <Play className="w-8 h-8 text-black ml-1" />
                            </div>
                        </button>
                    )}

                    {/* No Video Placeholder */}
                    {!recordedUrl && !isRecording && !countdown && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                            <Video className="w-12 h-12 mb-2 opacity-50" />
                            <p>Record a 60-second introduction</p>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex flex-wrap gap-3">
                    {!recordedUrl && !isRecording && (
                        <Button
                            onClick={startRecording}
                            className="flex-1 gradient-african text-white"
                        >
                            <Video className="w-4 h-4 mr-2" />
                            Start Recording
                        </Button>
                    )}

                    {isRecording && (
                        <Button
                            onClick={stopRecording}
                            variant="destructive"
                            className="flex-1"
                        >
                            <StopCircle className="w-4 h-4 mr-2" />
                            Stop Recording
                        </Button>
                    )}

                    {recordedUrl && !isRecording && (
                        <>
                            <Button
                                onClick={togglePlayback}
                                variant="outline"
                            >
                                {isPlaying ? (
                                    <>
                                        <Pause className="w-4 h-4 mr-2" />
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 mr-2" />
                                        Play
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={retake}
                                variant="outline"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Retake
                            </Button>
                            <Button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="flex-1 gradient-african text-white"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Save Video
                                    </>
                                )}
                            </Button>
                        </>
                    )}

                    {existingVideoUrl && (
                        <Button
                            onClick={handleDelete}
                            variant="outline"
                            className="text-destructive"
                            disabled={uploading}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    )}
                </div>

                {/* Tips */}
                <div className="mt-4 p-4 rounded-lg bg-muted/50 text-sm">
                    <p className="font-medium mb-2">Tips for a great video:</p>
                    <ul className="text-muted-foreground space-y-1">
                        <li>• Good lighting - face a window or light source</li>
                        <li>• Clean background - keep it professional</li>
                        <li>• Speak clearly and smile</li>
                        <li>• Briefly introduce yourself and your strengths</li>
                    </ul>
                </div>
            </GradientCard>
        </div>
    )
}
