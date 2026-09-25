import { createFileRoute } from "@tanstack/react-router";
import { AdminSubscriptionsDashboard } from "@/components/admin-subscriptions";

export const Route = createFileRoute("/admin/subscriptions")({
  head: () => ({
    meta: [
      { title: "BMS Admin - Pathway Subscriptions & WhatsApp Gateway" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminSubscriptionsDashboard,
});
