import { createFileRoute } from "@tanstack/react-router";
import { CareerExplorationPage } from "@/components/pages";

export const Route = createFileRoute("/career-exploration/")({
  head: () => ({
    meta: [
      { title: "BMS Career Pathways | International Pathways" },
      {
        name: "description",
        content:
          "Explore international medical career pathways including U.S., UK, Canada, Australia, and global opportunities.",
      },
      {
        property: "og:title",
        content: "BMS Career Pathways | International Pathways",
      },
      {
        property: "og:description",
        content:
          "Explore international medical career pathways including U.S., UK, Canada, Australia, and global opportunities.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareerExplorationPage,
});
