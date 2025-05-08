import {
  CampaignDetailView,
} from "~/features/submitlink-campaigns/components/campaign-detail-view"

export const metadata = {
  title: "Chi tiết chiến dịch Submit Link",
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <CampaignDetailView id={parseInt(params.id)} />
    </div>
  )
}
