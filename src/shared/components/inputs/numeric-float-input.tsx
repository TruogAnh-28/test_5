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

export interface NumericFloatInputProps extends NumericFormatProps {}

export const NumericFloatInput = forwardRef<HTMLInputElement, NumericFloatInputProps>((
  props, forwardRef
) => {
  return (
    <NumericFormat
      getInputRef={forwardRef}
      customInput={Input}
      inputMode="numeric"
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={3}
      allowNegative={false}
      {...props}
    />
  )
})
NumericFloatInput.displayName = "NumericFloatInput"
