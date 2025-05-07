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
  searchRoles,
} from "~/features/role/api/role"
import {
  RolesTable,
} from "~/features/role/components/tables/role-table"
import {
  Link,
} from "~/i18n"
import {
  PermissionComponent,
} from "~/shared/components/shared/permission-component"
import {
  Button,
} from "~/shared/components/ui/button"

export function ViewRoles() {
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
    data: roles, refetch, isLoading, error,
  } = useQuery({
    queryKey: [
      "searchRoles",
      filters,
    ],
    queryFn: () => searchRoles(filters),
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">

        <h1 className="text-xl font-semibold capitalize">Danh sách chức vụ</h1>

        <PermissionComponent code="create-role">
          <Button asChild>
            <Link
              href="/roles/create"
            >
              <Plus />
              Tạo chức vụ
            </Link>
          </Button>
        </PermissionComponent>
      </div>

      <RolesTable
        data={roles?.data.list || []}
        total={roles?.data.total}
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
