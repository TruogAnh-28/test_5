import {
  useTranslations,
} from "next-intl"
import {
  z,
} from "zod"

type TranslationFunction = (key: string, values?: Record<string, string>) => string
export const createUserInputSchemas = (t: TranslationFunction) => {
  const userInputSchema = z.object({
    username: z.string().min(
      1, t("form.placeholders.username")
    ),
    email: z.string().email(t("form.errorMessages.invalidEmail")),
    password: z.string().min(
      1, t("form.placeholders.password")
    ),
    role_id: z.coerce.number().min(
      -1, t("form.placeholders.roleId")
    ),
  })

  const userUpdateSchema = z.object({
    username: z.string().min(
      1, t("form.placeholders.username")
    ),
    email: z.string().email(t("form.errorMessages.invalidEmail")),
    role_id: z.coerce.number().min(
      -1, t("form.placeholders.roleId")
    ),
    password: z.string().optional(),
    id: z.number().optional(),
  })

  return {
    userInputSchema,
    userUpdateSchema,
  }
}
export const useTrafficSeoSchemas = () => {
  const t = useTranslations("user")
  return createUserInputSchemas(t)
}

export type UserInput = z.infer<ReturnType<typeof createUserInputSchemas>["userInputSchema"]>

export type UserUpdateInput = z.infer<ReturnType<typeof createUserInputSchemas>["userUpdateSchema"]>

export type Role = {
  id: number
  name: string
  isDeleted: boolean
  created_at: string
  updated_at: string
}
export type User = {
  created_at: string
  updated_at: string
  id: number
  username: string
  email: string
  isDeleted: boolean
  role: Role
  walletId: number
}

export type SearchUsers = {
  key: string
  limit: number
  page: number
  role_ids: Array<number>
}
