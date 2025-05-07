/* eslint-disable no-restricted-syntax */
"use client"

import React from "react"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  type SubmitHandler, useForm,
} from "react-hook-form"
import {
  toast,
} from "sonner"

import {
  createRole, updateRole,
} from "~/features/role/api/role"
import {
  type Role, type RoleInput, roleInputSchema,
} from "~/features/role/type/role"
import {
  AppForm, type BaseAppFormProps,
} from "~/shared/components/forms/app-form"
import {
  StatusField,
} from "~/shared/components/forms/fields/status-field"
import {
  TextInput,
} from "~/shared/components/inputs/text-input"
import {
  FormControl,
  FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"

export interface RoleFormProps extends BaseAppFormProps {
  onSubmitSuccess?: () => void
  values?: Role
}

export function RoleForm({
  onSubmitSuccess, ...props
}: RoleFormProps) {
  const form = useForm<RoleInput>({
    resolver: zodResolver(roleInputSchema),
    defaultValues: {
      name: "",
      status: 1,
    },
    values: props.values,
  })

  const handleSubmit: SubmitHandler<RoleInput> = React.useCallback(
    async (data) => {
      try {
        if (props.isCreate) {
          const response = await createRole(data)

          toast.success(response.message || "Tạo thành công")

          onSubmitSuccess?.()
          return
        }

        const response = await updateRole(
          props.values?.id || 0, data
        )

        toast.success(response.message || "Cập nhật thành công")

        onSubmitSuccess?.()
      }
      catch (error) {
        form.setError(
          "root", {
            message: (error as Error).message ?? "Yêu cầu thất bại",
          }
        )
      }
    }, [
      onSubmitSuccess,
      props,
    ]
  )

  return (
    <AppForm
      {...props}
      form={form}
      onSubmit={handleSubmit}
      title="chức vụ"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={
            ({ field }) =>
              (
                <FormItem>
                  <FormLabel required>Tên chức vụ</FormLabel>

                  <FormControl>
                    <TextInput
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
          }
        />

        <StatusField />

      </div>

    </AppForm>
  )
}
