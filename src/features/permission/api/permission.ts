import {
  type SearchPermissions,
  type Permission, type PermissionInput,
} from "~/features/permission/type/permission"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const getMe = async () => {
  const response = await api.get<ApiResponse<Permission>>("/permissions/getMe",)

  return response
}

export const getAllPermissions = async () => {
  const response = await api.get<ApiResponse<Permission[]>>("/permissions",)

  return response
}

export const getPermission = async (data: {
  id: number
}) => {
  const response = await api.get<ApiResponse<Permission>>(`/permissions/${data.id}`,)

  return response
}

export const createPermission = async (data: PermissionInput) => {
  const response = await api.post<ApiResponse<null>>(
    "/permissions", data
  )

  return response
}

export const updatePermission = async (
  id: number, data: PermissionInput
) => {
  const response = await api.put<ApiResponse<null>>(
    `/permissions/${id}`, data
  )

  return response
}

export const deletePermission = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(`/permissions/${id}`)

  return response
}

export const searchPermissions = async (data: SearchPermissions) => {
  const response = await api.post<ApiResponse<{
    list: Permission[]
    total: number
  }>>(
    "/permissions/search", data
  )

  return response
}
