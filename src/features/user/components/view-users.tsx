"use client"

import {
  useQuery,
} from "@tanstack/react-query"
import {
  Plus,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  useUrlState,
} from "~/shared/hooks/state/use-url-state"

import {
  searchUsers,
} from "~/features/user/api/user"
import {
  UsersTable,
} from "~/features/user/components/tables/user-table"
import {
  Link,
} from "~/i18n"
import {
  PermissionComponent,
} from "~/shared/components/shared/permission-component"
import {
  Button,
} from "~/shared/components/ui/button"

export function ViewUsers() {
  const t = useTranslations("user")

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
    data: users,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "searchUsers",
      filters,
    ],
    queryFn: () => searchUsers(filters),
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">{t("title")}</h1>

        <PermissionComponent code="create-user">
          <Button asChild>
            <Link href="/users/create">
              <Plus className="size-4 mr-2" />

              {t("createTitle")}
            </Link>
          </Button>
        </PermissionComponent>
      </div>

      <UsersTable
        data={users?.data.list || []}
        total={users?.data.total}
        filters={filters}
        onFiltersChange={setFilters}
        error={error}
        isLoading={isLoading}
        onDeleteSuccess={() => { refetch() }}
      />
    </div>
  )
}
