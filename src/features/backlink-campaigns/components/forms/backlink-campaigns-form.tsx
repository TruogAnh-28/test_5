"use client"

import React from "react"

import {
  zodResolver,
} from "@hookform/resolvers/zod"
import {
  Plus, Trash, Calendar, ChevronDown, ChevronRight, Link as LinkIcon,
} from "lucide-react"
import {
  type SubmitHandler, useForm, useFieldArray,
} from "react-hook-form"
import {
  toast,
} from "sonner"

const DistributionOptions = [
  {
    label: "Ngày",
    value: "day",
  },
  {
    label: "Tháng",
    value: "month",
  },
  {
    label: "Năm",
    value: "year",
  },
]

const DeviceOptions = [
  {
    label: "Desktop",
    value: "desktop",
  },
  {
    label: "Mobile",
    value: "mobile",
  },
  {
    label: "Tablet",
    value: "tablet",
  },
  {
    label: "All Devices",
    value: "all",
  },
]

import {
  createBacklinkCampaigns, updateBacklinkCampaigns,
} from "~/features/backlink-campaigns/api/backlink-campaigns"
import {
  type BacklinkCampaigns, type BacklinkCampaignsInput,
  backlinkCampaignsSchema,
} from "~/features/backlink-campaigns/type/backlink-campaigns"
import {
  AppForm, type BaseAppFormProps,
} from "~/shared/components/forms/app-form"
import {
  ChipPicker,
} from "~/shared/components/inputs/chip-picker"
import {
  DayPicker,
} from "~/shared/components/inputs/day-picker"
import {
  TextInput,
} from "~/shared/components/inputs/text-input"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Card, CardContent, CardHeader, CardTitle,
} from "~/shared/components/ui/card"
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "~/shared/components/ui/collapsible"
import {
  FormControl,
  FormField, FormItem, FormLabel, FormMessage,
} from "~/shared/components/ui/form"

export interface BacklinkCampaignsFormProps extends BaseAppFormProps {
  onSubmitSuccess?: () => void
  values?: BacklinkCampaigns
}

