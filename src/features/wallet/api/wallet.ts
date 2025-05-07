// src/features/wallet/api/wallet.ts
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export interface WalletData {
  id: number
  userId: number
  balance: number
  createdAt: string
  updatedAt: string
}

export const getWalletById = async (id: number) => {
  const response = await api.get<ApiResponse<WalletData>>(`/wallets/${id}`)
  return response
}
