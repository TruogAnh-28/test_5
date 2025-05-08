"use client"

import React, {
  useEffect, useState, useRef,
} from "react"

import {
  useInfiniteQuery,
} from "@tanstack/react-query"
import {
  Clock, Smartphone, Laptop, Tablet, AlignJustify, Loader2,
} from "lucide-react"
import {
  useTranslations,
} from "next-intl"

import {
  searchLogbyKeyword,
} from "~/features/traffic-seo-campaigns/api/traffic-seo-campaigns-api-extension"
import {
  SheetHeader, SheetTitle, SheetClose, SheetContent, SheetFooter,
} from "~/shared/components/dialogs/sheet-container"
import {
  Button,
} from "~/shared/components/ui/button"
import {
  Timeline, TimelineItem, TimelineContent,
} from "~/shared/components/ui/timeline"

export interface KeywordLogsSheetProps {
  keywordId: number
  keywordName: string
  onClose: () => void
}

export function KeywordLogsSheet({
  keywordId, keywordName, onClose,
}: KeywordLogsSheetProps) {
  const t = useTranslations("trafficSeoCampaigns")
  const [
    isSheetReady,
    setIsSheetReady,
  ] = useState(false)
  const bottomObserverRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "keywordLogs",
      keywordId,
    ],
    queryFn: ({ pageParam }) => searchLogbyKeyword({
      keywordId,
      page: pageParam,
      limit: 10,
    }),
    initialPageParam: 1,
    getNextPageParam: (
      lastPage, _, lastPageParam
    ) => {
      if (lastPage.data.list.length < 10) {
        return undefined
      }
      return lastPageParam + 1
    },
    select: (data) => {
      return data.pages.flatMap(page => page.data.list) || []
    },
  })

  // Setup intersection observer for infinite loading
  useEffect(
    () => {
    // Mark sheet as ready after a small delay to ensure DOM is fully rendered
      const readyTimer = setTimeout(
        () => {
          setIsSheetReady(true)
        }, 100
      )

      return () => {
        clearTimeout(readyTimer)
        if (observerRef.current && bottomObserverRef.current) {
          observerRef.current.unobserve(bottomObserverRef.current)
        }
      }
    }, []
  )

  // Create and attach observer when sheet is ready
  useEffect(
    () => {
      if (!isSheetReady || !bottomObserverRef.current) return

      // Clean up previous observer if exists
      if (observerRef.current && bottomObserverRef.current) {
        observerRef.current.unobserve(bottomObserverRef.current)
      }

      // Create new observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        },
        {
          threshold: 0.1,
          root: null, // Use viewport as root
          rootMargin: "100px", // Start loading before user reaches bottom
        }
      )

      // Start observing
      observerRef.current.observe(bottomObserverRef.current)

      return () => {
        if (observerRef.current && bottomObserverRef.current) {
          observerRef.current.unobserve(bottomObserverRef.current)
        }
      }
    }, [
      isSheetReady,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    ]
  )

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase() === "desktop") {
      return <Laptop className="size-4" />
    }
    if (device.toLowerCase() === "mobile") {
      return <Smartphone className="size-4" />
    }
    if (device.toLowerCase() === "tablet") {
      return <Tablet className="size-4" />
    }
    return <AlignJustify className="size-4" />
  }

  const getStatusClass = (statusId: number) => {
    const statusClasses: Record<number, string> = {
      1: "bg-green-500", // Active
      4: "bg-yellow-500", // Paused
      3: "bg-blue-500", // Completed
      2: "bg-red-500", // Canceled
    }
    return statusClasses[statusId] || "bg-gray-500" // Unknown
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString(
      "vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    )
  }

  return (
    <React.Fragment>
      <SheetHeader>
        <SheetTitle>
          {
            t(
              "details.keywordLogs", {
                defaultValue: "Keyword Activity Logs",
              }
            )
          }
        </SheetTitle>

        <p className="text-sm text-muted-foreground">{keywordName}</p>
      </SheetHeader>

      <SheetContent className="flex-1 overflow-y-auto">
        {
          isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-destructive">
                {error instanceof Error ? error.message : "Error loading logs"}
              </p>
            </div>
          ) : data && data.length > 0 ? (
            <div className="mt-4">
              <Timeline>
                {
                  data.map(log => (
                    <TimelineItem
                      key={`${log.keywordId}-${log.timestamp}`}
                      statusColor={getStatusClass(log.statusId)}
                    >
                      <TimelineContent>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-primary/10">
                              {getDeviceIcon(log.device)}
                            </div>

                            <div>
                              <p className="font-medium">{log.statusName}</p>

                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Clock className="size-3.5 mr-1.5" />

                                {formatDate(log.timestamp)}
                              </div>
                            </div>
                          </div>

                          <div className="ml-2 px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                            {log.device}
                          </div>
                        </div>
                      </TimelineContent>
                    </TimelineItem>
                  ))
                }

                {/* Bottom observer for infinite loading */}
                <div
                  ref={bottomObserverRef}
                  className="h-1 w-full"
                />

                {
                  isFetchingNextPage ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="size-5 animate-spin text-primary" />
                    </div>
                  ) : null
                }
              </Timeline>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="mx-auto size-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Clock className="size-8 text-muted-foreground" />
                </div>

                <h3 className="text-lg font-medium mb-2">
                  {
                    t(
                      "details.noLogs", {
                        defaultValue: "No logs available",
                      }
                    )
                  }
                </h3>

                <p className="text-muted-foreground">
                  {
                    t(
                      "details.noLogsDesc", {
                        defaultValue: "There are no activity logs for this keyword yet.",
                      }
                    )
                  }
                </p>
              </div>
            </div>
          )
        }
      </SheetContent>

      <SheetFooter className="border-t p-4">
        <SheetClose asChild>
          <Button onClick={onClose}>
            {
              t(
                "close", {
                  defaultValue: "Close",
                }
              )
            }
          </Button>
        </SheetClose>
      </SheetFooter>
    </React.Fragment>
  )
}
