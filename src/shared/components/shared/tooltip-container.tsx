import React from "react"

import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "~/shared/components/ui/tooltip"

interface TooltipContainerProps {
  children: React.ReactElement
  title?: React.ReactNode
  content?: React.ReactNode
}

export function TooltipContainer({
  children, title, content,
}: TooltipContainerProps) {
  const text = title ?? children.props?.title ?? null
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>

        <TooltipContent>{content ?? text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
