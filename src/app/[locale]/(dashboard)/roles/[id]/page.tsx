import {
  UpdateRole,
} from "~/features/role/components/update-role"

export const metadata = {
  title: "Cập nhật chức vụ",
}
export default function UpdateRolePage({ params }: { params: {
  id: number
} }) {
  return (
    <UpdateRole id={params.id} />
  )
}
