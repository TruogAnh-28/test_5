import {
  UpdateBacklinkCampaigns,
} from "~/features/backlink-campaigns/components/update-backlink-campaigns"

export const metadata = {
  title: "Cập nhật chiến dịch Backlink",
}
export default function UpdateBacklinkCampaignsPage({ params }: { params: {
  id: number
} }) {
  return (
    <UpdateBacklinkCampaigns id={params.id} />
  )
}
