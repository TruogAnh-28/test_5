import {
  type LoginUser,
} from "~/features/auth/type/auth"
import {
  type SearchEmployees,
  type Employee, type EmployeeInput,
} from "~/features/employee/type/employee"
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

export const getAllEmployees = async () => {
  const response = await api.get<ApiResponse<Employee[]>>("/employees",)

  return response
}

export const getEmployee = async (data: {
  id: number
}) => {
  const response = await api.get<ApiResponse<Employee>>(`/employees/${data.id}`,)

  return response
}

export const createEmployee = async (data: EmployeeInput) => {
  const response = await api.post<ApiResponse<null>>(
    "/employees", data
  )

  return response
}

export const updateEmployee = async (
  id: number, data: EmployeeInput
) => {
  const response = await api.put<ApiResponse<null>>(
    `/employees/${id}`, data
  )

  return response
}

export const deleteEmployee = async (id: number) => {
  const response = await api.delete<ApiResponse<null>>(`/employees/${id}`)

  return response
}

export const updateAvatar = async (data: {
  image_link: string | undefined
}) => {
  const response = await api.post<ApiResponse<null>>(
    "/employees/updateAvatar", data
  )

  return response
}

export const searchEmployees = async (data: SearchEmployees) => {
  const response = await api.post<ApiResponse<{
    list: Employee[]
    total: number
  }>>(
    "/employees/search", data
  )

  return response
}
