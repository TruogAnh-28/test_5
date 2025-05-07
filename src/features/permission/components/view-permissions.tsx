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
  searchPermissions,
} from "~/features/permission/api/permission"
import {
  PermissionsTable,
} from "~/features/permission/components/tables/permission-table"
import {
  Link,
} from "~/i18n"
import {
  PermissionComponent,
} from "~/shared/components/shared/permission-component"
import {
  Button,
} from "~/shared/components/ui/button"

export function ViewPermissions() {
  const defaultFilters = {
    key: "",
    page: 1,
    limit: 10,
  }
  const [
    filters,
    setFilters,
  ] = useUrlState(defaultFilters)
  const {
    data: permissions, refetch, isLoading, error,
  } = useQuery({
    queryKey: [
      "searchPermissions",
      filters,
    ],
    queryFn: () => searchPermissions(filters),
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">

        <h1 className="text-xl font-semibold capitalize">Danh sách quyền</h1>

        <PermissionComponent code="create-permission">
          <Button asChild>
            <Link
              href="/permissions/create"
            >
              <Plus />
              Tạo quyền
            </Link>
          </Button>
        </PermissionComponent>
      </div>

      <PermissionsTable
        data={permissions?.data.list || []}
        total={permissions?.data.total}
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
