import {
  request,
} from "~/lib/modules/api"
import {
  type ApiResponse,
} from "~/types/api"

export const uploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append(
    "image", file
  ) // Tên key phải trùng với key backend xử lý

  return await request<ApiResponse<{ link: string }>>(
    "POST",
    "/images/upload",
    formData,
    true, // Cần xác thực token không?
    true // Đây là FormData
  )
}
