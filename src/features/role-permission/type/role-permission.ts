import {
  z,
} from "zod"

export const rolePermissionInputSchema = z.object({
  roleId: z.coerce.number().min(
    0, "Vui lòng chọn chức vụ"
  ),
  permissionId: z.coerce.number().min(
    0, "Vui lòng chọn quyền"
  ),
})

export type RolePermissionInput = z.infer<typeof rolePermissionInputSchema>

export type RolePermission = {
  id: number
  role_id: number
  permission_id: number
}

export type SearchRolePermissions = {
  key: string
  page: number
  limit: number
  role_id: number
}
export type Permission = {
  createAt: string
  updateAt: string
  id: number
  name: string
  code: string
  isDeleted: boolean
}
export type RolePermissionResponse = {
  permissions: Permission[]
  id: number
  name: string
  createAt: string
  updateAt: string
}
export type PermissionRole = {
  id: number
  name: string
  code: string
}
