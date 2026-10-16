import { createFileRoute } from "@tanstack/react-router";
import { UkPostgraduatePathwayPage } from "@/components/pages";

export const Route = createFileRoute("/career-exploration/postgraduate")({
  head: () => ({
    meta: [
      { title: "UK Postgraduate Studies Pathway | BMS Step-by-Step Guide" },
      {
        name: "description",
        content:
          "The Beyond Medical School (BMS) UK Postgraduate Studies Pathway provides a step-by-step roadmap to help you identify suitable programmes, prepare your application documents, explore funding opportunities, secure admission and prepare for your studies in the UK.",
      },
      {
        property: "og:title",
        content: "UK Postgraduate Studies Pathway | BMS Step-by-Step Guide",
      },
      {
        property: "og:description",
        content:
          "A step-by-step roadmap to identify suitable programmes, prepare application documents, explore funding opportunities, secure admission and prepare for your studies in the UK.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UkPostgraduatePathwayPage,
});
