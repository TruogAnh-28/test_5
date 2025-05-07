import {
  UserForm,
} from "~/features/user/components/forms/user-form"

export const metadata = {
  title: "Tạo người dùng",
}

export default function CreateUserPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-row items-center justify-between">

        <h1 className="text-xl font-semibold capitalize">Tạo tài khoản mới</h1>

      </div>

      <UserForm isCreate />
    </div>
  )
}
