import {
  useState,
} from "react"

import {
  useMutation,
} from "@tanstack/react-query"
import {
  toast,
} from "sonner"

import {
  checkVoucher,
} from "~/features/deposit/api/deposit"

interface VoucherData {
  id: number
  code: string
  value: number
  status: string
}

export function useVoucher() {
  const [
    voucherData,
    setVoucherData,
  ] = useState<VoucherData | null>(null)

  const voucherMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await checkVoucher(code)
      return response.data
    },
    onSuccess: (data) => {
      if (data.status === "ACTIVE") {
        setVoucherData(data)
        toast.success(`Áp dụng voucher thành công: +${data.value}%`)
      }
      else {
        setVoucherData(null)
        toast.error("Mã voucher không hợp lệ hoặc đã hết hạn")
      }
    },
    onError: (error: Error) => {
      setVoucherData(null)
      toast.error(error.message || "Không thể áp dụng voucher")
    },
  })

  const checkVoucherCode = (code: string) => {
    if (!code) {
      toast.error("Vui lòng nhập mã voucher")
      return
    }

    voucherMutation.mutate(code)
  }

  return {
    voucherData,
    checkVoucher: checkVoucherCode,
    isLoading: voucherMutation.isPending,
    isError: voucherMutation.isError,
    error: voucherMutation.error,
    reset: () => setVoucherData(null),
  }
}
