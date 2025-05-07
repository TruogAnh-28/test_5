import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"

import {
  searchUsers,
} from "~/features/user/api/user"
import {
  type BaseComboboxProps, Combobox,
} from "~/shared/components/inputs/combobox"

export function UserSelect(props: BaseComboboxProps<number>) {
  const {
    data: options,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["searchUsers"],
    queryFn: () => searchUsers({
      key: "",
      limit: 0,
      page: 0,
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
          label: value => value.username,
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
