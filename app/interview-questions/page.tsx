'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Search, MessageSquare, ThumbsUp, ChevronDown, Plus,
    Building2, Briefcase, Filter, ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface InterviewQuestion {
    id: string
    question: string
    company: string
    companyLogo?: string
    role: string
    difficulty: 'easy' | 'medium' | 'hard'
    type: 'technical' | 'behavioral' | 'system_design' | 'coding'
    answer?: string
    upvotes: number
    answers: number
    createdAt: string
}

interface InterviewQuestionsPageProps {
    questions: InterviewQuestion[]
    companies: { name: string; count: number }[]
    onSubmitQuestion?: (question: Partial<InterviewQuestion>) => void
    onUpvote?: (questionId: string) => void
    className?: string
}

const difficultyConfig = {
    easy: { label: 'Easy', color: 'bg-accent/20 text-accent' },
    medium: { label: 'Medium', color: 'bg-secondary/20 text-secondary' },
    hard: { label: 'Hard', color: 'bg-destructive/20 text-destructive' }
}

const typeConfig = {
    technical: { label: 'Technical', color: 'bg-blue-500/20 text-blue-600' },
    behavioral: { label: 'Behavioral', color: 'bg-purple-500/20 text-purple-600' },
    system_design: { label: 'System Design', color: 'bg-orange-500/20 text-orange-600' },
    coding: { label: 'Coding', color: 'bg-accent/20 text-accent' }
}

