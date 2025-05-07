import React from "react"

import {
  useQuery,
} from "@tanstack/react-query"

import {
  searchEmployees,
} from "~/features/employee/api/employee"
import {
  type BaseComboboxProps, Combobox,
} from "~/shared/components/inputs/combobox"

export function EmployeeSelect(props: BaseComboboxProps<number>) {
  const {
    data: options,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["searchEmployees"],
    queryFn: () => searchEmployees({
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
