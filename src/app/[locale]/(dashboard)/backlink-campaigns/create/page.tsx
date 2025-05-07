import {
  BacklinkCampaignsForm,
} from "~/features/backlink-campaigns/components/forms/backlink-campaigns-form"

export const metadata = {
  title: "Tạo chiến dịch Backlink",
}
export default function CreateBacklinkCampaignsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">Tạo chiến dịch Backlink mới</h1>
      </div>

      <BacklinkCampaignsForm
        isCreate
      />
    </div>
  )
}
