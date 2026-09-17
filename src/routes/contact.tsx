import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/pages";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact BMS | Start a Conversation" },
      {
        name: "description",
        content:
          "Contact Beyond Medical School about programs, partnerships, speaking, or support.",
      },
      { property: "og:title", content: "Contact BMS | Start a Conversation" },
      {
        property: "og:description",
        content:
          "Contact Beyond Medical School about programs, partnerships, speaking, or support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});
