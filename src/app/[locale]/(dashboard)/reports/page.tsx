import {
  AdminCampaignReportsView,
} from "~/features/reports/components/admin-campaign-reports-view"
import {
  CampaignReportsView,
} from "~/features/reports/components/campaign-reports-view"
import {
  redirect,
} from "~/i18n"
import {
  getServerAuthSession,
} from "~/server/auth"

export const metadata = {
  title: "Báo cáo",
}
export default async function ReportsPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/login")
  }

  const isAdmin = session?.user.role.id === 1
  return (
    <div className="p-8">
      {isAdmin ? <AdminCampaignReportsView /> : <CampaignReportsView />}
    </div>
  )
}
