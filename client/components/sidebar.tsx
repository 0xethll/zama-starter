'use client'

import { ConnectKitButton } from 'connectkit'
import { Shield, ArrowUpDown, Repeat2, Coins, FileText } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { TokenBalance } from './TokenBalance'

const navigation = [
  { name: 'Overview', href: '/', icon: FileText },
  { name: 'Token Transfer', href: '/transfer', icon: ArrowUpDown },
  { name: 'Token Swap', href: '/swap', icon: Repeat2 },
  { name: 'Faucet', href: '/faucet', icon: Coins },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <Shield className="h-8 w-8 primary-accent" />
        <div>
          <h1 className="text-lg font-semibold">Zama Starter</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            FHE explorer
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'primary-bg text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800',
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Wallet Connection */}
      <div className="px-4 pb-6">
        <div className="space-y-3">
          <TokenBalance />
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Network: Sepolia Only
          </div>
          <ConnectKitButton showBalance={true} showAvatar={false} />
        </div>
      </div>
    </div>
  )
}
