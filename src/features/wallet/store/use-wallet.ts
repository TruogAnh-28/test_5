import {
  useQuery,
} from "@tanstack/react-query"

import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

interface WalletResponse {
  id: number
  userId: number
  balance: number
  createdAt: string
  updatedAt: string
}

export function useWalletBalance(walletId?: number) {
  return useQuery({
    queryKey: [
      "getWalletBalance",
      walletId,
    ],
    queryFn: async () => {
      if (!walletId) return null
      const response = await api.get<ApiResponse<WalletResponse>>(`/wallets/${walletId}`)
      return response.data
    },
    enabled: !!walletId,
  })
}
