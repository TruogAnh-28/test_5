"use client"

import {
  useQuery,
} from "@tanstack/react-query"

import {
  getConfigs,
} from "~/features/setting/api/config"
import {
  SettingSection,
} from "~/features/setting/components/setting-section"
import {
  Loading,
} from "~/shared/components/shared/loading"
import {
  Card,
} from "~/shared/components/ui/card"

export function ViewSetting() {
  const {
    data: configs, refetch, isLoading,
  } = useQuery({
    queryKey: ["getSetting"],
    queryFn: getConfigs,
    select: (data) => {
      return data.data
    },
  })
  return (
    <Card className="p-8 space-y-8">
      <h1 className="text-lg font-bold">Chỉnh sửa cấu hình</h1>

      {
        isLoading
          ? <Loading />
          : configs?.map(config => (
            <SettingSection
              key={config.id}
              config={config}
              onSubmitSuccess={refetch}
            />
          ))
      }
    </Card>
  )
}
