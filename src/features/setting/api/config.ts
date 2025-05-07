import {
  type Config, type ConfigInput, type ConfigName,
} from "~/features/setting/type/config"
import {
  api,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const getConfigs = async () => {
  const response = await api.get<ApiResponse<Config[]>>("/configs",)

  return response
}

export const createConfig = async (data: ConfigInput) => {
  const response = await api.post<ApiResponse<Config>>(
    "/configs",
    data
  )

  return response
}

export const updateConfigByName = async (data: {
  value: string
  name: ConfigName
}) => {
  const response = await api.patch<ApiResponse<Config>>(
    `/configs/${data.name}`,
    {
      value: data.value,
    }
  )

  return response
}
