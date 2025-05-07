import {
  UpdatePermission,
} from "~/features/permission/components/update-permission"

export const metadata = {
  title: "Cập nhật quyền",
}

export default function UpdatePermissionPage({ params }: { params: {
  id: number
} }) {
  return (
    <UpdatePermission id={params.id} />
  )
}
