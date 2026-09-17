import { createFileRoute } from "@tanstack/react-router";
import { TeamPage } from "@/components/pages";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Team | Beyond Medical School" },
      {
        name: "description",
        content: "Meet the leadership team building mentorship and opportunity through BMS.",
      },
      { property: "og:title", content: "Our Team | Beyond Medical School" },
      {
        property: "og:description",
        content: "Meet the leadership team building mentorship and opportunity through BMS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TeamPage,
});
