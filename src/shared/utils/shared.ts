/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable custom-rules/encourage-object-params */
import {
  type NumericFormatProps, numericFormatter,
} from "react-number-format"

import {
  type LoginUser,
} from "~/features/auth/type/auth"
import {
  type MultiLang,
} from "~/types/shared"

/**
 * Dùng cho những field có đa ngôn ngữ nhưng chưa được parse
 * @param value string or object
 * @param lang mặc định "vi"
 * @param defaultValue mặc đinh "-"
 * @returns string
 */
export function getLangValue(
  value?: string | MultiLang, lang: keyof MultiLang = "vi", defaultValue = "-"
) {
  let result: string | undefined = undefined

  switch (true) {
    case typeof value === "object":
      result = value?.[lang]
      break

    case typeof value === "string":
      try {
        const obj = JSON.parse(value)
        result = obj[lang]
      }
      catch (_) {
        result = value
      }
      break

    default:
      result = defaultValue
      break
  }

  return result ?? defaultValue
}

/**
 * Dùng riêng cho multi-select
 * @param value giá trị của item
 * @param search ký tự cần tìm
 * @param keywords mảng chuỗi
 * @returns number
 */
export function filterCommand(
  value: string, search: string, keywords?: string[]
) {
  const strKeywords = keywords?.join(", ").toLowerCase() || ""

  if (strKeywords.search(search.toLowerCase()) >= 0) return 1
  return 0
}

/**
 * sao chép 1 object
 * @param value object
 * @param fn map qua từng giá trị của object
 * @returns object
 */
export function cloneObject<V, R>(
  value: Record<string, V>, fn?: (value: V, key: string) => R
) {
  const clone: Record<string, R | V | unknown> = {
  } // the new empty object

  if (typeof value !== "object") {
    return value
  }

  if (fn instanceof Function) {
    for (const key in value) {
      clone[key] = fn(
        value[key], key
      )
    }
  }
  else {
    for (const key in value) {
      clone[key] = value[key]
    }
  }

  return clone
}
/**
 * sao chép 1 mảng
 * @param value mảng
 * @param fn map từng giá trị
 * @returns Array
 */
export function cloneArray<V, R>(
  value: V[], fn?: (value: V, index: number) => R
) {
  const clone: (R | V)[] = [] // the new empty array

  if (!Array.isArray(value)) {
    return value
  }

  if (fn instanceof Function) {
    value.forEach((
      val, idx
    ) => {
      clone.push(fn(
        val, idx
      ))
    })
  }
  else {
    value.forEach((val) => {
      clone.push(val)
    })
  }

  return clone
}

/**
 * Dùng để lấy id chi nhánh cho tài khoản chi nhánh
 * @param user Thông tin user
 * @param defaultValue chuỗi ""
 * @returns string
 */
export function getBranchId(
  user?: LoginUser, defaultValue = ""
) {
  // if (isBranchAccount(user)) {
  //   return user?.branch_id || defaultValue
  // }
  return defaultValue
}

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
