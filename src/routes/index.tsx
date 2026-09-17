import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/pages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beyond Medical School | Beyond the Degree" },
      {
        name: "description",
        content: "Mentorship, exposure, and opportunity for medical students and professionals.",
      },
      { property: "og:title", content: "Beyond Medical School | Beyond the Degree" },
      {
        property: "og:description",
        content:
          "Discover the people, perspective, and opportunities to shape your medical career.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});
