import { createFileRoute } from "@tanstack/react-router";
import { EventsPage } from "@/components/pages";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "BMS Events | Learn and Connect" },
      {
        name: "description",
        content: "Discover upcoming BMS seminars, workshops, mentorship, and career events.",
      },
      { property: "og:title", content: "BMS Events | Learn and Connect" },
      {
        property: "og:description",
        content: "Discover upcoming BMS seminars, workshops, mentorship, and career events.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EventsPage,
});
