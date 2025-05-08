// src/shared/components/ui/timeline.tsx
import React from "react"

import {
  cn,
} from "~/shared/utils"

/**
 * Timeline container component
 */
export interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>((
  {
    className, children, ...props
  }, ref
) => {
  return (
    <div
      ref={ref}
      className={
        cn(
          "relative", className
        )
      }
      {...props}
    >
      {/* Timeline line */}
      <div className="absolute left-5 inset-y-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
})
Timeline.displayName = "Timeline"

/**
 * Timeline item component
 */
export interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  statusColor?: string
}

export const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>((
  {
    className, children, statusColor = "bg-primary", ...props
  }, ref
) => {
  return (
    <div
      ref={ref}
      className={
        cn(
          "relative pl-10", className
        )
      }
      {...props}
    >
      {/* Timeline node */}
      <div
        className={
          cn(
            "absolute left-[21px] size-3 rounded-full -translate-x-1/2 translate-y-[250%]",
            statusColor
          )
        }
      />

      {children}
    </div>
  )
})
TimelineItem.displayName = "TimelineItem"

/**
 * Timeline content container
 */
export interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>((
  {
    className, children, ...props
  }, ref
) => {
  return (
    <div
      ref={ref}
      className={
        cn(
          "bg-card border rounded-lg p-3", className
        )
      }
      {...props}
    >
      {children}
    </div>
  )
})
TimelineContent.displayName = "TimelineContent"
