// import {
//   useMemo,
// } from "react"

// import {
//   useSession,
// } from "next-auth/react"

// import {
//   handlePermission,
// } from "~/shared/utils/permission"

// import {
//   type PermissionCode,
// } from "~/types/permission-code"

// export interface UserPermissionProps {
//   code?: PermissionCode | PermissionCode[]
//   isSupperAdminOnly?: boolean
// }

// export function usePermission({
//   code, isSupperAdminOnly,
// }: UserPermissionProps) {
//   const { data: session } = useSession()

//   const granted = useMemo(
//     () => handlePermission({
//       code,
//       isSupperAdminOnly,
//       user: session?.user,
//     }), [
//       session?.user,
//       isSupperAdminOnly,
//       code,
//     ]
//   )

//   return granted
// }
