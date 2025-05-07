"use client"

import {
  useQuery,
} from "@tanstack/react-query"

import {
  getRole,
} from "~/features/role/api/role"
import {
  RoleForm,
} from "~/features/role/components/forms/role-form"
import {
  UpdateRolePermissionForm,
} from "~/features/role/components/forms/update-role-permission-form"
import {
  Loading,
} from "~/shared/components/shared/loading"
import {
  Card,
} from "~/shared/components/ui/card"

export function UpdateRole({ id }: { id: number }) {
  const {
    data: role, isLoading,
  } = useQuery({
    queryKey: ["getRole"],
    queryFn: () => getRole({
      id,
    }),
  })
  if (isLoading) return <Loading />
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-row items-center justify-between">

        <h1 className="text-xl font-semibold capitalize">Chỉnh sửa chức vụ</h1>

      </div>

      <RoleForm
        values={role?.data}
      />

      <Card className="p-8 space-y-4">
        <h2 className="text-center text-xl font-bold">Danh sách quyền</h2>

        <UpdateRolePermissionForm role_id={id} />
      </Card>
    </div>
  )
}
