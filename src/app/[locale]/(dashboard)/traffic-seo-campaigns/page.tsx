import {
  ViewTrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/components/view-traffic-seo-campaigns"
import {
  ViewTrafficSeoCampaignsAdmin,
} from "~/features/traffic-seo-campaigns/components/view-traffic-seo-campaigns-admin"
import {
  redirect,
} from "~/i18n"
import {
  getServerAuthSession,
} from "~/server/auth"

export const metadata = {
  title: "Chiến dịch Traffic SEO",
}

export default async function TrafficSeoCampaignsPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/login")
  }

  const isAdmin = session?.user.role.id === 1
  return (
    <div className="p-8">
      {isAdmin ? <ViewTrafficSeoCampaignsAdmin /> : <ViewTrafficSeoCampaigns />}
    </div>
  )
}
