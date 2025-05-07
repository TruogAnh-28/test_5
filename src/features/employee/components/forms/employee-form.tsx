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

const GenderOptions = [
  {
    label: "Nam",
    value: 1,
  },
  {
    label: "Nữ",
    value: 2,
  },
  {
    label: "Giới tính khác",
    value: 3,
  },
]

import {
  createEmployee, updateEmployee,
} from "~/features/employee/api/employee"
import {
  type Employee, type EmployeeInput, employeeInputSchema,
} from "~/features/employee/type/employee"
import {
  RoleSelect,
} from "~/features/role/components/inputs/role-select"
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

export interface EmployeeFormProps extends BaseAppFormProps {
  onSubmitSuccess?: () => void
  values?: Employee
}

export function EmployeeForm({
  onSubmitSuccess, ...props
}: EmployeeFormProps) {
  const form = useForm<EmployeeInput>({
    resolver: zodResolver(employeeInputSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "password123",
      gender: -1,
      role_id: 0,
    },
    values: props.values,
  })

  const handleSubmit: SubmitHandler<EmployeeInput> = React.useCallback(
    async (data) => {
      try {
        if (props.isCreate) {
          const response = await createEmployee(data)

          confirmAlert({
            onAction: () => {
              copyToClipboardWithMeta("password123")
              toast.success("Sao chép mật khẩu thành công thành công")
            },
            document: {
              title: "Mật khẩu của tài khoản là: password123",
              descriptions: "Mật khẩu sẽ được đến email của tài khoản. Thông báo này chỉ hiển thị một lần.",
              action: "Sao chép mật khẩu",
            },
          })

          toast.success(response.message || "Tạo thành công")

          onSubmitSuccess?.()
          return
        }

        const response = await updateEmployee(
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
      title="nhân viên"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={
            ({ field }) =>
              (
                <FormItem>
                  <FormLabel required>Tên đầy đủ</FormLabel>

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
          name="email"
          render={
            ({ field }) =>
              (
                <FormItem>
                  <FormLabel required>Email</FormLabel>

                  <FormControl>
                    <TextInput
                      {...field}
                      inputMode="email"
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
            ({ field }) =>
              (
                <FormItem>
                  <FormLabel required>Chức vụ</FormLabel>

                  <FormControl>
                    <RoleSelect
                      mode="single"
                      value={field.value}
                      onValueChange={value => field.onChange(value)}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
          }
        />

        <FormField
          control={form.control}
          name="gender"
          render={
            ({ field }) => (
              <FormItem>
                <FormLabel>Giới tính</FormLabel>

                <ChipPicker
                  options={GenderOptions}
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
