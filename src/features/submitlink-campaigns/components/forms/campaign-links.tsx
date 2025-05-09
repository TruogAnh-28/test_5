import React, {
  useState,
} from "react"

import {
  ChevronDown, ChevronRight, Link as LinkIcon, Plus, Trash,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"
import {
  type UseFormReturn, useFieldArray,
} from "react-hook-form"

import {
  type SubmitlinkCampaignsInput,
} from "~/features/submitlink-campaigns/type/submitlink-campaigns"
import {
  TextInput,
} from "~/shared/components/inputs/text-input"
import {
  Badge,
} from "~/shared/components/ui/badge"
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

interface CampaignLinksProps {
  form: UseFormReturn<SubmitlinkCampaignsInput>
  linkCost: number
}

export function CampaignLinks({
  form, linkCost,
}: CampaignLinksProps) {
  const t = useTranslations("submitlinkCampaigns")

  const {
    fields: linkFields, append: appendLink, remove: removeLink,
  } = useFieldArray({
    control: form.control,
    name: "links",
  })

  const [
    openLinkItems,
    setOpenLinkItems,
  ] = useState<Record<number, boolean>>({
  })

  const toggleLinkItem = (index: number) => {
    setOpenLinkItems(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>{t("form.links.title")}</CardTitle>

          <div className="flex items-center space-x-4">
            <div className="text-sm flex items-center">
              <Badge
                variant="secondary"
                className="mr-2"
              >
                {t("form.links.count")}

                :

                {" "}

                {linkFields.length}
              </Badge>
            </div>

            <Button
              type="button"
              onClick={
                () => {
                  const newIndex = linkFields.length
                  appendLink({
                    link: "",
                    linkTo: "default.com",
                    distribution: "DAY",
                    traffic: 0,
                    anchorText: "",
                    status: "ACTIVE",
                    url: "",
                    page: "",
                  })
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

              {t("form.links.add")}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {
            linkFields.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                {t("form.links.empty")}
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
                            {t("form.links.link")}

                            {" "}

                            #

                            {index + 1}

                            {form.watch(`links.${index}.link`) ? `: ${form.watch(`links.${index}.link`)}` : ""}
                          </h4>
                        </div>
                      </Button>
                    </CollapsibleTrigger>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="mr-2"
                      >
                        {t("form.links.cost")}

                        :

                        {" "}

                        {linkCost}
                      </Badge>

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
                </div>

                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-4">
                    <FormField
                      control={form.control}
                      name={`links.${index}.link`}
                      render={
                        ({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("form.links.linkSource")}
                            </FormLabel>

                            <FormControl>
                              <TextInput
                                {...field}
                                placeholder={t("form.links.placeholders.linkSource")}
                              />
                            </FormControl>

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
  )
}
