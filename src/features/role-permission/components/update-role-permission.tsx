// "use client"

// import { RolePermissionForm } from "~/features/role-permission/components/forms/role-permission-form"
// import { useQuery } from "@tanstack/react-query"
// import { getRolePermission } from "~/features/role-permission/api/role-permission"
// import { Loading } from "~/shared/components/shared/loading"

// export function UpdateRolePermission ({ id} : { id: number}) {
//   const { data: rolePermission, isLoading} = useQuery({
//     queryKey: ["getRolePermission"],
//     queryFn: () => getRolePermission({id})
//   })
//   if (isLoading) return <Loading />
//   return (
//     <div className="p-8 space-y-8">
//             <div className="flex flex-row items-center justify-between">

//               <h1 className="text-xl font-semibold capitalize">Chỉnh sửa tài khoản</h1>

//               </div>
//           <RolePermissionForm
//             values={rolePermission?.data}

//           />
//         </div>
//   )
// }
