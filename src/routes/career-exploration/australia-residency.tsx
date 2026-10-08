import { createFileRoute } from "@tanstack/react-router";
import { AustraliaAmcPathwayPage } from "@/components/pages";

export const Route = createFileRoute("/career-exploration/australia-residency")({
  head: () => ({
    meta: [
      { title: "Australian Medical Pathway Roadmap | BMS Step-by-Step Guide" },
      {
        name: "description",
        content:
          "Step-by-step roadmap to practising medicine in Australia for international medical graduates. Comprehensive guide covering PMQ eligibility, MyIntealth & EPIC verification, AMC CAT MCQ, AMC Clinical / WBA, AHPRA registration, and specialist training.",
      },
      {
        property: "og:title",
        content: "Australian Medical Pathway Roadmap | BMS Step-by-Step Guide",
      },
      {
        property: "og:description",
        content:
          "Step-by-step roadmap to practising medicine in Australia for international medical graduates. Comprehensive guide covering PMQ eligibility, MyIntealth & EPIC verification, AMC CAT MCQ, AMC Clinical / WBA, AHPRA registration, and specialist training.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AustraliaAmcPathwayPage,
});
