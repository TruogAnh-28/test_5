import {
  z,
} from "zod"

import {
  type PermissionCode,
} from "~/types/permission-code"

export const loginInputSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(
    1, "Password is required"
  ),
})

export type LoginInput = z.infer<typeof loginInputSchema>

export const registerInputSchema = z.object({
  username: z.string().min(
    1, "Username is required"
  ),
  email: z.string().email("Invalid email format"),
  password: z.string().min(
    6, "Password must be at least 6 characters"
  ),
  password_confirm: z.string().min(
    1, "Please confirm your password"
  ),
}).refine(
  data => data.password === data.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  }
)

export type RegisterInput = z.infer<typeof registerInputSchema>

export const loginGoogleInputSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  googleId: z.string(),
})

export type LoginGoolgeInput = z.infer<typeof loginGoogleInputSchema>

export type Role = {
  id: number
  name: string
  isDeleted: boolean
}
export type LoginUser = {
  id: number
  name: string
  token: string
  permission: PermissionCode
  image_link: string
  email: string
  gender: number
  phone: string
  address: string
  birth_date: string
  permissions: string[]
  walletId: number
  role: Role
}

export const changePasswordInputSchema = z.object({
  old_password: z.string().min(
    1, "Old password is required"
  ),
  new_password: z.string().min(
    1, "New password is required"
  ),
  password_confirm: z.string().min(
    1, "Please confirm your new password"
  ),
}).refine(
  data => data.new_password === data.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  }
)

export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>

export const updateProfileInputSchema = z.object({
  name: z.string().min(
    1, "Name is required"
  ),
  gender: z.coerce.number().min(
    -1, "Please select a gender"
  ),
  phone: z.string().min(
    1, "Phone number is required"
  ),
  address: z.string(),
  birth_date: z.string(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>
