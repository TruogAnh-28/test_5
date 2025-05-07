import {
  type SearchRolePermissions,
  type RolePermission, type RolePermissionInput,
  type RolePermissionResponse,
} from "~/features/role-permission/type/role-permission"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const getAllRolePermissions = async () => {
  const response = await api.get<ApiResponse<RolePermission[]>>("/role-permissions",)

  return response
}

export const getRolePermission = async (data: {
  id: number
}) => {
  const response = await api.get<ApiResponse<RolePermission>>(`/role-permissions/${data.id}`,)

  return response
}

export const createRolePermission = async (data: RolePermissionInput) => {
  const response = await api.post<ApiResponse<null>>(
    "/role-permissions", data
  )

  return response
}

export const updateRolePermission = async (
  id: number, data: RolePermissionInput
) => {
  const response = await api.put<ApiResponse<null>>(
    `/role-permissions/${id}`, data
  )

  return response
}

export const deleteRolePermission = async (data: RolePermissionInput) => {
  const response = await api.delete<ApiResponse<null>>(`/role-permissions/${data.roleId}/${data.permissionId}`,)

  return response
}

export const searchRolePermissions = async (data: SearchRolePermissions) => {
  const response = await api.post<ApiResponse<{
    list: RolePermission[]
    total: number
  }>>(
    "/role-permissions/search", data
  )

  return response
}
export const getRolePermissionByRoleId = async (roleId: number) => {
  const response = await api.get<ApiResponse<RolePermissionResponse>>(`/roles/${roleId}`)

  return response
}
