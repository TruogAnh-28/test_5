import {
  RoleForm,
} from "~/features/role/components/forms/role-form"

export const metadata = {
  title: "Tạo chức vụ",
}

export default function CreateRolePage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-row items-center justify-between">

        <h1 className="text-xl font-semibold capitalize">Tạo chức vụ mới</h1>

      </div>

      <RoleForm isCreate />
    </div>
  )
}
