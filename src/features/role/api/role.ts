import {
  type SearchRoles,
  type Role, type RoleInput,
} from "~/features/role/type/role"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const getMe = async () => {
  const response = await api.get<ApiResponse<Role>>("/roles/getMe",)

  return response
}

export const getAllRoles = async () => {
  const response = await api.get<ApiResponse<Role[]>>("/roles",)

  return response
}

export const getRole = async (data: {
  id: number
}) => {
  const response = await api.get<ApiResponse<Role>>(`/roles/${data.id}`,)

  return response
}

export const createRole = async (data: RoleInput) => {
  const response = await api.post<ApiResponse<null>>(
    "/roles", data
  )

  return response
}

export const updateRole = async (
  id: number, data: RoleInput
) => {
  const response = await api.put<ApiResponse<null>>(
    `/roles/${id}`, data
  )

  return response
}

export const deleteRole = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(`/roles/${id}`)

  return response
}

export const searchRoles = async (data: SearchRoles) => {
  const response = await api.post<ApiResponse<{
    list: Role[]
    total: number
  }>>(
    "/roles/search", data
  )

  return response
}
