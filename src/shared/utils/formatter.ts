/* eslint-disable custom-rules/encourage-object-params */
import {
  format,
} from "date-fns"
import {
  type NumericFormatProps, numericFormatter, patternFormatter,
} from "react-number-format"

export function moneyFormat(
  amount?: string | number, options?: NumericFormatProps
) {
  if (amount === undefined) {
    return options?.defaultValue ?? "0"
  }
  return numericFormatter(
    String(amount), {
      thousandSeparator: ".",
      decimalSeparator: ",",
      decimalScale: 0,
      suffix: " ₫",
      ...options,
    }
  )
}

export function numberFormat(
  value?: string | number, options?: NumericFormatProps
): string {
  if (value === undefined) {
    return `${options?.defaultValue ?? "0"}`
  }
  return numericFormatter(
    String(value), {
      thousandSeparator: ".",
      decimalSeparator: ",",
      decimalScale: 0,
      ...options,
    }
  )
}

export function decimalFormat(
  value?: string | number, options?: NumericFormatProps
) {
  if (value === undefined) {
    return options?.defaultValue ?? "0"
  }
  return numericFormatter(
    String(value), {
      thousandSeparator: ".",
      decimalSeparator: ",",
      decimalScale: 2,
      ...options,
    }
  )
}

export function phoneFormat(
  value?: string | number, options?: NumericFormatProps
) {
  if (value === undefined) {
    return options?.defaultValue ?? "-"
  }

  return patternFormatter(
    String(value), {
      format: "### #### ###",
    }
  )
}

export function timeFormat(
  date?: Date, defaultValue = "-"
) {
  if (!date) {
    return defaultValue
  }
  return format(
    date, "HH:mm"
  )
}

export function dayFormat(
  date?: Date, defaultValue = "-"
) {
  if (!date) {
    return defaultValue
  }
  return format(
    date, "dd/MM/yyyy"
  )
}

export function dayTimeFormat(
  date?: Date, defaultValue = "-"
) {
  if (!date) {
    return defaultValue
  }
  return format(
    date, "dd/MM/yyyy HH:mm"
  )
}
