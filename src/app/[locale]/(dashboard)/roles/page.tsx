import {
  ViewRoles,
} from "~/features/role/components/view-roles"

export const metadata = {
  title: "Quản lý chức vụ",
}

export default function RolesPage() {
  return (
    <div className="p-8">
      <ViewRoles />
    </div>
  )
}
