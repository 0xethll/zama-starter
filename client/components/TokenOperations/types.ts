import type { TokenPair } from '@/hooks/useTokenList'

export type TabType = 'wrap' | 'unwrap' | 'transfer'

export interface TokenOperationsTabsProps {
  tokenPair: TokenPair
  onOperationComplete?: () => void
}

export interface TabComponentProps {
  tokenPair: TokenPair
  onComplete?: () => void
}
