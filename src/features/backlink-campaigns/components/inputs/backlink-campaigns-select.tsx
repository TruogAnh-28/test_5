import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"

import {
  searchBacklinkCampaigns,
} from "~/features/backlink-campaigns/api/backlink-campaigns"
import {
  type BaseComboboxProps, Combobox,
} from "~/shared/components/inputs/combobox"

export function BacklinkCampignsSelect(props: BaseComboboxProps<number>) {
  const {
    data: options,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["searchBacklinkCampaigns"],
    queryFn: () => searchBacklinkCampaigns({
      key: "",
      limit: 0,
      page: 0,
      campaignTypeId: 2,
      role_ids: [],
    }),
    select: (data) => {
      return data.data.list ?? []
    },
  })

  return (
    <Combobox
      options={options}
      fieldNames={
        {
          label: value => value.name,
          value: "id",
        }
      }
      isLoading={isLoading}
      isError={isError}
      error={error}
      {...props}
    />
  )
}
