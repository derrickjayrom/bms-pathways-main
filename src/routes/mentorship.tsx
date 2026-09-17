import { createFileRoute } from "@tanstack/react-router";
import { MentorshipPage } from "@/components/pages";

export const Route = createFileRoute("/mentorship")({
  head: () => ({
    meta: [
      { title: "BMS Mentorship | Find or Become a Mentor" },
      {
        name: "description",
        content:
          "Find guidance or give back through the Beyond Medical School mentorship community.",
      },
      { property: "og:title", content: "BMS Mentorship | Find or Become a Mentor" },
      {
        property: "og:description",
        content:
          "Find guidance or give back through the Beyond Medical School mentorship community.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MentorshipPage,
});
