'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase, Users, Building2, TrendingUp, ArrowRight, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard, GradientCard } from "@/components/ui/GlassCard";
import { AnimatedCounter, formatLargeNumber } from "@/components/AnimatedCounter";
import { JobCard3D } from "@/components/JobCard3D";

// Mock featured jobs data
const featuredJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: { name: "Andela", logo: null, location: "Lagos, Nigeria" },
    location: "Remote",
    job_type: "full_time",
    salary_range: "$80K - $120K",
    created_at: new Date().toISOString(),
    skills: ["React", "TypeScript", "Next.js", "Tailwind"]
  },
  {
    id: 2,
    title: "Product Manager",
    company: { name: "Flutterwave", logo: null, location: "Lagos, Nigeria" },
    location: "Lagos, Nigeria",
    job_type: "full_time",
    salary_range: "$70K - $100K",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    skills: ["Agile", "Product Strategy", "Analytics"]
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: { name: "Paystack", logo: null, location: "Accra, Ghana" },
    location: "Accra, Ghana",
    job_type: "full_time",
    salary_range: "$60K - $90K",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"]
  },
];

const topCompanies = [
  { name: "Andela", logo: "A", jobs: 45, industry: "Technology" },
  { name: "Flutterwave", logo: "F", jobs: 32, industry: "Fintech" },
  { name: "Paystack", logo: "P", jobs: 28, industry: "Fintech" },
  { name: "Jumia", logo: "J", jobs: 56, industry: "E-commerce" },
  { name: "MTN", logo: "M", jobs: 89, industry: "Telecom" },
  { name: "Safaricom", logo: "S", jobs: 67, industry: "Telecom" },
];

const stats = [
  { value: 10000, label: "Active Jobs", suffix: "+", icon: Briefcase },
  { value: 50000, label: "Job Seekers", suffix: "+", icon: Users },
  { value: 500, label: "Companies", suffix: "+", icon: Building2 },
  { value: 95, label: "Success Rate", suffix: "%", icon: TrendingUp },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium">Africa&apos;s #1 Job Platform</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              Find Your Dream Job in{" "}
              <span className="gradient-african-text">Africa</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Connecting talented professionals with top companies across the continent.
              Explore opportunities in Accra, Lagos, Nairobi, Cairo, and beyond.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="w-full max-w-3xl mx-auto"
            >
              <GlassCard className="!p-2 sm:!p-3">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <div className="flex items-center px-4 flex-1 bg-muted/50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <Search className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
                    <Input
                      type="text"
                      placeholder="Job title, skills, or company"
                      className="border-0 bg-transparent focus-visible:ring-0 shadow-none text-base"
                    />
                  </div>
                  <div className="hidden sm:block w-px bg-border mx-2" />
                  <div className="flex items-center px-4 flex-1 bg-muted/50 sm:bg-transparent rounded-lg sm:rounded-none">
                    <MapPin className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
                    <Input
                      type="text"
                      placeholder="Location (e.g. Remote, Lagos)"
                      className="border-0 bg-transparent focus-visible:ring-0 shadow-none text-base"
                    />
                  </div>
                  <Button size="lg" className="gradient-african text-white min-h-14 sm:min-h-12 px-8 rounded-xl text-base font-semibold">
                    <Search className="w-5 h-5 mr-2 sm:hidden" />
                    Search Jobs
                  </Button>
                </div>
              </GlassCard>
            </motion.div>

            {/* Popular searches */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex flex-wrap justify-center gap-2"
            >
              <span className="text-sm text-muted-foreground">Popular:</span>
              {['Remote', 'Software Engineer', 'Product Manager', 'Data Analyst'].map((term) => (
                <Link
                  key={term}
                  href={`/jobs?q=${encodeURIComponent(term)}`}
                  className="px-3 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-sm transition touch-target"
                >
                  {term}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={itemVariants} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold mb-1">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    formatValue={stat.value >= 1000 ? formatLargeNumber : undefined}
                  />
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Featured Jobs</h2>
              <p className="text-muted-foreground">Handpicked opportunities from top companies</p>
            </div>
            <Link href="/jobs">
              <Button variant="outline" className="group">
                View All Jobs
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {featuredJobs.map((job) => (
              <motion.div key={job.id} variants={itemVariants}>
                <JobCard3D job={job} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Top Companies Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Top Companies Hiring</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join Africa&apos;s leading tech companies and startups
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {topCompanies.map((company) => (
              <motion.div key={company.name} variants={itemVariants}>
                <Link href={`/companies/${company.name.toLowerCase()}`}>
                  <GlassCard className="!p-4 text-center hover:border-primary/30 transition group cursor-pointer">
                    <div className="w-14 h-14 rounded-xl gradient-african flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-xl">{company.logo}</span>
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition">{company.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{company.industry}</p>
                    <span className="inline-flex items-center text-xs text-accent font-medium">
                      {company.jobs} jobs
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </span>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <GradientCard className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto py-8"
            >
              <h2 className="text-2xl sm:text-4xl font-bold mb-4">
                Ready to Find Your Next Opportunity?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of professionals already using Mansa Jobs to advance their careers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="gradient-african text-white min-h-14 px-8 text-base font-semibold w-full sm:w-auto">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button size="lg" variant="outline" className="min-h-14 px-8 text-base w-full sm:w-auto">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </motion.div>
          </GradientCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-african flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="font-bold text-xl">Mansa</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                Africa&apos;s premier job platform connecting talent with opportunity.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/jobs" className="hover:text-primary transition">Browse Jobs</Link></li>
                <li><Link href="/companies" className="hover:text-primary transition">Companies</Link></li>
                <li><Link href="/salaries" className="hover:text-primary transition">Salary Guide</Link></li>
                <li><Link href="/alerts" className="hover:text-primary transition">Job Alerts</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/post-job" className="hover:text-primary transition">Post a Job</Link></li>
                <li><Link href="/pricing" className="hover:text-primary transition">Pricing</Link></li>
                <li><Link href="/dashboard/employer" className="hover:text-primary transition">Employer Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mansa Jobs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
