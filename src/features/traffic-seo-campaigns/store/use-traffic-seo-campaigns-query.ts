import {
  useMutation, useQueryClient,
} from "@tanstack/react-query"

import {
  updateKeywordApi,
  addKeywordApi,
  updateLinkApi,
  addLinkApi,
} from "~/features/traffic-seo-campaigns/api/traffic-seo-campaigns-api-extension"
import {
  type Keyword,
  type Link,
} from "~/features/traffic-seo-campaigns/type/traffic-seo-campaigns"

export function useTrafficSeoCampaignsQuery(campaignId: number) {
  const queryClient = useQueryClient()

  // Function to invalidate the campaign query cache
  const invalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: [
        "getTrafficSeoCampaigns",
        campaignId,
      ],
    })
  }

  // Update keyword mutation
  const updateKeyword = useMutation({
    mutationFn: (keyword: Keyword) => updateKeywordApi(keyword),
    onSuccess: () => {
      invalidateQueries()
    },
  })

  // Add keyword mutation
  const addKeyword = useMutation({
    mutationFn: (keyword: Keyword) => addKeywordApi(keyword),
    onSuccess: () => {
      invalidateQueries()
    },
  })

  // Update link mutation
  const updateLink = useMutation({
    mutationFn: (link: Link) => updateLinkApi(link),
    onSuccess: () => {
      invalidateQueries()
    },
  })

  // Add link mutation
  const addLink = useMutation({
    mutationFn: (link: Link) => addLinkApi(link),
    onSuccess: () => {
      invalidateQueries()
    },
  })

  return {
    updateKeyword,
    addKeyword,
    updateLink,
    addLink,
  }
}
