import {
  SubmitlinkCampaignsForm,
} from "~/features/submitlink-campaigns/components/forms/submitlink-campaigns-form"

export const metadata = {
  title: "Tạo chiến dịch Submit Link",
}

export default function CreateSubmitlinkCampaignsPage() {
  return (
    <div className="p-8 space-y-8">
      <SubmitlinkCampaignsForm
        isCreate
      />
    </div>
  )
}
