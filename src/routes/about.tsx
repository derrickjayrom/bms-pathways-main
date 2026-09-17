import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/pages";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About BMS | Beyond the Medical Degree" },
      {
        name: "description",
        content:
          "Discover how BMS helps medical students find mentorship, career clarity, professional exposure and opportunities beyond medical school.",
      },
      { property: "og:title", content: "About BMS | Beyond the Medical Degree" },
      {
        property: "og:description",
        content:
          "Discover how BMS helps medical students find mentorship, career clarity, professional exposure and opportunities beyond medical school.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});
