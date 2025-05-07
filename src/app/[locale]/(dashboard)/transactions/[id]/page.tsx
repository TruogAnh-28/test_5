import {
  TransactionDetail,
} from "~/features/transaction/components/view-transaction-detail"

export const metadata = {
  title: "Thông tin nạp tiền",
}
export default function DepositDetailPage({ params }: { params: {
  id: number
} }) {
  return (
    <div className="p-8">
      <TransactionDetail id={params.id} />
    </div>
  )
}
