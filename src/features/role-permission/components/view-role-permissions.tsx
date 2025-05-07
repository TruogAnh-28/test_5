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
  searchRolePermissions,
} from "~/features/role-permission/api/role-permission"
import {
  RolePermissionsTable,
} from "~/features/role-permission/components/tables/role-permission-table"
import {
  Link,
} from "~/i18n"
import {
  Button,
} from "~/shared/components/ui/button"

export function ViewRolePermissions() {
  const defaultFilters = {
    key: "",
    page: 1,
    limit: 10,
    role_id: 0,
  }
  const [
    filters,
    setFilters,
  ] = useUrlState(defaultFilters)
  const {
    data: rolePermissions, refetch, isLoading, error,
  } = useQuery({
    queryKey: [
      "searchRolePermissions",
      filters,
    ],
    queryFn: () => searchRolePermissions(filters),
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">

        <h1 className="text-xl font-semibold capitalize">Danh sách chức vụ</h1>

        <Button asChild>
          <Link
            href="/role-permissions/create"
          >
            <Plus />
            Tạo chức vụ
          </Link>
        </Button>
      </div>

      <RolePermissionsTable
        data={rolePermissions?.data.list || []}
        total={rolePermissions?.data.total}
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
