import {
  ViewTransactionHistory,
} from "~/features/transaction/components/view-transaction-history"
import {
  ViewTransactionHistoryAdmin,
} from "~/features/transaction/components/view-transaction-history-admin"
import {
  redirect,
} from "~/i18n"
import {
  getServerAuthSession,
} from "~/server/auth"

export const metadata = {
  title: "Lịch sử giao dịch",
}

export default async function TransactionsPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/login")
  }

  const isAdmin = session?.user.role.id === 1

  return (
    <div className="p-8">
      {isAdmin ? <ViewTransactionHistoryAdmin /> : <ViewTransactionHistory />}
    </div>
  )
}
