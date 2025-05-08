/**
 * Chuyển đổi một chuỗi ngày hoặc đối tượng Date thành chuỗi ISO UTC
 * Loại bỏ thông tin về múi giờ và chỉ giữ lại ngày
 * @param date - Chuỗi ngày hoặc đối tượng Date cần chuyển đổi
 * @returns Chuỗi ngày dạng ISO ở múi giờ UTC
 */
export function formatDateToUTC(date: string | Date): string {
  const d = new Date(date)
  return new Date(Date.UTC(
    d.getFullYear(), d.getMonth(), d.getDate()
  )).toISOString()
}

/**
 * Các hàm tiện ích xử lý ngày tháng khác có thể được thêm vào đây
 */
