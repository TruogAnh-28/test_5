import {
  DepositForm,
} from "~/features/deposit/components/forms/deposit-form"

export const metadata = {
  title: "Danh sách nạp tiền",
}
export default function DepositPage() {
  return (
    <div className="p-8">
      <DepositForm />
    </div>
  )
}
