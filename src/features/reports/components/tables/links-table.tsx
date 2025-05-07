// src/features/reports/components/tables/LinksTable.tsx
"use client"

import React from "react"

import {
  ExternalLink,
  Link as LinkIcon,
  ArrowUpRight,
} from "lucide-react"

import {
  type LinkAttributes,
} from "~/features/reports/types/report"
import {
  Badge,
} from "~/shared/components/ui/badge"
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

interface LinksTableProps {
  links: LinkAttributes[]
  title: string
  description: string
  emptyMessage: string
  isSourceVisible?: boolean
  isAnchorTextVisible?: boolean
  isStatusVisible?: boolean
  showCreatedAt?: boolean
}

export function LinksTable({
  links,
  title,
  description,
  emptyMessage,
  isSourceVisible = true,
  isAnchorTextVisible = true,
  isStatusVisible = true,
  showCreatedAt = false,
}: LinksTableProps) {
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
              {isSourceVisible ? <TableHead>Source</TableHead> : null}

              <TableHead>Target Page</TableHead>

              {isAnchorTextVisible ? <TableHead>Anchor Text</TableHead> : null}

              {isStatusVisible ? <TableHead>Status</TableHead> : null}

              <TableHead className="text-right">Traffic</TableHead>

              {showCreatedAt ? <TableHead className="text-right">Created At</TableHead> : null}
            </TableRow>
          </TableHeader>

          <TableBody>
            {
              links.map(link => (
                <TableRow key={link.id}>
                  {
                    isSourceVisible ? (
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <LinkIcon className="size-3.5 text-[#27BDBE]" />

                          <a
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate max-w-[160px] inline-block"
                          >
                            {getDomainFromUrl(link.link)}

                            <ExternalLink className="size-3 inline ml-1" />
                          </a>
                        </div>
                      </TableCell>
                    ) : null
                  }

                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate max-w-[160px] inline-block"
                            >
                              {link.page || getDomainFromUrl(link.url)}

                              <ExternalLink className="size-3 inline ml-1" />
                            </a>
                          </div>
                        </TooltipTrigger>

                        <TooltipContent>
                          <p className="text-xs">{link.url}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                  {
                    isAnchorTextVisible ? (
                      <TableCell>
                        <span className="inline-block max-w-[160px] truncate">{link.anchorText}</span>
                      </TableCell>
                    ) : null
                  }

                  {
                    isStatusVisible ? (
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getBadgeClass(link.status)}
                        >
                          {link.status}
                        </Badge>
                      </TableCell>
                    ) : null
                  }

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <span className="font-mono">{link.traffic.toLocaleString()}</span>

                      <ArrowUpRight className="ml-1 size-3.5 text-[#27BDBE]" />
                    </div>
                  </TableCell>

                  {
                    showCreatedAt ? (
                      <TableCell className="text-right text-sm">
                        {
                          link.createdAt
                            ? new Date(link.createdAt).toLocaleDateString("vi-VN")
                            : "-"
                        }
                      </TableCell>
                    ) : null
                  }
                </TableRow>
              ))
            }

            {
              links.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={
                      2
                      + (isSourceVisible ? 1 : 0)
                      + (isAnchorTextVisible ? 1 : 0)
                      + (isStatusVisible ? 1 : 0)
                      + (showCreatedAt ? 1 : 0)
                    }
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

// Helper functions
function getDomainFromUrl(url: string): string {
  try {
    if (!url) return "-"
    if (!url.startsWith("http")) url = `https://${url}`
    return new URL(url).hostname
  }
  catch {
    return url
  }
}

function getBadgeClass(status: string): string {
  const statusClasses: Record<string, string> = {
    ACTIVE: "bg-success/20 text-success border-success/20",
    PAUSED: "bg-amber-500/20 text-amber-500 border-amber-500/20",
    COMPLETED: "bg-blue-500/20 text-blue-500 border-blue-500/20",
  }

  return statusClasses[status.toUpperCase()] || ""
}
