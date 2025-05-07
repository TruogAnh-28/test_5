import {
  type SearchDeposits,
  type Deposit,
  type DepositInput,
  type CreateDepositResponse,
  type CreateDepositRequest,
  type CreateDepositUSDTRequest,
  type DepositDetail,
} from "~/features/deposit/type/deposit"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const getAllDeposits = async () => {
  const response = await api.get<ApiResponse<Deposit[]>>("/deposits")
  return response
}

export const getDeposit = async (data: {
  id: number
}) => {
  const response = await api.get<ApiResponse<DepositDetail>>(`/deposits/${data.id}`)
  return response
}

export const createDeposit = async (data: CreateDepositRequest) => {
  const response = await api.post<ApiResponse<CreateDepositResponse>>(
    "/deposits", data
  )
  return response
}

export const createDepositUSDT = async (data: CreateDepositUSDTRequest) => {
  const response = await api.post<ApiResponse<CreateDepositResponse>>(
    "/depositsUSDT", data
  )
  return response
}

export const updateDeposit = async ({
  id,
  data,
}: {
  id: number
  data: DepositInput
}) => {
  const response = await api.put<ApiResponse<null>>(
    `/deposits/${id}`, data
  )
  return response
}

export const deleteDeposit = async (id: number) => {
  const response = await api.delete<ApiResponse<boolean>>(`/deposits/${id}`)
  return response
}

export const approveDeposit = async (id: number) => {
  const response = await api.put<ApiResponse<boolean>>(
    `/deposits/${id}/approve`, null
  )
  return response
}

export const rejectDeposit = async (id: number) => {
  const response = await api.put<ApiResponse<boolean>>(
    `/deposits/${id}/reject`, null
  )
  return response
}

export const searchDeposits = async (filters: SearchDeposits) => {
  // Map the filters from our app format to the API format
  const apiFilters = {
    userId: filters.userId,
    start_date: filters.fromDate,
    end_date: filters.toDate,
    status: filters.status,
    page: filters.page,
    limit: filters.limit,
    codeTransaction: filters.codeTransaction,
    key: filters.key,
  }

  const response = await api.post<ApiResponse<{
    deposits: Deposit[]
    total: number
  }>>(
    "/deposits/search", apiFilters
  )

  // Transform API response to match our app's expected format
  return {
    ...response,
    data: {
      list: response.data.deposits || [],
      total: response.data.total || 0,
    },
  }
}

export const checkVoucher = async (code: string) => {
  const response = await api.get<ApiResponse<{
    id: number
    code: string
    value: number
    status: string
  }>>(`/vouchers/code/${code}`)

  return response
}
