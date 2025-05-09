import React from "react"

import {
  TrialCard,
} from "~/features/dashboard/components/trial-card"
import {
  WelcomeCard,
} from "~/features/dashboard/components/welcome-card"
import {
  CampaignDistributionChart,
} from "~/features/reports/components/charts/campaign-distribution-chart"
import {
  CampaignTrafficChart,
} from "~/features/reports/components/charts/campaign-traffic-chart"
import {
  WalletCard,
} from "~/features/wallet/components/wallet-card"

export default function HomePage() {
  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WelcomeCard />

        <WalletCard />
      </div>

      {/* Trial Card */}
      <TrialCard />

      <CampaignDistributionChart />

      <CampaignTrafficChart />
    </div>
  )
}
