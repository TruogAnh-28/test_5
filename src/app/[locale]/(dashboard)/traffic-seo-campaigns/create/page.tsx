import {
  TrafficSeoCampaignsForm,
} from "~/features/traffic-seo-campaigns/components/forms/traffic-seo-campaigns-form"

export const metadata = {
  title: "Tạo chiến dịch Traffic SEO",
}

export default function CreateTrafficSeoCampaignsPage() {
  return (
    <div className="p-8 space-y-8">
      <TrafficSeoCampaignsForm
        isCreate
      />
    </div>
  )
}
