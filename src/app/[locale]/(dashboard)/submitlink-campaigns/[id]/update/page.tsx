import {
  UpdateSubmitlinkCampaigns,
} from "~/features/submitlink-campaigns/components/update-submitlink-campaigns"

export const metadata = {
  title: "Cập nhật chiến dịch Submit Link",
}
export default function UpdateSubmitlinkCampaignsPage({ params }: { params: {
  id: number
} }) {
  return (
    <UpdateSubmitlinkCampaigns id={params.id} />
  )
}
