import {
  ViewBacklinkCampaigns,
} from "~/features/backlink-campaigns/components/view-backlink-campaigns"

export const metadata = {
  title: "Chiến dịch Backlink",
}
export default function TrafficSeoCampaignsPage() {
  return (
    <div className="p-8">
      <ViewBacklinkCampaigns />
    </div>
  )
}
