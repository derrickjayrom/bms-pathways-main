import { createFileRoute } from "@tanstack/react-router";
import { ResourcesPage } from "@/components/pages";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "BMS Resources | Practical Career Guides" },
      {
        name: "description",
        content: "Search practical medical career, research, postgraduate, and exam resources.",
      },
      { property: "og:title", content: "BMS Resources | Practical Career Guides" },
      {
        property: "og:description",
        content: "Search practical medical career, research, postgraduate, and exam resources.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResourcesPage,
});
