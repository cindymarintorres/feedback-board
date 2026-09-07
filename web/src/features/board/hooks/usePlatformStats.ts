import { useQuery } from "@tanstack/react-query";
import { commerceReviewService } from "@/services/commerceReviewService";

interface UsePlatformStatsParams {
  from?: string;
  to?: string;
  enabled?: boolean;
}

export const usePlatformStats = ({
  from,
  to,
  enabled = true,
}: UsePlatformStatsParams = {}) => {
  return useQuery({
    queryKey: ["platform-stats", from, to],
    queryFn: () => commerceReviewService.getPlatformStats({ from, to }),
    enabled,
  });
};