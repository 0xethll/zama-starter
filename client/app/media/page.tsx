'use client'

import { Sidebar } from '@/components/sidebar'
import { PlayCircle, Volume2, ExternalLink, Shield } from 'lucide-react'

export default function MediaPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
              <PlayCircle className="h-8 w-8 primary-accent" />
              Zama Media & Resources
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Explore videos and audio content to learn more about Zama and FHE
              technology
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <PlayCircle className="h-6 w-6 primary-accent" />
                Featured Videos
              </h2>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Zama Introduction Video
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Video placeholder - integrate with actual Zama content
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">
                    Introduction to Fully Homomorphic Encryption
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Learn the fundamentals of FHE and how Zama is
                    revolutionizing privacy-preserving computation.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="h-4 w-4" />
                    <span>Duration: 15:30</span>
                    <span>•</span>
                    <span>Beginner Level</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      FHE Smart Contracts Demo
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Video placeholder - integrate with actual Zama content
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">
                    Building Confidential Smart Contracts
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Hands-on tutorial for building confidential smart contracts
                    using FHEVM.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="h-4 w-4" />
                    <span>Duration: 22:45</span>
                    <span>•</span>
                    <span>Intermediate Level</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Volume2 className="h-6 w-6 primary-accent" />
                Featured Audio
              </h2>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Volume2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Zama Podcast: The Future of Privacy
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Episode 1
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Join Zama founders as they discuss the vision for
                  privacy-preserving computation and the role of FHE in the
                  future of blockchain technology.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Duration: 45:20</span>
                    <span>•</span>
                    <span>Released: Nov 2024</span>
                  </div>
                  <button className="flex items-center gap-1 text-sm primary-accent hover:underline">
                    <PlayCircle className="h-4 w-4" />
                    Play
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Volume2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Technical Deep Dive: FHEVM Architecture
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Technical Series
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  A technical exploration of how FHEVM enables encrypted
                  computation on blockchain, covering coprocessors, gateways,
                  and key management.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Duration: 32:15</span>
                    <span>•</span>
                    <span>Released: Oct 2024</span>
                  </div>
                  <button className="flex items-center gap-1 text-sm primary-accent hover:underline">
                    <PlayCircle className="h-4 w-4" />
                    Play
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* External Resources */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">
              Additional Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <a
                href="https://docs.zama.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-6 w-6 primary-accent" />
                  <h3 className="font-semibold">Official Documentation</h3>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Comprehensive guides and API references for Zamas FHE
                  solutions
                </p>
              </a>

              <a
                href="https://github.com/zama-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <PlayCircle className="h-6 w-6 primary-accent" />
                  <h3 className="font-semibold">GitHub Repository</h3>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Open-source code examples and libraries for FHE development
                </p>
              </a>

              <a
                href="https://zama.ai/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Volume2 className="h-6 w-6 primary-accent" />
                  <h3 className="font-semibold">Zama Blog</h3>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Latest updates, tutorials, and insights from the Zama team
                </p>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
