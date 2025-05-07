import {
  z,
} from "zod"

export enum TransactionStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  FAILED = "FAILED",
}

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  PAY_SERVICE = "PAY_SERVICE",
}

export const transactionFilterSchema = z.object({
  key: z.string().optional(),
  limit: z.number(),
  page: z.number(),
  type: z.enum([
    TransactionType.PAY_SERVICE,
    TransactionType.DEPOSIT,
  ]).default(TransactionType.PAY_SERVICE),
  status: z.nativeEnum(TransactionStatus).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  walletId: z.number().optional(),
})

export type TransactionFilter = z.infer<typeof transactionFilterSchema>

export type Transaction = {
  id: number
  walletId: number
  username?: string
  campaignName?: string | null
  amount: number
  status: TransactionStatus
  type: TransactionType
  referenceId?: string
  date?: string
  createdAt: string
  updatedAt: string
}

export type SearchTransactionsResponse = {
  transaction: Transaction[]
  total: number
}
