import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"

import {
  getAllPermissions,
} from "~/features/permission/api/permission"
import {
  type BaseComboboxProps, Combobox,
} from "~/shared/components/inputs/combobox"

export function PermissionSelect(props: BaseComboboxProps<number>) {
  const {
    data: options,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getAllPermissions"],
    queryFn: getAllPermissions,
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
