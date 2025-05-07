import React from "react"

import {
  Check,
  Clock,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
} from "lucide-react"

import {
  cn,
} from "~/shared/utils"

interface TimelineItem {
  id: string | number
  title: string
  description?: string
  timestamp: string
  status?: string
  device?: string
  icon?: React.ReactNode
  isLastItem?: boolean
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export function Timeline({
  items, className,
}: TimelineProps) {
  // Helper function to get device icon
  const getDeviceIcon = (device?: string) => {
    if (!device) return <Globe className="size-4" />

    const deviceLower = device.toLowerCase()
    if (deviceLower.includes("mobile")) return <Smartphone className="size-4" />
    if (deviceLower.includes("desktop")) return <Laptop className="size-4" />
    if (deviceLower.includes("tablet")) return <Tablet className="size-4" />

    return <Globe className="size-4" />
  }

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleString(
        "vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    }
    catch {
      return timestamp
    }
  }

  return (
    <div className={
      cn(
        "space-y-0", className
      )
    }
    >
      {
        items.map(item => (
          <div
            key={item.id}
            className="relative pb-8 last:pb-0"
          >
            {
              !item.isLastItem && (
                <div
                  className="absolute left-4 top-5 bottom-0 -ml-px w-0.5 bg-gray-200 dark:bg-gray-800"
                  aria-hidden="true"
                />
              )
            }

            <div className="relative flex gap-x-4">
              <div className="flex size-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700">
                {
                  item.icon || (
                    item.status === "SUCCESS" ? (
                      <Check className="size-4 text-green-500" />
                    ) : (
                      <Clock className="size-4 text-blue-500" />
                    )
                  )
                }
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {item.title}
                    </p>

                    {
                      item.description ? (
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                      ) : null
                    }
                  </div>

                  <div className="ml-2 shrink-0 flex flex-col items-end">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimestamp(item.timestamp)}
                    </p>

                    {
                      item.device ? (
                        <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          {getDeviceIcon(item.device)}

                          <span className="ml-1">{item.device}</span>
                        </div>
                      ) : null
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}
