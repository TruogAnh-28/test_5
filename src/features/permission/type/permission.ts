import {
  z,
} from "zod"

export const permissionInputSchema = z.object({
  name: z.string().min(
    0, "Vui lòng nhập tên chức vụ"
  ),
  code: z.string().min(
    0, "Vui lòng nhập mã quyền"
  ),
  status: z.coerce.number(),
})

export type PermissionInput = z.infer<typeof permissionInputSchema>

export type Permission = {
  id: number
  name: string
  code: string
  status: number
  isChecked?: boolean
}

export type SearchPermissions = {
  key: string
  page: number
  limit: number
}
