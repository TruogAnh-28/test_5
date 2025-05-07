/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
// import {
//   useSessionStore,
// } from "~/shared/hooks/data/use-session"

import {
  type LoginUser,
} from "~/features/auth/type/auth"
import {
  type PermissionCode,
} from "~/types/permission-code"

export function handlePermission({
  code, isSupperAdminOnly, user, initialValue = false,
}: {
  code?: PermissionCode | PermissionCode[]
  initialValue?: boolean
  isSupperAdminOnly?: boolean
  user?: LoginUser
} = {
}) {
  let granted = initialValue
  if (!isSupperAdminOnly && Array.isArray(code)) {
    granted = code.some(it => user?.permissions.includes(it))
  }

  if (!isSupperAdminOnly && typeof code === "string") {
    granted = user?.permissions.includes(code)!
  }

  return granted
}

/**
 * kiểm tra nhanh
 */
export function granted(
  user: LoginUser | undefined, code?: PermissionCode | PermissionCode[], isSupperAdminOnly?: boolean
) {
  return handlePermission({
    code,
    isSupperAdminOnly,
    user,
  })
}
