import {
  z,
} from "zod"

// Payment Method Enum
export enum PaymentMethod {
  USDT_TRC20 = "USDT-TRC20",
  USDT_ERC20 = "USDT-ERC20",
  VIETQR = "VIETQR",
  ONLINE = "ONLINE",
}

// Deposit Status Enum
export enum DepositStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

// Create Deposit Requests
export interface CreateDepositRequest {
  userId?: number
  voucherId?: number
  paymentMethodId: number
  amount: number
}

export interface CreateDepositUSDTRequest extends CreateDepositRequest {
  unit: string
}

// Deposit Schema Definitions
export const depositInputSchema = z.object({
  userId: z.number().optional(),
  voucherId: z.number().optional(),
  amount: z.number().min(
    0, "Số tiền phải lớn hơn 0"
  ),
  method: z.nativeEnum(PaymentMethod),
  status: z.nativeEnum(DepositStatus).optional(),
  date: z.string().optional(),
  codeTransaction: z.string().min(
    1, "Vui lòng nhập mã giao dịch"
  ),
  acceptedBy: z.string().optional(),
})

// Direct Deposit Schema
export const directDepositSchema = z.object({
  amount: z.number().min(
    10000, "Số tiền tối thiểu là 10,000đ"
  )
    .max(
      100000000, "Số tiền tối đa là 100,000,000đ"
    ),
  paymentMethodId: z.number(),
})

export type DepositInput = z.infer<typeof depositInputSchema>
export type DirectDepositInput = z.infer<typeof directDepositSchema>

// Response Type
export interface CreateDepositResponse {
  checkoutUrl: string
}
export type DepositPaymentMethod = {
  id: number
  name: string
  unit: string
}
// Main Deposit Type
export type Deposit = {
  id: number
  userId: number
  voucherId?: number
  orderId?: string
  paymentMethods: DepositPaymentMethod
  amount: number
  method?: string
  status: DepositStatus
  date?: string
  codeTransaction?: string
  acceptedBy?: string
  createdAt: string
  updatedAt: string
  username?: string
  voucherCode?: string
}

// Search Parameters Type
export type SearchDeposits = {
  key?: string
  limit: number
  page: number
  userId?: number
  status?: DepositStatus
  fromDate?: string
  toDate?: string
  codeTransaction?: string
}

// Voucher Type (used in useVoucher hook)
export interface Voucher {
  id: number
  code: string
  value: number
  status: boolean
  expiryDate: string
}

export interface DepositDetail {
  createdAt: string
  updatedAt: string
  id: number
  orderId: string
  userId: number
  voucherId: number
  paymentMethodId: number
  amount: string
  status: DepositStatus
  acceptedBy: string
  createdBy: number
  isDeleted: boolean
  paymentMethods: PaymentMethods
}

export interface PaymentMethods {
  createdAt: string
  updatedAt: string
  id: number
  name: string
  unit: string
  isDeleted: boolean
}
