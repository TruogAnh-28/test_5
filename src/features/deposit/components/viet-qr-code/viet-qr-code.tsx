import React, {
  useMemo,
} from "react"

import Image from "next/image"

interface VietQRCodeProps {
  bankCode: string // Mã ngân hàng
  accountNumber: string // Số tài khoản
  amount: number // Số tiền
  message: string // Nội dung chuyển khoản
  accountName?: string // Tên tài khoản (tùy chọn)
}

export function VietQRCode({
  bankCode,
  accountNumber,
  amount,
  message,
  accountName,
}: VietQRCodeProps) {
  // Tạo URL cho VietQR
  const qrCodeUrl = useMemo(
    () => {
      // Đảm bảo số tiền là số nguyên dương
      const formattedAmount = Math.max(
        0, Math.floor(amount)
      ).toString()

      // Encode các thông tin để sử dụng trong URL
      const encodedMessage = encodeURIComponent(message)
      const encodedAccountName = accountName ? encodeURIComponent(accountName) : ""

      // Tạo URL QR theo chuẩn của VietQR
      // Format: https://img.vietqr.io/image/{bankCode}-{accountNumber}-{template}.png?amount={amount}&addInfo={message}&accountName={accountName}
      // Tham khảo: https://www.vietqr.io/danh-sach-api/api-tao-ma-qr
      return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${formattedAmount}&addInfo=${encodedMessage}&accountName=${encodedAccountName}`
    },
    [
      bankCode,
      accountNumber,
      amount,
      message,
      accountName,
    ]
  )

  return (
    <div className="qr-code-container flex justify-center">
      <div className="relative size-48 overflow-hidden rounded">
        <Image
          src={qrCodeUrl}
          alt={`Mã QR chuyển khoản ${bankCode}`}
          fill
          sizes="192px"
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
}
