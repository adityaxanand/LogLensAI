"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Brain,
  CheckCircle,
  Star,
  Play,
  Database,
  Bell,
  Users,
  Globe,
  Cpu,
  Lock,
  TrendingUp,
  Activity,
  Search,
  Filter,
  Download,
  Share2,
  Settings,
  Layers,
  Code,
  Smartphone,
  Cloud,
  Gauge,
  Target,
  Workflow,
  Palette,
  MessageSquare,
  Calendar,
  FileText,
  CreditCard,
  Award,
  Rocket,
  Sparkles,
  Eye,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced machine learning algorithms detect anomalies and predict issues before they impact your system.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description: "Process millions of log entries in seconds with our optimized parsing engine.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Security Insights",
    description: "Identify security threats and vulnerabilities hidden in your log data.",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: BarChart3,
    title: "Interactive Dashboards",
    description: "Beautiful, customizable dashboards that make complex data easy to understand.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Bell,
    title: "Smart Alerting",
    description: "Get notified instantly when critical issues are detected in your logs.",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Database,
    title: "Unlimited Storage",
    description: "Store and analyze unlimited log history with our cloud infrastructure.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share insights and collaborate with your team in real-time.",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: Globe,
    title: "Multi-Platform Support",
    description: "Works with all major platforms and log formats out of the box.",
    color: "from-slate-500 to-gray-500",
  },
]

const advancedFeatures = [
  { icon: Cpu, title: "Performance Monitoring", description: "Real-time system performance tracking" },
  { icon: Lock, title: "Advanced Security", description: "Enterprise-grade security features" },
  { icon: TrendingUp, title: "Predictive Analytics", description: "AI-powered trend prediction" },
  { icon: Activity, title: "Health Monitoring", description: "System health scoring and alerts" },
  { icon: Search, title: "Advanced Search", description: "Powerful search with filters" },
  { icon: Filter, title: "Smart Filtering", description: "Intelligent log categorization" },
  { icon: Download, title: "Data Export", description: "Export in multiple formats" },
  { icon: Share2, title: "Easy Sharing", description: "Share insights with stakeholders" },
  { icon: Settings, title: "Customization", description: "Fully customizable interface" },
  { icon: Layers, title: "Multi-Source", description: "Aggregate logs from multiple sources" },
  { icon: Code, title: "API Access", description: "RESTful API for integrations" },
  { icon: Smartphone, title: "Mobile Ready", description: "Responsive design for all devices" },
  { icon: Cloud, title: "Cloud Native", description: "Built for cloud environments" },
  { icon: Gauge, title: "Performance Metrics", description: "Detailed performance analytics" },
  { icon: Target, title: "Anomaly Detection", description: "AI-powered anomaly identification" },
  { icon: Workflow, title: "Automation", description: "Automated workflows and actions" },
  { icon: Palette, title: "Theming", description: "Light and dark mode support" },
  { icon: MessageSquare, title: "Notifications", description: "Multi-channel notifications" },
  { icon: Calendar, title: "Scheduling", description: "Schedule reports and alerts" },
  { icon: FileText, title: "Documentation", description: "Comprehensive documentation" },
  { icon: CreditCard, title: "Billing", description: "Flexible pricing plans" },
  { icon: Award, title: "Compliance", description: "SOC2 and GDPR compliant" },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior DevOps Engineer",
    company: "TechCorp",
    content:
      "LogLens AI reduced our incident response time by 80%. It's like having a senior engineer analyzing logs 24/7.",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO",
    company: "StartupXYZ",
    content: "The AI-powered root cause analysis is phenomenal. We catch issues before they become problems.",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Emily Watson",
    role: "Site Reliability Engineer",
    company: "CloudScale",
    content: "Best investment we've made for our infrastructure monitoring. The insights are incredible.",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "David Kim",
    role: "Lead Developer",
    company: "InnovateLabs",
    content: "The real-time monitoring and alerting system has transformed how we handle production issues.",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Lisa Thompson",
    role: "Security Analyst",
    company: "SecureNet",
    content: "The security insights and threat detection capabilities are unmatched in the industry.",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Alex Johnson",
    role: "Platform Engineer",
    company: "DataFlow",
    content: "LogLens AI's predictive analytics helped us prevent three major outages last month.",
    rating: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "Up to 100MB log processing/month",
      "Basic AI analysis",
      "3 custom alerts",
      "7-day log retention",
      "Community support",
      "Basic dashboards",
    ],
    popular: false,
    cta: "Get Started Free",
    color: "from-gray-500 to-slate-500",
  },
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for small teams",
    features: [
      "Up to 1GB log processing/month",
      "Advanced AI analysis",
      "10 custom alerts",
      "30-day log retention",
      "Email support",
      "Custom dashboards",
      "API access",
    ],
    popular: false,
    cta: "Start Free Trial",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "For growing businesses",
    features: [
      "Up to 10GB log processing/month",
      "AI predictions & insights",
      "Unlimited custom alerts",
      "90-day log retention",
      "Priority support",
      "Team collaboration",
      "Advanced integrations",
      "Custom reports",
    ],
    popular: true,
    cta: "Start Free Trial",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: [
      "Unlimited log processing",
      "Custom AI models",
      "Unlimited everything",
      "1-year log retention",
      "24/7 dedicated support",
      "On-premise deployment",
      "Custom integrations",
      "SLA guarantees",
    ],
    popular: false,
    cta: "Contact Sales",
    color: "from-emerald-500 to-green-500",
  },
]

