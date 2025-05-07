import {
  z,
} from "zod"

export const configNameList = [
  "APP_NAME",
  "VND_TO_CREDIT",
  "USD_TO_CREDIT",
  "KEYWORD_TRAFFIC_COST",
  "LINK_TRAFFIC_COST",
  "MAX_CAMPAIGN",
] as const

// 2. Tạo kiểu từ danh sách trên
export type ConfigName = typeof configNameList[number]

export const configInputSchema = z.object({
  name: z.enum(
    configNameList, {
      required_error: "Vui lòng chọn tên config",
    }
  ),
  value: z.string().min(
    1, "Vui lòng nhập giá trị config"
  ),
})

export type ConfigInput = z.infer<typeof configInputSchema>

export type Config = {
  id: number
  name: ConfigName
  value: any
  createdAt: string
  updatedAt: string
}

export type ConfigContent = {
  configName: ConfigName
  description: string
  nameModified: string
}
