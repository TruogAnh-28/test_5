// src/shared/components/ui/language-switcher.tsx
"use client"

import {
  usePathname, useRouter,
} from "next/navigation"

import {
  useLocale,
} from "next-intl"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select"

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (value: string) => {
    // Lấy phần đường dẫn sau locale
    const pathSegments = pathname.split("/")
    pathSegments[1] = value // Thay đổi locale

    // Tạo đường dẫn mới
    const newPath = pathSegments.join("/")
    router.push(newPath)
  }

  return (
    <Select
      value={locale}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="en">English</SelectItem>

        <SelectItem value="vi">Tiếng Việt</SelectItem>
      </SelectContent>
    </Select>
  )
}
