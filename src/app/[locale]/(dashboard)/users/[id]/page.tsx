import {
  UpdateUser,
} from "~/features/user/components/update-user"

export const metadata = {
  title: "Cập nhật người dùng",
}
export default function UpdateUserPage({ params }: { params: {
  id: number
} }) {
  return (
    <UpdateUser id={params.id} />
  )
}
