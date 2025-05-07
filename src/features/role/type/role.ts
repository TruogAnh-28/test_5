import {
  z,
} from "zod"

export const roleInputSchema = z.object({
  name: z.string().min(
    0, "Vui lòng nhập tên chức vụ"
  ),
  status: z.coerce.number(),
})

export type RoleInput = z.infer<typeof roleInputSchema>

export type Role = {
  id: number
  name: string
  permissions_count: number
  status: number
  updated_at: string
  created_at: string
}

export type SearchRoles = {
  key: string
  page: number
  limit: number
}
