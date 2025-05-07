import {
  ViewPermissions,
} from "~/features/permission/components/view-permissions"

export const metadata = {
  title: "Quản lý quyền",
}

export default function PermissionsPage() {
  return (
    <div className="p-8">
      <ViewPermissions />
    </div>
  )
}