const stats = [
  { value: "99.9%", label: "Uptime Guarantee", icon: Shield },
  { value: "10x", label: "Faster Analysis", icon: Zap },
  { value: "80%", label: "Reduced MTTR", icon: TrendingUp },
  { value: "500+", label: "Enterprise Customers", icon: Users },
]

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LogLens AI
              </span>
              <div className="text-xs text-muted-foreground">Intelligence Platform</div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Reviews
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/auth/signin">
                <Button variant="ghost" className="hover:bg-muted/50">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                <a href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#pricing" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
                <a href="#testimonials" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Reviews
                </a>
                <a href="#contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 border-0"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Log Intelligence Platform
            </Badge>

            <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                Transform Your Logs Into
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Actionable Intelligence
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Stop drowning in log files. Our AI analyzes millions of entries in seconds, detects anomalies, predicts
              issues, and provides actionable solutions with enterprise-grade security.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-2 hover:bg-muted/50 transition-all duration-300 bg-transparent"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <Rocket className="w-4 h-4 mr-2" />
                Powerful Features
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Everything You Need for{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Modern Log Analysis
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive tools and AI-powered insights to monitor, analyze, and optimize your applications
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4 group-hover:text-purple-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Advanced Features Grid */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">30+ Advanced Features</h3>
            <p className="text-muted-foreground">Comprehensive toolset for enterprise-grade log analysis</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="p-4 text-center hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <CreditCard className="w-4 h-4 mr-2" />
                Flexible Pricing
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Choose Your{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Perfect Plan
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Start free and scale as you grow. No hidden fees, cancel anytime.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card
                  className={`h-full relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 ${
                    plan.popular
                      ? "ring-2 ring-purple-500 shadow-2xl shadow-purple-500/25 scale-105"
                      : "hover:shadow-2xl"
                  } transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
                  )}
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                      Most Popular
                    </Badge>
                  )}
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <div className="mb-2">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                          : "bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white"
                      } transition-all duration-300`}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Customer Stories
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Trusted by{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Engineering Teams
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See what our customers are saying about LogLens AI
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
                  <CardContent className="p-8">
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-semibold">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
              <CardContent className="p-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                  Get the latest updates on new features, best practices, and industry insights.
                </p>
                <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    Subscribe
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Log Analysis?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              Join thousands of engineering teams who trust LogLens AI to keep their systems running smoothly. Start
              your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-2 hover:bg-muted/50 transition-all duration-300 bg-transparent"
              >
                <Eye className="mr-2 w-5 h-5" />
                View Live Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    LogLens AI
                  </span>
                  <div className="text-xs text-muted-foreground">Intelligence Platform</div>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                AI-powered log analysis platform for modern engineering teams. Transform your logs into actionable
                intelligence with enterprise-grade security and performance.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-purple-500 hover:text-white transition-colors bg-transparent"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-purple-500 hover:text-white transition-colors bg-transparent"
                >
                  <Globe className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-purple-500 hover:text-white transition-colors bg-transparent"
                >
                  <Code className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Product</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground">
            <p>&copy; 2024 LogLens AI. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-sm">Made with</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm">by engineers, for engineers</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
