"use client"

import React from "react"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  format, getYear,
} from "date-fns"
import {
  CalendarIcon,
} from "lucide-react"
import {
  useSession,
} from "next-auth/react"
import {
  type SubmitHandler,
  useForm,
} from "react-hook-form"
import {
  toast,
} from "sonner"

import {
  updateProfile,
} from "~/features/auth/api/auth"
import {
  type UpdateProfileInput,
  updateProfileInputSchema,
} from "~/features/auth/type/auth"
import {
  ChipPicker,
} from "~/shared/components/inputs/chip-picker"
import {
  DayPicker,
} from "~/shared/components/inputs/day-picker"
import {
  ErrorMessage,
} from "~/shared/components/shared/error-message"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/components/ui/form"
import {
  Input,
} from "~/shared/components/ui/input"
import {
  cn,
} from "~/shared/utils"

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

export function ProfileForm() {
  const {
    data: session, update,
  } = useSession()

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileInputSchema),
    defaultValues: {
      name: "",
      gender: 0,
      phone: "",
      birth_date: "",
      // email: "",
      // address: "",
    },
    values: session?.user
      ? {
        ...session?.user,
        birth_date: session.user.birth_date ? format(
          session.user.birth_date, "yyyy-MM-dd"
        ) : "",

      }
      : undefined,
  })

  const handleSubmit = React.useCallback<SubmitHandler<UpdateProfileInput>>(
    async (data) => {
      try {
        const response = await updateProfile(data)

        await update({
          user: {
            ...session?.user,
            ...data,
          },
        })

        toast.success(response.message ?? "Thành công")
      }
      catch (error) {
        form.setError(
          "root", {
            message: (error as Error).message ?? "Thay đổi thất bại",
          }
        )
      }
    }, []
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid lg:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>

                  <FormControl>
                    <Input {...field} />
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

          <FormField
            control={form.control}
            name="birth_date"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel>Ngày sinh</FormLabel>

                  <DayPicker
                    TriggerComponent={
                      (
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("w-full pl-3 text-left font-normal capitalize")}
                          >
                            {
                              field.value ? format(
                                new Date(field.value), "dd-MM-yyyy"
                              ) : null
                            }

                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      )
                    }
                    fromYear={1900}
                    toYear={getYear(new Date())}
                    captionLayout="dropdown-buttons"
                    mode="single"
                    month={field.value ? new Date(field.value) : undefined} // Cập nhật tháng theo giá trị
                    defaultMonth={field.value ? new Date(field.value) : undefined} // Chỉ dùng khi khởi tạo
                    selected={field.value ? new Date(field.value) : undefined}
                    onMonthChange={
                      (month) => {
                        field.onChange(format(
                          month, "yyyy-MM-dd"
                        ))
                      }
                    }
                    onSelect={
                      (day) => {
                        if (day) {
                          const value = format(
                            day, "yyyy-MM-dd"
                          )
                          field.onChange(value)
                        }
                      }
                    }
                    className="bg-white"
                  />

                  <FormMessage />
                </FormItem>
              )
            }
          />

          {/* <FormField
            control={form.control}
            name="email"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
            }
          /> */}

          <FormField
            control={form.control}
            name="phone"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
            }
          />

          <FormField
            control={form.control}
            name="address"
            render={
              ({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )
            }
          />

          <div className="lg:col-span-2">
            <ErrorMessage
              variant="destructive"
              message={form.formState.errors.root?.message}
            />
          </div>

          <div className="text-end lg:col-span-2">
            <Button
              disabled={!form.formState.isDirty}
              isLoading={form.formState.isSubmitting}
              type="submit"
              className="w-full md:w-auto"
            >
              Lưu Thay đổi
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
