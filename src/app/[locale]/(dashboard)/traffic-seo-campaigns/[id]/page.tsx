import {
  CampaignDetailView,
} from "~/features/traffic-seo-campaigns/components/campaign-detail-view"

export const metadata = {
  title: "Cập nhật chiến dịch Traffic SEO",
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-8">
      <CampaignDetailView id={parseInt(params.id)} />
    </div>
  )
}
