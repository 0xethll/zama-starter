import { AppLayout } from '@/components/AppLayout'
import {
  Shield,
  Lock,
  Zap,
  PlayCircle,
  Volume2,
  ExternalLink,
} from 'lucide-react'

export default function Home() {
  return (
    <AppLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to Zama Starter</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              The first APP exploring Fully Homomorphic Encryption (FHE) and
              ZAMA through hands-on experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <Shield className="h-8 w-8 primary-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Confidential Transfers
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Transfer tokens while keeping amounts completely private using
                FHE
              </p>
            </div>

            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <Zap className="h-8 w-8 primary-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Private Swaps</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Swap tokens without revealing trade amounts or directions
              </p>
            </div>

            <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
              <Lock className="h-8 w-8 primary-accent mb-4" />
              <h3 className="text-lg font-semibold mb-2">Zero Leakage</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All operations are performed on encrypted data with no
                information leaks
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* <section>
              <h2 className="text-2xl font-semibold mb-4">What is FHE?</h2>
              <div className="prose dark:prose-invert">
                <p>
                  Fully Homomorphic Encryption (FHE) allows computations to be
                  performed on encrypted data without decrypting it first. This
                  revolutionary technology enables:
                </p>
                <ul>
                  <li>
                    <strong>Privacy-preserving computations:</strong> Perform
                    calculations on encrypted data
                  </li>
                  <li>
                    <strong>Confidential smart contracts:</strong> Execute logic
                    without revealing inputs
                  </li>
                  <li>
                    <strong>Zero-knowledge operations:</strong> Verify outcomes
                    without exposing details
                  </li>
                </ul>
              </div>
            </section> */}

            <section>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <PlayCircle className="h-6 w-6 primary-accent" />
                Media & Resources
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Explore videos and audio content to learn more about Zama and
                FHE technology
              </p>

              <div className="space-y-12 mb-12">
                {/* Video Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 primary-accent" />
                    Featured Videos
                  </h3>

                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                      <div className="aspect-video">
                        <iframe
                          src="https://www.youtube.com/embed/UxMf2qV5IpU"
                          title="Zama Introduction Video"
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audio Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Volume2 className="h-5 w-5 primary-accent" />
                    Featured Audio
                  </h3>

                  <div className="max-w-3xl mx-auto">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="240"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/2156124450&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                        title="Unlocking Confidential Blockchains Zama FHEVM and the Future of Encrypted dApps"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>

              {/* External Resources */}
              <div>
                <h3 className="text-xl font-semibold mb-6">
                  Additional Resources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <a
                    href="https://docs.zama.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="h-6 w-6 primary-accent" />
                      <h4 className="font-semibold">Official Documentation</h4>
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
                      <h4 className="font-semibold">GitHub Repository</h4>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Open-source code examples and libraries for FHE
                      development
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
                      <h4 className="font-semibold">Zama Blog</h4>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Latest updates, tutorials, and insights from the Zama team
                    </p>
                  </a>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Step 1: Connect Wallet</h4>
                  <p className="text-sm">
                    Connect your wallet to the Sepolia testnet using the sidebar
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    Step 2: Get Test Tokens
                  </h4>
                  <p className="text-sm">
                    Visit the Faucet to claim confidential test tokens
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Step 3: Try Features</h4>
                  <p className="text-sm">
                    Experiment with confidential transfers and swaps
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
