"use client"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  useForm,
} from "react-hook-form"
import {
  toast,
} from "sonner"

import {
  updateConfigByName,
} from "~/features/setting/api/config"
import {
  type Config, type ConfigContent, type ConfigInput, configInputSchema, type ConfigName,
} from "~/features/setting/type/config"
import {
  TextInput,
} from "~/shared/components/inputs/text-input"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"

export interface SettingSectionProps {
  config: Config
  onSubmitSuccess?: () => void
}

const configContentMap: Record<ConfigName, ConfigContent> = {
  APP_NAME: {
    configName: "APP_NAME",
    description: "Chỉnh sửa tên trang web",
    nameModified: "Tên trang web",
  },
  VND_TO_CREDIT: {
    configName: "VND_TO_CREDIT",
    description: "Tỷ giá quy đổi từ VND sang Credit",
    nameModified: "Tỷ giá VND",
  },
  USD_TO_CREDIT: {
    configName: "USD_TO_CREDIT",
    description: "Tỷ giá quy đổi từ USD sang Credit",
    nameModified: "Tỷ giá USD",
  },
  KEYWORD_TRAFFIC_COST: {
    configName: "KEYWORD_TRAFFIC_COST",
    description: "Giá mỗi lượt truy cập từ từ khóa",
    nameModified: "Chi phí từ khóa",
  },
  LINK_TRAFFIC_COST: {
    configName: "LINK_TRAFFIC_COST",
    description: "Giá mỗi lượt truy cập từ liên kết",
    nameModified: "Chi phí liên kết",
  },
  MAX_CAMPAIGN: {
    configName: "MAX_CAMPAIGN",
    description: "Giới hạn số chiến dịch mà người dùng có thể tạo",
    nameModified: "Giới hạn chiến dịch",
  },
}

export function SettingSection({
  config, onSubmitSuccess,
}: SettingSectionProps) {
  const content = configContentMap[config.name]
  const form = useForm<ConfigInput>({
    resolver: zodResolver(configInputSchema),
    values: {
      value: config.value,
      name: config.name,
    },
  })
  const onSubmit = async (data: ConfigInput) => {
    try {
      const result = await updateConfigByName(data)
      toast.success(result.message || "Cập nhật thành công")
      onSubmitSuccess?.()
    }
    catch (error) {
      toast.error((error as Error).message || "Cập nhật thất bại")
    }
  }

  return (
    <div className="border-t border-gray-200 py-8 grid grid-cols-2">
      <div className="">
        <h3 className="font-bold text-medium">
          {content.nameModified}
        </h3>

        <p className="text-sm">{content.description}</p>
      </div>

      <div className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="value"
              render={
                ({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel required>{`Chỉnh sửa ${content.nameModified}`}</FormLabel>

                    <FormControl>
                      <div className="grid grid-cols-[3fr_1fr] gap-4">
                        <TextInput
                          {...field}
                          placeholder="Vui lòng chọn giá trị"
                        />

                        <Button
                          type="submit"
                          isLoading={form.formState.isSubmitting}
                          disabled={!form.formState.isDirty || form.formState.isSubmitting}
                        >
                          Cập nhật
                        </Button>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )
              }
            />
          </form>
        </Form>

      </div>

    </div>
  )
}
