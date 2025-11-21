import { AppLayout } from '@/components/AppLayout'
import { HeroSection } from '@/components/home/HeroSection'
import { ProblemSolution } from '@/components/home/ProblemSolution'
import { UseCases } from '@/components/home/UseCases'
import { FlowDiagram } from '@/components/home/FlowDiagram'
import { TechnologyStack } from '@/components/home/TechnologyStack'
import {
  PlayCircle,
  Volume2,
  ExternalLink,
  Shield,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <AppLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Problem & Solution */}
        <ProblemSolution />

        {/* Use Cases */}
        <UseCases />

        {/* Flow Diagram */}
        <FlowDiagram />

        {/* Technology Stack */}
        <TechnologyStack />
      </div>
    </AppLayout>
  )
}
