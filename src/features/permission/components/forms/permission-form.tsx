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
  createPermission, updatePermission,
} from "~/features/permission/api/permission"
import {
  type Permission, type PermissionInput, permissionInputSchema,
} from "~/features/permission/type/permission"
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

export interface PermissionFormProps extends BaseAppFormProps {
  onSubmitSuccess?: () => void
  values?: Permission
}

export function PermissionForm({
  onSubmitSuccess, ...props
}: PermissionFormProps) {
  const form = useForm<PermissionInput>({
    resolver: zodResolver(permissionInputSchema),
    defaultValues: {
      name: "",
      code: "",
      status: 1,
    },
    values: props.values,
  })

  const handleSubmit: SubmitHandler<PermissionInput> = React.useCallback(
    async (data) => {
      try {
        if (props.isCreate) {
          const response = await createPermission(data)

          toast.success(response.message || "Tạo thành công")

          onSubmitSuccess?.()
          return
        }

        const response = await updatePermission(
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
      title="quyền"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={
            ({ field }) =>
              (
                <FormItem>
                  <FormLabel required>Tên quyền</FormLabel>

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

        <FormField
          control={form.control}
          name="code"
          render={
            ({ field }) =>
              (
                <FormItem>
                  <FormLabel required>Mã quyền</FormLabel>

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
