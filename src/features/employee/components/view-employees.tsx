"use client"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  Plus,
} from "lucide-react"

import {
  useUrlState,
} from "~/shared/hooks/state/use-url-state"

import {
  searchEmployees,
} from "~/features/employee/api/employee"
import {
  EmployeesTable,
} from "~/features/employee/components/tables/employee-table"
import {
  Link,
} from "~/i18n"
import {
  Button,
} from "~/shared/components/ui/button"

export function ViewEmployees() {
  const defaultFilters = {
    key: "",
    page: 1,
    limit: 10,
    role_ids: [],
  }
  const [
    filters,
    setFilters,
  ] = useUrlState(defaultFilters)
  const {
    data: employees, refetch, isLoading, error,
  } = useQuery({
    queryKey: [
      "searchEmployees",
      filters,
    ],
    queryFn: () => searchEmployees(filters),
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">

        <h1 className="text-xl font-semibold font-[Phudu] capitalize">Danh sách nhân viên</h1>

        <Button asChild>
          <Link
            href="/employees/create"
          >
            <Plus />
            Tạo nhân viên
          </Link>
        </Button>
      </div>

      <EmployeesTable
        data={employees?.data.list || []}
        total={employees?.data.total}
        filters={filters}
        onFiltersChange={setFilters}
        error={error}
        isLoading={isLoading}
        onDeleteSuccess={
          () => {
            refetch()
          }
        }
      />
    </div>

  )
}
