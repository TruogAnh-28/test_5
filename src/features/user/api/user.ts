import {
  type LoginUser,
} from "~/features/auth/type/auth"
import {
  type SearchUsers,
  type User, type UserInput,
} from "~/features/user/type/user"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const getMe = async () => {
  const response = await api.get<ApiResponse<LoginUser>>("/auth/getMe",)

  return response
}

export const getAllUsers = async () => {
  const response = await api.get<ApiResponse<User[]>>("/users",)

  return response
}

export const getUser = async (data: {
  id: number
}) => {
  const response = await api.get<ApiResponse<User>>(`/users/${data.id}`,)

  return response
}

export const createUser = async (data: UserInput) => {
  const response = await api.post<ApiResponse<null>>(
    "/users", data
  )

  return response
}

export const updateUser = async (
  id: number, data: UserInput
) => {
  const response = await api.put<ApiResponse<null>>(
    `/users/${id}`, data
  )

  return response
}

export const deleteUser = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(`/users/${id}`)

  return response
}

export const searchUsers = async (data: SearchUsers) => {
  const response = await api.post<ApiResponse<{
    list: User[]
    total: number
  }>>(
    "/users/search", data
  )

  return response
}
