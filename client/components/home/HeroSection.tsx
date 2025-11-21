'use client'

import { motion } from 'framer-motion'
import { Lock, Unlock, ArrowRight, Shield } from 'lucide-react'
import { useCallback } from 'react'
import Particles from '@tsparticles/react'
import type { Engine } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

export function HeroSection() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: 'transparent',
            },
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: '#3b82f6',
            },
            links: {
              color: '#3b82f6',
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              random: false,
              straight: false,
              outModes: {
                default: 'bounce',
              },
            },
            number: {
              density: {
                enable: true,
              },
              value: 80,
            },
            opacity: {
              value: 0.3,
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 -z-10"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Privacy-First Tokens
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Transform any ERC20 token into a confidential asset using Fully
            Homomorphic Encryption
          </p>
        </motion.div>

        {/* Encryption Flow Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center justify-center gap-8 mb-12 flex-wrap"
        >
          {/* ERC20 Token */}
          <motion.div
            className="relative"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-8 rounded-2xl shadow-2xl">
              <Unlock className="h-16 w-16 text-white" />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <p className="text-sm font-semibold">ERC20 Token</p>
              <p className="text-xs text-gray-500">👁️ Public</p>
            </div>
          </motion.div>

          {/* Arrow with encryption particles */}
          <motion.div className="flex items-center gap-2">
            <motion.div
              animate={{
                x: [0, 10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ArrowRight className="h-8 w-8 text-blue-500" />
            </motion.div>
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="text-2xl"
            >
              🔐
            </motion.div>
            <motion.div
              animate={{
                x: [0, 10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.3,
              }}
            >
              <ArrowRight className="h-8 w-8 text-purple-500" />
            </motion.div>
          </motion.div>

          {/* Confidential Token */}
          <motion.div
            className="relative"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-white"
                animate={{
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <Lock className="h-16 w-16 text-white relative z-10" />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <p className="text-sm font-semibold">Confidential Token</p>
              <p className="text-xs text-gray-500">🔒 Private</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20"
        >
          {[
            {
              icon: Shield,
              title: 'Encrypted Balances',
              desc: 'All amounts are encrypted on-chain',
            },
            {
              icon: Lock,
              title: 'Private Transfers',
              desc: 'Transaction amounts remain confidential',
            },
            {
              icon: Shield,
              title: 'FHE Powered',
              desc: 'Compute on encrypted data without decryption',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-800"
            >
              <item.icon className="h-10 w-10 text-blue-500 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
