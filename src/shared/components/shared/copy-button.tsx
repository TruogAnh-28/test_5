/* eslint-disable @typescript-eslint/no-misused-promises */
"use client"

import * as React from "react"

import {
  CheckIcon, ClipboardIcon,
} from "lucide-react"
import {
  toast,
} from "sonner"

import {
  chain,
} from "~/shared/utils/chain"

import {
  Button, type ButtonProps,
} from "~/shared/components/ui/button"

export async function copyToClipboardWithMeta(value: string) {
  await navigator.clipboard.writeText(value)
}

interface CopyButtonProps extends ButtonProps {
  value?: string
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(function CopyButton(
  {
    value,
    onClick,
    ...props
  }, ref
) {
  const [
    hasCopied,
    setHasCopied,
  ] = React.useState(false)

  React.useEffect(
    () => {
      const timer = setTimeout(
        () => {
          setHasCopied(false)
        }, 1500
      )
      return () => {
        clearTimeout(timer)
      }
    }, [hasCopied]
  )

  const handleCopied = React.useCallback(
    async (value?: string) => {
      try {
        await copyToClipboardWithMeta(value ?? "")
        setHasCopied(true)
      }
      catch (error) {
        toast.error((error as Error)?.message ?? "Lỗi")
      }
    }, []
  )

  return (
    <Button
      ref={ref}
      size="icon"
      variant="ghost"
      onClick={
        chain(
          onClick, () => handleCopied(value)
        )
      }
      {...props}
    >
      {hasCopied ? <CheckIcon /> : <ClipboardIcon />}

      <span className="sr-only">Copy</span>
    </Button>
  )
})
