import {
  ViewUsers,
} from "~/features/user/components/view-users"

export const metadata = {
  title: "Quản lý người dùng",
}
export default function UsersPage() {
  return (
    <div className="p-8">
      <ViewUsers />
    </div>
  )
}
