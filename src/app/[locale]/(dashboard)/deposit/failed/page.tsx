import {
  DepositFailed,
} from "~/features/deposit/components/deposit-failed"

export const metadata = {
  title: "Nạp tiền thất bại",
}
export default function DepositFailedPage() {
  return (
    <div className="p-8">
      <DepositFailed />
    </div>
  )
}
