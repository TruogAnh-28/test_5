// import React from "react"

// import {
//   useQuery,
// } from "@tanstack/react-query"

// import {
//   getAllRolePermissions,
// } from "~/features/role-permission/api/role-permission"
// import {
//   type BaseComboboxProps, Combobox,
// } from "~/shared/components/inputs/combobox"

// export function RolePermissionSelect(props: BaseComboboxProps<number>) {
//   const {
//     data: options,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["getAllRolePermissions"],
//     queryFn: getAllRolePermissions,
//     select: (data) => {
//       return data.data ?? []
//     },
//   })

//   return (
//     <Combobox
//       options={options}
//       fieldNames={
//         {
//           label: value => value.name,
//           value: "id",
//         }
//       }
//       isLoading={isLoading}
//       isError={isError}
//       error={error}
//       {...props}
//     />
//   )
// }
