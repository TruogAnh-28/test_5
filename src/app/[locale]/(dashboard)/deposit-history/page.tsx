import {
  ViewDepositHistory,
} from "~/features/deposit/components/view-deposit-history"
import {
  ViewDepositHistoryAdmin,
} from "~/features/deposit/components/view-deposit-history-admin"
import {
  redirect,
} from "~/i18n"
import {
  getServerAuthSession,
} from "~/server/auth"

export const metadata = {
  title: "Lịch sử nạp tiền",
}

export default async function DepositsPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/login")
  }

  const isAdmin = session?.user.role.id === 1

  return (
    <div className="p-8">
      {isAdmin ? <ViewDepositHistoryAdmin /> : <ViewDepositHistory />}
    </div>
  )
}
