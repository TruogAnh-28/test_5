/* eslint-disable custom-rules/encourage-object-params */
import {
  forwardRef,
} from "react"

import {
  NumericFormat,
  type NumericFormatProps,
} from "react-number-format"

import {
  Input,
} from "~/shared/components/ui/input"

export interface NumericInputProps extends NumericFormatProps {}

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>((
  props, forwardRef
) => {
  return (
    <NumericFormat
      getInputRef={forwardRef}
      customInput={Input}
      inputMode="numeric"
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={0}
      allowNegative={false}
      {...props}
    />
  )
})
NumericInput.displayName = "NumericInput"
