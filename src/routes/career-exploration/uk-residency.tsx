import { createFileRoute } from "@tanstack/react-router";
import { UkPlabPathwayPage } from "@/components/pages";

export const Route = createFileRoute("/career-exploration/uk-residency")({
  head: () => ({
    meta: [
      { title: "U.K. PLAB Pathway Roadmap | BMS Step-by-Step Guide" },
      {
        name: "description",
        content:
          "Step-by-step roadmap to practising medicine in the U.K. for international medical graduates. Detailed guide covering PMQ checking, English proficiency, EPIC verification, PLAB 1 & 2, GMC registration, and NHS jobs.",
      },
      {
        property: "og:title",
        content: "U.K. PLAB Pathway Roadmap | BMS Step-by-Step Guide",
      },
      {
        property: "og:description",
        content:
          "Step-by-step roadmap to practising medicine in the U.K. for international medical graduates. Detailed guide covering PMQ checking, English proficiency, EPIC verification, PLAB 1 & 2, GMC registration, and NHS jobs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UkPlabPathwayPage,
});
