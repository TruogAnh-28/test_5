/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getSession,
  signOut,
} from "next-auth/react"
import {
  toast,
} from "sonner"

const apiUrl = process.env.NEXT_PUBLIC_API_ENDPOINT_URL
const getAuthToken = async (): Promise<string | null> => {
  const session = await getSession()
  return session?.user?.token || null
}

export const request = async <TResponse>(
  method: string,
  endpoint: string,
  body?: any,
  isAuthRequired = true,
  isFormData = false
): Promise<TResponse> => {
  const token = isAuthRequired ? await getAuthToken() : null
  const headers: Record<string, string> = {
  }

  if (isAuthRequired && token) {
    headers.Authorization = `Bearer ${token}`
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json"
  }

  try {
    const response = await fetch(
      `${apiUrl}${endpoint}`, {
        method,
        headers,
        body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      }
    )

    const data = await response.json()

    if (response.status === 402 || response.status === 401) {
      toast.info("Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại")
      await signOut({
        redirect: true,
        callbackUrl: "/en/login",
      })
      throw new Error("Token expired")
    }

    if (!response.ok) {
      const hasErrorField = data && typeof data === "object" && "error" in data
      const errorMessage = hasErrorField ? (data.error || data.message || "Đã có lỗi xảy ra") : "Đã có lỗi xảy ra"

      toast.error(errorMessage)
      throw new Error(data.message || data.error || "API error")
    }

    return data as TResponse
  }
  catch (error) {
    if (error instanceof Error && error.message !== "Token expired" && error.message !== "API error") {
      toast.error("Có lỗi khi gọi API")
    }
    throw error
  }
}

export const api = {
  get: <TResponse>(endpoint: string, isAuthRequired = true) =>
    request<TResponse>(
      "GET", endpoint, undefined, isAuthRequired
    ),
  post: <TResponse>(endpoint: string, body: any, isAuthRequired = true) =>
    request<TResponse>(
      "POST", endpoint, body, isAuthRequired
    ),
  put: <TResponse>(endpoint: string, body: any, isAuthRequired = true) =>
    request<TResponse>(
      "PUT", endpoint, body, isAuthRequired
    ),
  delete: <TResponse>(endpoint: string, isAuthRequired = true) =>
    request<TResponse>(
      "DELETE", endpoint, undefined, isAuthRequired
    ),
  patch: <TResponse>(endpoint: string, body: any, isAuthRequired = true) =>
    request<TResponse>(
      "PATCH", endpoint, body, isAuthRequired
    ),
}
