// src/features/reports/components/tables/KeywordsTable.tsx
"use client"

import React from "react"

import {
  ExternalLink,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

import {
  type KeywordAttributes,
} from "~/features/reports/types/report"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "~/shared/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "~/shared/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/shared/components/ui/tooltip"

interface KeywordsTableProps {
  keywords: KeywordAttributes[]
  title: string
  description: string
  emptyMessage: string
}

export function KeywordsTable({
  keywords,
  title,
  description,
  emptyMessage,
}: KeywordsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>

              <TableHead>URLs</TableHead>

              <TableHead>Distribution</TableHead>

              <TableHead className="text-right">Traffic</TableHead>

              <TableHead className="text-right">Progress</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {
              keywords.map((keyword) => {
                const progress = Math.round((keyword.trafficCompleted / keyword.traffic) * 100)
                return (
                  <TableRow key={keyword.id}>
                    <TableCell className="font-medium">{keyword.name}</TableCell>

                    <TableCell>
                      {
                        keyword.urls && keyword.urls.length > 0 ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 cursor-pointer">
                                  <span className="text-sm text-muted-foreground">
                                    {keyword.urls.length}

                                    {" "}

                                    URL
                                    {keyword.urls.length !== 1 ? "s" : ""}
                                  </span>

                                  <ExternalLink className="size-3.5 text-muted-foreground" />
                                </div>
                              </TooltipTrigger>

                              <TooltipContent>
                                <ul className="list-disc pl-4 text-xs">
                                  {
                                    keyword.urls.map(url => (
                                      <li
                                        key={url}
                                        className="mt-1"
                                      >
                                        <a
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline truncate max-w-[250px] inline-block"
                                        >
                                          {url}
                                        </a>
                                      </li>
                                    ))
                                  }
                                </ul>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )
                      }
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#27BDBE]/10 text-[#27BDBE]">
                        {keyword.distribution}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <span className="font-mono">
                        {keyword.trafficCompleted.toLocaleString()}
                        /

                        {keyword.traffic.toLocaleString()}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-[#0c9697] to-[#27BDBE] h-2.5 rounded-full"
                            style={
                              {
                                width: `${progress}%`,
                              }
                            }
                          />
                        </div>

                        <span className="text-xs font-medium">
                          {progress}
                          %
                        </span>

                        {
                          progress >= 100
                            ? <TrendingUp className="size-3.5 text-success" />
                            : progress < 30
                              ? <AlertCircle className="size-3.5 text-amber-500" />
                              : null
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            }

            {
              keywords.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-6"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
