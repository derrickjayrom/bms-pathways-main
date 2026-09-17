import { createFileRoute } from "@tanstack/react-router";
import { ProgramsPage } from "@/components/pages";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "BMS Programs | Career, Mentorship and Research" },
      {
        name: "description",
        content: "Explore BMS programs for career growth, mentorship, exposure, and research.",
      },
      { property: "og:title", content: "BMS Programs | Career, Mentorship and Research" },
      {
        property: "og:description",
        content: "Explore BMS programs for career growth, mentorship, exposure, and research.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgramsPage,
});
