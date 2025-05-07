import {
  signOut,
} from "next-auth/react"

import {
  type LoginUser,
  type LoginGoolgeInput,
  type LoginInput,
  type RegisterInput,
  type UpdateProfileInput,
} from "~/features/auth/type/auth"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const login = async (data: LoginInput) => {
  const response = await api.post<ApiResponse<LoginUser>>(
    "/auth", data
  )
  return response
}

export const register = async (data: RegisterInput) => {
  const response = await api.post<ApiResponse<null>>(
    "/auth/register", {
      username: data.username,
      email: data.email,
      password: data.password,
    }
  )
  return response
}

export const logOut = async () => {
  signOut({
    callbackUrl: "/en/login",
  })
  return {
    data: null,
    message: "Log out successful!",
    status: true,
  }
}

export const loginGoogle = async (data: LoginGoolgeInput) => {
  const response = await api.post<ApiResponse<LoginUser>>(
    "/auth/goolge-login", data
  )

  return response
}

export const changePassword = async (data: {
  currentPassword: string
  newPassword: string
}) => {
  const response = await api.post<ApiResponse<null>>(
    "/auth/change-password", data
  )

  return response
}

export const updateProfile = async (data: UpdateProfileInput) => {
  const response = await api.post<ApiResponse<null>>(
    "/auth/updateProfile", data
  )

  return response
}
