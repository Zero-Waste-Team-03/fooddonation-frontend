export type ImpactMetrics = {
  totalFoodWeightKg: number;
  totalCo2AvoidedKg: number;
  totalDonations: number;
  activeUsers: number;
};

export type MetricCardData = {
  id: string;
  label: string;
  value: string;
  deltaLabel: string;
  trend: "up" | "down" | "neutral";
};

export type ActivityPoint = {
  label: string;
  donations: number;
  users: number;
};
