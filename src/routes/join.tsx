import { createFileRoute } from "@tanstack/react-router";
import { JoinPage } from "@/components/pages";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join BMS | Students, Mentors and Partners" },
      {
        name: "description",
        content: "Join Beyond Medical School as a student, mentor, speaker, or partner.",
      },
      { property: "og:title", content: "Join BMS | Students, Mentors and Partners" },
      {
        property: "og:description",
        content: "Join Beyond Medical School as a student, mentor, speaker, or partner.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JoinPage,
});
