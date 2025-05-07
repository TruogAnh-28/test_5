import {
  z,
} from "zod"

export const employeeInputSchema = z.object({
  name: z.string().min(
    1, "Vui lòng nhập tên người dùng"
  ),
  email: z.string().email(),
  password: z.string().min(
    0, "Vui lòng nhập mật khẩu"
  ),
  gender: z.coerce.number().min(
    -1, "Vui lòng chọn giới tính"
  ),
  role_id: z.coerce.number().min(
    0, "Vui lòng chọn chức vụ"
  ),

})

export type EmployeeInput = z.infer<typeof employeeInputSchema>

export type Employee = {
  id: number
  name: string
  email: string
  password: string
  created_at: string
  gender: number
  role_id: number
  birth_date: string
  role_name: string
  permissions: string[]
  image_link: string
}

export type SearchEmployees = {
  key: string
  limit: number
  page: number
  role_ids: Array<number>
}
