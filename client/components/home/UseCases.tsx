'use client'

import { motion } from 'framer-motion'
import {
  Briefcase,
  DollarSign,
  Gift,
  Building2,
  Users,
  TrendingUp,
} from 'lucide-react'

export function UseCases() {
  const useCases = [
    {
      icon: Briefcase,
      title: 'Private Payroll',
      description: 'Pay employees without revealing individual salaries',
      details: [
        'Keep compensation confidential',
        'Prevent salary comparison issues',
        'Maintain organizational privacy',
      ],
      gradient: 'from-blue-500 to-cyan-500',
      emoji: '💼',
    },
    {
      icon: DollarSign,
      title: 'Confidential Trading',
      description: 'Execute trades without exposing positions or amounts',
      details: [
        'Hide trading strategies',
        'Prevent front-running',
        'Protect large transactions',
      ],
      gradient: 'from-purple-500 to-pink-500',
      emoji: '💸',
    },
    {
      icon: Gift,
      title: 'Anonymous Donations',
      description: 'Donate to causes while maintaining privacy',
      details: [
        'Anonymous contribution amounts',
        'Protect donor identity',
        'Tax-compliant reporting',
      ],
      gradient: 'from-green-500 to-emerald-500',
      emoji: '🎁',
    },
    {
      icon: Building2,
      title: 'Corporate Treasury',
      description: 'Manage company funds with confidential balance sheets',
      details: [
        'Hide cash reserves from competitors',
        'Private vendor payments',
        'Confidential budget allocation',
      ],
      gradient: 'from-orange-500 to-red-500',
      emoji: '🏦',
    },
    {
      icon: Users,
      title: 'Private DAOs',
      description: 'Governance with confidential voting and treasury',
      details: [
        'Secret ballot voting',
        'Private treasury management',
        'Confidential proposals',
      ],
      gradient: 'from-indigo-500 to-purple-500',
      emoji: '🤝',
    },
    {
      icon: TrendingUp,
      title: 'Investment Funds',
      description: 'Manage portfolios with encrypted positions',
      details: [
        'Hide investment strategies',
        'Confidential rebalancing',
        'Private performance tracking',
      ],
      gradient: 'from-yellow-500 to-orange-500',
      emoji: '📈',
    },
  ]

  return (
    <section className="py-20 px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Real-World Use Cases
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Privacy is essential for many financial operations. Here&apos;s how
            confidential tokens solve real problems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              {/* Gradient Border Effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${useCase.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur`}
              />

              {/* Card Content */}
              <div className="relative bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 h-full">
                {/* Icon */}
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-3 bg-gradient-to-r ${useCase.gradient} rounded-xl`}
                  >
                    <useCase.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <span className="text-4xl">{useCase.emoji}</span>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {useCase.description}
                </p>

                {/* Details List */}
                <ul className="space-y-2">
                  {useCase.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {detail}
                      </span>
                    </motion.li>
                  ))}
                </ul>

                {/* Hover Effect Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  whileHover={{ scale: 1.02 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Ready to add privacy to your tokens?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Get Started Now →
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
