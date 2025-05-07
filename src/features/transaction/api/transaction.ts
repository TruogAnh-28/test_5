import {
  type TransactionFilter,
  type Transaction,
  type SearchTransactionsResponse,
  TransactionType,
} from "~/features/transaction/type/transaction"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const searchTransactions = async (filters: TransactionFilter) => {
  const searchFilters = {
    ...filters,
    type: filters.type || TransactionType.PAY_SERVICE,
  }

  const response = await api.post<ApiResponse<SearchTransactionsResponse>>(
    "/transactions/search", searchFilters
  )
  return response
}

export const getTransactionById = async (id: number) => {
  const response = await api.post<ApiResponse<Transaction & {
    campaign?: {
      id: number
      userId: number
      countryId: number
      name: string
      campaignTypeId: number
      device: string
      title: string
      startDate: string
      endDate: string
      totalTraffic: number
      totalCost: number
      domain: string
      search: string
      status: string
      links?: Array<{
        source: string
        target: string
        traffic: number
        cost: number
      }>
      keywords?: Array<{
        name: string
        traffic: number
        cost: number
      }>
      createdAt: string
      updatedAt: string
    }
  }>>(
    "/transactions/get", {
      transactionId: id,
    }
  )
  return response
}
