import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"

import {
  getAllRoles,
} from "~/features/role/api/role"
import {
  type BaseComboboxProps, Combobox,
} from "~/shared/components/inputs/combobox"

export function RoleSelect(props: BaseComboboxProps<number>) {
  const {
    data: options,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAllRoles"],
    queryFn: getAllRoles,
    select: (data) => {
      return data.data ?? []
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
