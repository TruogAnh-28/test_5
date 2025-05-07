import {
  create,
} from "zustand"

import {
  type TrafficSeoCampaigns,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"

interface SessionState {
  sessionTrafficSeoCampaigns: TrafficSeoCampaigns | null
  setSessionTrafficSeoCampaigns: (trafficSeoCampaigns: TrafficSeoCampaigns | null) => void
  getTrafficSeoCampaignsSession: () => TrafficSeoCampaigns | null
}

// Tạo Zustand store
const useSession = create<SessionState>((
  set, get
) => ({
  sessionTrafficSeoCampaigns: null,
  getTrafficSeoCampaignsSession: () => {
    return get().sessionTrafficSeoCampaigns
  },
  setSessionTrafficSeoCampaigns: trafficSeoCampaigns => set({
    sessionTrafficSeoCampaigns: trafficSeoCampaigns,
  }),
}))

export {
  useSession,
}
