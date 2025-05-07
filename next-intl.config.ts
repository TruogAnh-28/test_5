import {
  getRequestConfig,
} from "next-intl/server"

export default getRequestConfig(async ({ locale }) => {
  return {
    locale: locale,
    messages: (await import(`./src/locales/${locale}/index`)).default,
    timeZone: "Asia/Ho_Chi_Minh",
  }
})
