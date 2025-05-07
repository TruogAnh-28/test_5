/* eslint-disable custom-rules/encourage-object-params */
import React from "react"

import {
  chain,
} from "~/shared/utils/chain"

import {
  Input, type InputProps,
} from "~/shared/components/ui/input"

export interface TextInputProps extends InputProps {
  onValueChange?: (value: string) => void
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>((
  {
    onChange, onValueChange, ...props
  }, ref
) => (
  <Input
    ref={ref}
    type="text"
    inputMode="text"
    autoCapitalize="off"
    onChange={
      chain(
        onChange, (e) => {
          const value = e.target.value
          onValueChange?.(value)
        }
      )
    }
    {...props}
  />
))
TextInput.displayName = "TextInput"
