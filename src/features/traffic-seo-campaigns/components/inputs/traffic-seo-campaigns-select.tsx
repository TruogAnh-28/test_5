// import React from "react"

// import {
//   useQuery,
// } from "@tanstack/react-query"

// import {
//   searchTrafficSeoCampaigns,
// } from "~/features/traffic-seo-campaigns/api/traffic-seo-campaigns"
// import {
//   type BaseComboboxProps, Combobox,
// } from "~/shared/components/inputs/combobox"

// export function TrafficSeoCampignsSelect(props: BaseComboboxProps<number>) {
//   const {
//     data: options,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["searchTrafficSeoCampaigns"],
//     queryFn: () => searchTrafficSeoCampaigns({
//       key: "",
//       limit: 0,
//       page: 0,
//       role_ids: [],
//     }),
//     select: (data) => {
//       return data.data.list ?? []
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
