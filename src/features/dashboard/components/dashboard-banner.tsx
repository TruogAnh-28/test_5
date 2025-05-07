import {
  ImageView,
} from "~/shared/components/shared/image"

export function DashboardBanner() {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-md mb-6">
      <ImageView
        src="/images/banner/banner.jpg"
        alt="Dashboard Banner"
        width={1200}
        height={100}
        className="w-full h-auto object-cover"
        priority
      />
    </div>
  )
}