export function BacklinkCampaignsForm({
  onSubmitSuccess, ...props
}: BacklinkCampaignsFormProps) {
  const form = useForm<BacklinkCampaignsInput>({
    resolver: zodResolver(backlinkCampaignsSchema),
    defaultValues: {
      name: "",
      type: "traffic-seo",
      device: "all",
      timeCode: "",
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
      totalTraffic: 0,
      cost: 0,
      domain: "",
      search: "",
      status: "active",
      keywords: [],
      links: [],
    },
    values: props.values && {
      ...props.values,
      startDate: props.values.startDate instanceof Date ? props.values.startDate.toISOString() : props.values.startDate,
      endDate: props.values.endDate instanceof Date ? props.values.endDate.toISOString() : props.values.endDate,
      keywords: props.values.keywords || [],
      links: props.values.links || [],
    },
  })

  const {
    fields: keywordFields, append: appendKeyword, remove: removeKeyword,
  } = useFieldArray({
    control: form.control,
    name: "keywords",
  })

  const {
    fields: linkFields, append: appendLink, remove: removeLink,
  } = useFieldArray({
    control: form.control,
    name: "links",
  })

  const [
    openKeywordItems,
    setOpenKeywordItems,
  ] = React.useState<Record<number, boolean>>({
  })
  const [
    openLinkItems,
    setOpenLinkItems,
  ] = React.useState<Record<number, boolean>>({
  })

  const toggleKeywordItem = (index: number) => {
    setOpenKeywordItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }
  const toggleLinkItem = (index: number) => {
    setOpenLinkItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleSubmit: SubmitHandler<BacklinkCampaignsInput> = React.useCallback(
    async (data) => {
      try {
        if (props.isCreate) {
          const response = await createBacklinkCampaigns(data)
          toast.success(response.message || "Chiến dịch đã được tạo thành công")
          onSubmitSuccess?.()
          return
        }

        const response = await updateBacklinkCampaigns(
          props.values?.id || 0, data
        )

        toast.success(response.message || "Cập nhật chiến dịch thành công")
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
      title="chiến dịch"
    >
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chiến dịch</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={
                  ({ field }) =>
                    (
                      <FormItem>
                        <FormLabel required>Tên chiến dịch</FormLabel>

                        <FormControl>
                          <TextInput
                            {...field}
                            placeholder="Nhập tên chiến dịch"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )
                }
              />

              <FormField
                control={form.control}
                name="domain"
                render={
                  ({ field }) =>
                    (
                      <FormItem>
                        <FormLabel required>Tên miền</FormLabel>

                        <FormControl>
                          <TextInput
                            {...field}
                            placeholder="Nhập tên miền (ví dụ: example.com)"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )
                }
              />

              <FormField
                control={form.control}
                name="search"
                render={
                  ({ field }) =>
                    (
                      <FormItem>
                        <FormLabel>Công cụ tìm kiếm</FormLabel>

                        <FormControl>
                          <TextInput
                            {...field}
                            placeholder="Nhập công cụ tìm kiếm (ví dụ: Google)"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )
                }
              />

              <FormField
                control={form.control}
                name="timeCode"
                render={
                  ({ field }) =>
                    (
                      <FormItem>
                        <FormLabel>Thời gian lấy mã</FormLabel>

                        <FormControl>
                          <TextInput
                            {...field}
                            placeholder="Nhập thời gian lấy mã"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )
                }
              />

              <FormField
                control={form.control}
                name="totalTraffic"
                render={
                  ({ field }) =>
                    (
                      <FormItem>
                        <FormLabel required>Tổng traffic</FormLabel>

                        <FormControl>
                          <TextInput
                            {...field}
                            type="number"
                            placeholder="Nhập tổng traffic (ví dụ: 1000)"
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )
                }
              />

              <FormField
                control={form.control}
                name="cost"
                render={
                  ({ field }) =>
                    (
                      <FormItem>
                        <FormLabel required>Chi phí</FormLabel>

                        <FormControl>
                          <TextInput
                            {...field}
                            type="number"
                            placeholder="Nhập chi phí"
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )
                }
              />

              <FormField
                control={form.control}
                name="startDate"
                render={
                  ({ field }) =>
                    (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày bắt đầu</FormLabel>

                        <DayPicker
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={date => field.onChange(date?.toISOString())}
                          TriggerComponent={
                            (
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <Calendar className="mr-2 size-4" />

                                {field.value ? new Date(field.value).toLocaleDateString("vi-VN") : "Chọn ngày bắt đầu"}
                              </Button>
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
                name="endDate"
                render={
                  ({ field }) =>
                    (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày kết thúc</FormLabel>

                        <DayPicker
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={date => field.onChange(date?.toISOString())}
                          TriggerComponent={
                            (
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <Calendar className="mr-2 size-4" />

                                {field.value ? new Date(field.value).toLocaleDateString("vi-VN") : "Chọn ngày kết thúc"}
                              </Button>
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
                name="device"
                render={
                  ({ field }) => (
                    <FormItem>
                      <FormLabel>Thiết bị</FormLabel>

                      <ChipPicker
                        options={DeviceOptions}
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
          </CardContent>
        </Card>

        {/* Keywords Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Từ khóa</CardTitle>

              <Button
                type="button"
                onClick={
                  () => {
                    const newIndex = keywordFields.length
                    appendKeyword({
                      name: "",
                      url: [],
                      distribution: "EVEN",
                      traffic: 0,
                    })
                    // Mở từ khóa mới tự động
                    setOpenKeywordItems(prev => ({
                      ...prev,
                      [newIndex]: true,
                    }))
                  }
                }
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                <Plus className="size-4 mr-2" />
                Thêm từ khóa
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {
                keywordFields.length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    Chưa có từ khóa nào. Hãy thêm từ khóa cho chiến dịch.
                  </p>
                )
              }

              {
                keywordFields.map((
                  field, index
                ) => (
                  <Collapsible
                    key={field.id}
                    open={openKeywordItems[index]}
                    onOpenChange={() => toggleKeywordItem(index)}
                    className="border rounded-lg"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="p-0 h-auto flex items-center gap-2 hover:bg-transparent"
                          >
                            {openKeywordItems[index] ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}

                            <div className="flex items-center">
                              <h4 className="text-sm font-semibold">
                                Từ khóa #
                                {index + 1}

                                {field.name ? `: ${field.name}` : ""}
                              </h4>
                            </div>
                          </Button>
                        </CollapsibleTrigger>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeKeyword(index)}
                          className="size-8 hover:text-destructive hover:bg-destructive/20"
                        >
                          <Trash className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-4">
                        <div className="grid lg:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`keywords.${index}.name`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>Tên từ khóa</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      placeholder="Nhập tên từ khóa"
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`keywords.${index}.traffic`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>Traffic</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      type="number"
                                      placeholder="Nhập traffic cho từ khóa này"
                                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`keywords.${index}.distribution`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>Phân phối</FormLabel>

                                  <ChipPicker
                                    options={DistributionOptions}
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

                        <FormField
                          control={form.control}
                          name={`keywords.${index}.url`}
                          render={
                            ({ field }) => (
                              <FormItem>
                                <FormLabel>URLs</FormLabel>

                                <div className="space-y-2">
                                  {
                                    field.value ? field.value.map((
                                      url, urlIndex
                                    ) => (
                                      <div
                                        key={url || `empty-url-${urlIndex}`}
                                        className="flex gap-2"
                                      >
                                        <FormControl>
                                          <TextInput
                                            value={url}
                                            onChange={
                                              (e) => {
                                                const newUrls = [...field.value]
                                                newUrls[urlIndex] = e.target.value
                                                field.onChange(newUrls)
                                              }
                                            }
                                            placeholder="https://example.com/page"
                                            className="flex-1"
                                          />
                                        </FormControl>

                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={
                                            () => {
                                              const newUrls = [...field.value]
                                              newUrls.splice(
                                                urlIndex, 1
                                              )
                                              field.onChange(newUrls)
                                            }
                                          }
                                          className="size-8 hover:text-destructive hover:bg-destructive/20"
                                        >
                                          <Trash className="size-4" />
                                        </Button>
                                      </div>
                                    )) : null
                                  }

                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={
                                      () => field.onChange([
                                        ...field.value,
                                        "",
                                      ])
                                    }
                                    className="w-full"
                                  >
                                    <Plus className="size-4 mr-2" />
                                    Thêm URL
                                  </Button>
                                </div>

                                <FormMessage />
                              </FormItem>
                            )
                          }
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))
              }
            </div>
          </CardContent>
        </Card>

        {/* Links Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Liên kết</CardTitle>

              <Button
                type="button"
                onClick={
                  () => {
                    const newIndex = linkFields.length
                    appendLink({
                      link: "",
                      linkTo: "",
                      distribution: "",
                      traffic: 0,
                      anchorText: "",
                      status: "active",
                    })
                    // Mở liên kết mới tự động
                    setOpenLinkItems(prev => ({
                      ...prev,
                      [newIndex]: true,
                    }))
                  }
                }
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                <Plus className="size-4 mr-2" />
                Thêm liên kết
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {
                linkFields.length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-4">
                    Chưa có liên kết nào. Hãy thêm liên kết cho chiến dịch.
                  </p>
                )
              }

              {
                linkFields.map((
                  field, index
                ) => (
                  <Collapsible
                    key={field.id}
                    open={openLinkItems[index]}
                    onOpenChange={() => toggleLinkItem(index)}
                    className="border rounded-lg"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="p-0 h-auto flex items-center gap-2 hover:bg-transparent"
                          >
                            {openLinkItems[index] ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}

                            <div className="flex items-center">
                              <LinkIcon className="size-4 mr-2" />

                              <h4 className="text-sm font-semibold">
                                Liên kết #
                                {index + 1}

                                {field.link ? `: ${field.link}` : ""}
                              </h4>
                            </div>
                          </Button>
                        </CollapsibleTrigger>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLink(index)}
                          className="size-8 hover:text-destructive hover:bg-destructive/20"
                        >
                          <Trash className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-4">
                        <div className="grid lg:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`links.${index}.link`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>Link nguồn</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      placeholder="Nhập link nguồn"
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`links.${index}.linkTo`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>Link đích</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      placeholder="Nhập link đích"
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`links.${index}.distribution`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>Phân phối</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      placeholder="Nhập cách phân phối"
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`links.${index}.traffic`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>Traffic</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      type="number"
                                      placeholder="Nhập traffic cho liên kết này"
                                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`links.${index}.anchorText`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>Anchor Text</FormLabel>

                                  <FormControl>
                                    <TextInput
                                      {...field}
                                      placeholder="Nhập anchor text"
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )
                            }
                          />

                          <FormField
                            control={form.control}
                            name={`links.${index}.status`}
                            render={
                              ({ field }) => (
                                <FormItem>
                                  <FormLabel>Trạng thái</FormLabel>

                                  <ChipPicker
                                    options={
                                      [
                                        {
                                          label: "Hoạt động",
                                          value: "ACTIVE",
                                        },
                                        {
                                          label: "Vô hiệu",
                                          value: "INACTIVE",
                                        },
                                        {
                                          label: "Đang xử lý",
                                          value: "PROCESSING",
                                        },
                                      ]
                                    }
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
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </AppForm>
  )
}
