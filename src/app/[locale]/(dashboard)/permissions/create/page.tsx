import {
  PermissionForm,
} from "~/features/permission/components/forms/permission-form"

export const metadata = {
  title: "Tạo quyền",
}

export default function CreatePermissionPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-row items-center justify-between">

        <h1 className="text-xl font-semibold capitalize">Tạo quyền mới</h1>

      </div>

      <PermissionForm isCreate />
    </div>
  )
}
