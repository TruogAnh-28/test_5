"use client"

import * as React from "react"

import {
  MoonIcon, SunIcon,
} from "@radix-ui/react-icons"
import {
  useTheme,
} from "next-themes"

import {
  Button,
} from "~/shared/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/shared/components/ui/tooltip"

export function ThemeToggle() {
  const {
    setTheme,
    theme,
  } = useTheme()

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0 size-10"
            onClick={
              () =>
                setTheme(theme === "dark" ? "light" : "dark")
            }
          >
            <MoonIcon
              className="rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100"
            />

            <SunIcon
              className="absolute rotate-0 scale-100 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0"
            />

            <span
              className="sr-only"
            >
              Switch Theme
            </span>
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <p>{theme === "dark" ? "Dark" : "Light"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
