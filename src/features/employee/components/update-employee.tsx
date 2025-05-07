"use client"

import {
  useQuery,
} from "@tanstack/react-query"

import {
  getEmployee,
} from "~/features/employee/api/employee"
import {
  EmployeeForm,
} from "~/features/employee/components/forms/employee-form"
import {
  Loading,
} from "~/shared/components/shared/loading"

export function UpdateEmployee({ id }: { id: number }) {
  const {
    data: employee, isLoading,
  } = useQuery({
    queryKey: ["getEmployee"],
    queryFn: () => getEmployee({
      id,
    }),
  })
  if (isLoading) return <Loading />
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-row items-center justify-between">

        <h1 className="text-xl font-semibold capitalize">Chỉnh sửa tài khoản</h1>

      </div>

      <EmployeeForm
        values={employee?.data}
      />
    </div>
  )
}
