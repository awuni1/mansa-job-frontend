'use client'

import { motion } from 'framer-motion'
import { Check, X, Star, Zap, Building2, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard, GradientCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import Link from 'next/link'

const plans = [
    {
        id: 'free',
        name: 'Starter',
        description: 'Perfect for individuals starting out',
        price: { monthly: 0, annual: 0 },
        icon: Zap,
        features: [
            { text: 'Post 2 jobs per month', included: true },
            { text: 'Basic candidate search', included: true },
            { text: 'Email support', included: true },
            { text: 'Application tracking', included: true },
            { text: 'Advanced analytics', included: false },
            { text: 'Priority support', included: false },
            { text: 'Featured listings', included: false },
            { text: 'API access', included: false },
        ],
        cta: 'Get Started Free',
        popular: false
    },
    {
        id: 'pro',
        name: 'Professional',
        description: 'Best for growing teams',
        price: { monthly: 99, annual: 79 },
        icon: Star,
        features: [
            { text: 'Post 20 jobs per month', included: true },
            { text: 'Advanced candidate search', included: true },
            { text: 'Priority email support', included: true },
            { text: 'Application tracking', included: true },
            { text: 'Advanced analytics', included: true },
            { text: 'Priority support', included: true },
            { text: 'Featured listings (5/mo)', included: true },
            { text: 'API access', included: false },
        ],
        cta: 'Start Free Trial',
        popular: true
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For large organizations',
        price: { monthly: 299, annual: 249 },
        icon: Crown,
        features: [
            { text: 'Unlimited job postings', included: true },
            { text: 'Advanced candidate search', included: true },
            { text: '24/7 dedicated support', included: true },
            { text: 'Application tracking', included: true },
            { text: 'Custom analytics', included: true },
            { text: 'Priority support', included: true },
            { text: 'Featured listings (unlimited)', included: true },
            { text: 'Full API access', included: true },
        ],
        cta: 'Contact Sales',
        popular: false
    },
]

const testimonials = [
    {
        quote: "Mansa Jobs helped us find amazing talent across the continent. The platform is intuitive and the candidate quality is exceptional.",
        author: "Amina Diallo",
        role: "Head of HR, TechCorp Ghana",
        avatar: "A"
    },
    {
        quote: "We filled 15 positions in just two months. The AI matching is incredibly accurate.",
        author: "David Okonkwo",
        role: "Talent Acquisition, Flutterwave",
        avatar: "D"
    },
    {
        quote: "The best investment we've made for our hiring process. Highly recommended!",
        author: "Fatima Hassan",
        role: "CEO, StartupXYZ",
        avatar: "F"
    },
]

export default function PricingPage() {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual')

    return (
        <div className="min-h-screen bg-background py-16 sm:py-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        Choose the perfect plan for your hiring needs. No hidden fees.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-3 p-1.5 rounded-full bg-muted">
                        <button
                            onClick={() => setBillingPeriod('monthly')}
                            className={cn(
                                "px-5 py-2 rounded-full text-sm font-medium transition",
                                billingPeriod === 'monthly'
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted-foreground/10"
                            )}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingPeriod('annual')}
                            className={cn(
                                "px-5 py-2 rounded-full text-sm font-medium transition flex items-center gap-2",
                                billingPeriod === 'annual'
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted-foreground/10"
                            )}
                        >
                            Annual
                            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                                Save 20%
                            </span>
                        </button>
                    </div>
                </motion.div>

                {/* Pricing Cards */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-24"
                >
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className={cn("relative", plan.popular && "md:-mt-4 md:mb-4")}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                                    Most Popular
                                </div>
                            )}

                            {plan.popular ? (
                                <GradientCard className="h-full">
                                    <PlanContent plan={plan} billingPeriod={billingPeriod} />
                                </GradientCard>
                            ) : (
                                <GlassCard className="h-full">
                                    <PlanContent plan={plan} billingPeriod={billingPeriod} />
                                </GlassCard>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Testimonials */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto"
                >
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
                        Trusted by Leading Companies
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.author}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <GlassCard className="h-full !p-6">
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className="w-4 h-4 fill-secondary text-secondary" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                                        &ldquo;{testimonial.quote}&rdquo;
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full gradient-african flex items-center justify-center">
                                            <span className="text-white font-bold">{testimonial.avatar}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{testimonial.author}</p>
                                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* FAQ CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-24"
                >
                    <GradientCard className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-3">Have questions?</h2>
                        <p className="text-muted-foreground mb-6">
                            Our team is here to help you find the perfect plan for your needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/contact">
                                <Button variant="outline" className="min-h-12 px-6">
                                    Contact Sales
                                </Button>
                            </Link>
                            <Link href="/faq">
                                <Button className="gradient-african text-white min-h-12 px-6">
                                    View FAQ
                                </Button>
                            </Link>
                        </div>
                    </GradientCard>
                </motion.div>
            </div>
        </div>
    )
}

function PlanContent({ plan, billingPeriod }: { plan: typeof plans[0]; billingPeriod: 'monthly' | 'annual' }) {
    const price = plan.price[billingPeriod]

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <plan.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>

            <div className="mb-6">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${price}</span>
                    {price > 0 && (
                        <span className="text-muted-foreground">/month</span>
                    )}
                </div>
                {billingPeriod === 'annual' && price > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                        Billed annually (${price * 12}/year)
                    </p>
                )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-2">
                        {feature.included ? (
                            <Check className="w-5 h-5 text-accent flex-shrink-0" />
                        ) : (
                            <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                        )}
                        <span className={cn(
                            "text-sm",
                            !feature.included && "text-muted-foreground/50"
                        )}>
                            {feature.text}
                        </span>
                    </li>
                ))}
            </ul>

            <Button
                className={cn(
                    "w-full min-h-12",
                    plan.popular && "gradient-african text-white"
                )}
                variant={plan.popular ? "default" : "outline"}
            >
                {plan.cta}
            </Button>
        </div>
    )
}
