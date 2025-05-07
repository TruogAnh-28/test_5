"use client"

import React from "react"

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
  toast,
} from "sonner"

import {
  useUrlState,
} from "~/shared/hooks/state/use-url-state"

import {
  searchBacklinkCampaigns,
} from "~/features/backlink-campaigns/api/backlink-campaigns"
import {
  BacklinkCampaignsTable,
} from "~/features/backlink-campaigns/components/tables/backlink-campaigns-table"
import {
  type SearchBacklinkCampaigns,
} from "~/features/backlink-campaigns/type/backlink-campaigns"
import {
  Link,
} from "~/i18n"
import {
  Button,
} from "~/shared/components/ui/button"

export function ViewBacklinkCampaigns() {
  const t = useTranslations("backlinkCampaigns")
  const defaultFilters: SearchBacklinkCampaigns = {
    key: "",
    page: 1,
    limit: 10,
    role_ids: [],
    campaignTypeId: 2,
    status: "",
    device: "",
    domain: "",
    date_range: {
      start_date: "",
      end_date: "",
    },
  }

  const [
    filters,
    setFilters,
  ] = useUrlState<SearchBacklinkCampaigns>(defaultFilters)

  const {
    data: backlinkCampaigns,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "searchBacklinkCampaigns",
      filters,
    ],
    queryFn: () => searchBacklinkCampaigns(filters),
  })

  const handleDeleteSuccess = () => {
    toast.success(t("messages.deleteSuccess"))
    refetch()
  }

  const handleFilterClick = () => {
    refetch()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-semibold font-[Phudu] capitalize">{t("title")}</h1>

        <div className="flex items-center gap-2">
          <Button asChild>
            <Link
              href="/backlink-campaigns/create"
            >
              <Plus className="size-4 mr-2" />

              {t("create")}
            </Link>
          </Button>
        </div>
      </div>

      <BacklinkCampaignsTable
        data={backlinkCampaigns?.data.list || []}
        total={backlinkCampaigns?.data.total}
        filters={filters}
        onFiltersChange={setFilters}
        onFilterClick={handleFilterClick}
        onDeleteSuccess={handleDeleteSuccess}
        error={error}
        isLoading={isLoading}
        hasFilters
        hasReset
      />
    </div>
  )
}
