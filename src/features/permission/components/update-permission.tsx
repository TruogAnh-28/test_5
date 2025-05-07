"use client"

import {
  useQuery,
} from "@tanstack/react-query"

import {
  getPermission,
} from "~/features/permission/api/permission"
import {
  PermissionForm,
} from "~/features/permission/components/forms/permission-form"
import {
  Loading,
} from "~/shared/components/shared/loading"

export function UpdatePermission({ id }: { id: number }) {
  const {
    data: permission, isLoading,
  } = useQuery({
    queryKey: ["getPermission"],
    queryFn: () => getPermission({
      id,
    }),
  })
  if (isLoading) return <Loading />
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-row items-center justify-between">

        <h1 className="text-xl font-semibold capitalize">Chỉnh sửa quyền</h1>

      </div>

      <PermissionForm
        values={permission?.data}
      />
    </div>
  )
}
