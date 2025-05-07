/* eslint-disable no-restricted-syntax */
"use client"

import React from "react"

import {
  useRouter,
} from "next/navigation"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  useTranslations,
} from "next-intl"
import {
  type SubmitHandler, useForm,
} from "react-hook-form"
import {
  toast,
} from "sonner"

import {
  createUser,
} from "~/features/user/api/user"
import {
  type UserInput,
  createUserInputSchemas,
} from "~/features/user/type/user"
import {
  confirmAlert,
} from "~/shared/components/dialogs/use-confirm-alert"
import {
  AppForm, type BaseAppFormProps,
} from "~/shared/components/forms/app-form"
import {
  ChipPicker,
} from "~/shared/components/inputs/chip-picker"
import {
  TextInput,
} from "~/shared/components/inputs/text-input"
import {
  copyToClipboardWithMeta,
} from "~/shared/components/shared/copy-button"
import {
  FormControl,
  FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"

const generatePassword = (length = 8) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  return password
}

export interface UserFormProps extends BaseAppFormProps {
  onSubmitSuccess?: () => void
  values?: UserInput
}

export function UserForm({
  onSubmitSuccess, ...props
}: UserFormProps) {
  const t = useTranslations("user")
  const router = useRouter()
  const { userUpdateSchema } = createUserInputSchemas(t)
  const RoleOptions = [
    {
      label: t("form.roleOptions.admin"),
      value: 1,
    },
    {
      label: t("form.roleOptions.user"),
      value: 2,
    },
  ]

  const form = useForm<UserInput>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      username: "",
      email: "",
      role_id: 2,
    },
    values: props.values,
  })

  const handleSubmit: SubmitHandler<UserInput> = React.useCallback(
    async (data) => {
      try {
        if (props.isCreate) {
          // Generate a random password
          const password = generatePassword(12)

          // Preparing data according to the API requirements
          const requestData = {
            ...data,
            password,
          }

          const response = await createUser(requestData)

          confirmAlert({
            onAction: () => {
              copyToClipboardWithMeta(password)
              toast.success(t("form.passwordCopied"))
            },
            document: {
              title: t(
                "form.passwordTitle", {
                  password,
                }
              ),
              descriptions: t("form.passwordDescription"),
              action: t("form.copyPassword"),
            },
          })

          toast.success(response.message || t("form.createSuccess"))

          if (onSubmitSuccess) {
            onSubmitSuccess()
          }
          else {
            router.push("/users")
          }
        }

        // For update, ensure we maintain the expected structure
        // const updateData = {
        //   ...data,
        // }

        // const response = await updateUser(
        //   props.values?.id || 0, updateData
        // )

        // toast.success(response.message || t("form.updateSuccess"))

        // if (onSubmitSuccess) {
        //   onSubmitSuccess()
        // }
        // else {
        //   router.push("/users")
        // }
      }
      catch (error) {
        form.setError(
          "root", {
            message: (error as Error).message ?? t("form.requestFailed"),
          }
        )
      }
    }, [
      onSubmitSuccess,
      props,
      router,
      t,
    ]
  )

  return (
    <AppForm
      {...props}
      form={form}
      onSubmit={handleSubmit}
      title={t("form.title")}
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="username"
          render={
            ({ field }) =>
              (
                <FormItem>
                  <FormLabel required>{t("form.fullName")}</FormLabel>

                  <FormControl>
                    <TextInput
                      {...field}
                      placeholder={t("form.placeholders.fullName")}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
          }
        />

        <FormField
          control={form.control}
          name="email"
          render={
            ({ field }) =>
              (
                <FormItem>
                  <FormLabel required>{t("form.email")}</FormLabel>

                  <FormControl>
                    <TextInput
                      {...field}
                      inputMode="email"
                      placeholder={t("form.placeholders.email")}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
          }
        />

        <FormField
          control={form.control}
          name="role_id"
          render={
            ({ field }) => (
              <FormItem>
                <FormLabel>{t("form.role")}</FormLabel>

                <ChipPicker
                  options={RoleOptions}
                  mode="single"
                  value={field.value}
                  onValueChange={value => field.onChange(value)}
                  renderItem={
                    option => (
                      <div className="px-2 py-1.5 pr-3 rounded-full border-2 border-input group-data-[state=checked]:border-primary flex items-center gap-2">
                        <div className="size-4 border-2 rounded-full group-data-[state=checked]:border-4 group-data-[state=checked]:border-primary" />

                        {option.label}
                      </div>
                    )
                  }
                />

                <FormMessage />
              </FormItem>
            )
          }
        />
      </div>
    </AppForm>
  )
}
