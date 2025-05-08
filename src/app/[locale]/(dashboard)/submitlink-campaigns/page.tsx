import {
  ViewSubmitlinkCampaigns,
} from "~/features/submitlink-campaigns/components/view-submitlink-campaigns"
import {
  ViewSubmitlinkCampaignsAdmin,
} from "~/features/submitlink-campaigns/components/view-submitlink-campaigns-admin"
import {
  redirect,
} from "~/i18n"
import {
  getServerAuthSession,
} from "~/server/auth"

export const metadata = {
  title: "Chiến dịch Submit Link",
}

export default async function SubmitlinkCampaignsPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/login")
  }

  const isAdmin = session?.user.role.id === 1
  return (
    <div className="p-8">
      {isAdmin ? <ViewSubmitlinkCampaignsAdmin /> : <ViewSubmitlinkCampaigns />}
    </div>
  )
}