export default function InterviewQuestionsPage() {
    const [search, setSearch] = useState('')
    const [filterCompany, setFilterCompany] = useState<string | null>(null)
    const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null)
    const [filterType, setFilterType] = useState<string | null>(null)
    const [showAnswer, setShowAnswer] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)

    // Mock data
    const questions: InterviewQuestion[] = [
        {
            id: '1',
            question: 'Design a URL shortening service like bit.ly. How would you handle millions of requests per day?',
            company: 'Andela',
            role: 'Senior Software Engineer',
            difficulty: 'hard',
            type: 'system_design',
            answer: 'Key considerations include: 1) Using a hash function to generate short URLs, 2) Database design with proper indexing, 3) Caching layer with Redis, 4) Load balancing and horizontal scaling.',
            upvotes: 145,
            answers: 23,
            createdAt: '2024-01-15'
        },
        {
            id: '2',
            question: 'Tell me about a time when you had to deal with a difficult team member. How did you handle it?',
            company: 'Flutterwave',
            role: 'Product Manager',
            difficulty: 'medium',
            type: 'behavioral',
            answer: 'Use the STAR method: Situation, Task, Action, Result. Focus on communication, empathy, and finding common ground.',
            upvotes: 89,
            answers: 15,
            createdAt: '2024-01-10'
        },
        {
            id: '3',
            question: 'Implement a function that reverses a linked list in O(n) time.',
            company: 'Paystack',
            role: 'Software Engineer',
            difficulty: 'easy',
            type: 'coding',
            answer: 'Iterate through the list, reversing pointers as you go. Use three pointers: prev, current, and next.',
            upvotes: 234,
            answers: 45,
            createdAt: '2024-01-05'
        }
    ]

    const companies = [
        { name: 'Andela', count: 156 },
        { name: 'Flutterwave', count: 98 },
        { name: 'Paystack', count: 87 },
        { name: 'Jumia', count: 65 },
        { name: 'Interswitch', count: 54 }
    ]

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase()) ||
            q.company.toLowerCase().includes(search.toLowerCase())
        const matchesCompany = !filterCompany || q.company === filterCompany
        const matchesDifficulty = !filterDifficulty || q.difficulty === filterDifficulty
        const matchesType = !filterType || q.type === filterType
        return matchesSearch && matchesCompany && matchesDifficulty && matchesType
    })

    const clearFilters = () => {
        setFilterCompany(null)
        setFilterDifficulty(null)
        setFilterType(null)
        setSearch('')
    }

    return (
        <div className="min-h-screen bg-background py-6 sm:py-10">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                        Interview Questions
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Prepare for your next interview with real questions from top African tech companies
                    </p>
                </motion.div>

                {/* Search & Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col lg:flex-row gap-6"
                >
                    {/* Sidebar Filters */}
                    <div className="lg:w-64 flex-shrink-0">
                        <GlassCard className="!p-4 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Filters</h3>
                                {(filterCompany || filterDifficulty || filterType) && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* Companies */}
                            <div className="mb-6">
                                <p className="text-sm font-medium mb-2">Company</p>
                                <div className="space-y-1">
                                    {companies.map((company) => (
                                        <button
                                            key={company.name}
                                            onClick={() => setFilterCompany(
                                                filterCompany === company.name ? null : company.name
                                            )}
                                            className={cn(
                                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition",
                                                filterCompany === company.name
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-muted"
                                            )}
                                        >
                                            <span>{company.name}</span>
                                            <span className="opacity-70">{company.count}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Difficulty */}
                            <div className="mb-6">
                                <p className="text-sm font-medium mb-2">Difficulty</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(difficultyConfig).map(([key, config]) => (
                                        <button
                                            key={key}
                                            onClick={() => setFilterDifficulty(
                                                filterDifficulty === key ? null : key
                                            )}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-sm font-medium transition",
                                                filterDifficulty === key
                                                    ? "bg-primary text-primary-foreground"
                                                    : config.color
                                            )}
                                        >
                                            {config.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Type */}
                            <div>
                                <p className="text-sm font-medium mb-2">Type</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(typeConfig).map(([key, config]) => (
                                        <button
                                            key={key}
                                            onClick={() => setFilterType(
                                                filterType === key ? null : key
                                            )}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg text-sm font-medium transition",
                                                filterType === key
                                                    ? "bg-primary text-primary-foreground"
                                                    : config.color
                                            )}
                                        >
                                            {config.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search Bar */}
                        <div className="flex gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search questions..."
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={() => setShowForm(!showForm)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Question
                            </Button>
                        </div>

                        {/* Add Question Form */}
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6"
                            >
                                <GradientCard className="!p-6">
                                    <h3 className="font-bold mb-4">Share an Interview Question</h3>
                                    <form className="space-y-4">
                                        <Input placeholder="Company name" />
                                        <Input placeholder="Role you interviewed for" />
                                        <textarea
                                            placeholder="The interview question..."
                                            className="w-full p-3 rounded-lg border border-input bg-background min-h-[100px]"
                                        />
                                        <div className="flex gap-4">
                                            <select className="flex-1 p-2 rounded-lg border border-input bg-background">
                                                <option value="">Select difficulty</option>
                                                <option value="easy">Easy</option>
                                                <option value="medium">Medium</option>
                                                <option value="hard">Hard</option>
                                            </select>
                                            <select className="flex-1 p-2 rounded-lg border border-input bg-background">
                                                <option value="">Select type</option>
                                                <option value="technical">Technical</option>
                                                <option value="behavioral">Behavioral</option>
                                                <option value="system_design">System Design</option>
                                                <option value="coding">Coding</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="gradient-african text-white">
                                                Submit Question
                                            </Button>
                                        </div>
                                    </form>
                                </GradientCard>
                            </motion.div>
                        )}

                        {/* Questions List */}
                        <div className="space-y-4">
                            {filteredQuestions.map((question) => (
                                <motion.div
                                    key={question.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <GlassCard className="!p-6">
                                        {/* Header */}
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl gradient-african flex items-center justify-center flex-shrink-0">
                                                <span className="text-white font-bold">
                                                    {question.company.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold">{question.company}</span>
                                                    <span className="text-muted-foreground">·</span>
                                                    <span className="text-sm text-muted-foreground">{question.role}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-xs font-medium",
                                                        difficultyConfig[question.difficulty].color
                                                    )}>
                                                        {difficultyConfig[question.difficulty].label}
                                                    </span>
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded-full text-xs font-medium",
                                                        typeConfig[question.type].color
                                                    )}>
                                                        {typeConfig[question.type].label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Question */}
                                        <p className="text-lg font-medium mb-4">{question.question}</p>

                                        {/* Answer Toggle */}
                                        {question.answer && (
                                            <div>
                                                <button
                                                    onClick={() => setShowAnswer(
                                                        showAnswer === question.id ? null : question.id
                                                    )}
                                                    className="flex items-center gap-2 text-primary hover:underline text-sm mb-2"
                                                >
                                                    <ChevronDown className={cn(
                                                        "w-4 h-4 transition-transform",
                                                        showAnswer === question.id && "rotate-180"
                                                    )} />
                                                    {showAnswer === question.id ? 'Hide' : 'Show'} Answer
                                                </button>
                                                {showAnswer === question.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground"
                                                    >
                                                        {question.answer}
                                                    </motion.div>
                                                )}
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
                                            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
                                                <ThumbsUp className="w-4 h-4" />
                                                {question.upvotes}
                                            </button>
                                            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
                                                <MessageSquare className="w-4 h-4" />
                                                {question.answers} answers
                                            </button>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}

                            {filteredQuestions.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                    <p>No questions found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
