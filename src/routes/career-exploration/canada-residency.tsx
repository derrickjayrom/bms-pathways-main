import { createFileRoute } from "@tanstack/react-router";
import { CanadaCarmsPathwayPage } from "@/components/pages";

export const Route = createFileRoute("/career-exploration/canada-residency")({
  head: () => ({
    meta: [
      { title: "Canadian Medical Pathway (CaRMS) Roadmap | BMS Practical Guide" },
      {
        name: "description",
        content:
          "Step-by-step practical roadmap to Canadian medical residency and licensure for International Medical Graduates (IMGs). Comprehensive guide covering PMQ eligibility, physiciansapply.ca, credential verification, MCCQE Part I, NAC Examination OSCE, provincial eligibility, CaRMS R-1 Match, and Canadian residency training.",
      },
      {
        property: "og:title",
        content: "Canadian Medical Pathway (CaRMS) Roadmap | BMS Practical Guide",
      },
      {
        property: "og:description",
        content:
          "Step-by-step practical roadmap to Canadian medical residency and licensure for International Medical Graduates (IMGs). Comprehensive guide covering PMQ eligibility, physiciansapply.ca, credential verification, MCCQE Part I, NAC Examination OSCE, provincial eligibility, CaRMS R-1 Match, and Canadian residency training.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CanadaCarmsPathwayPage,
});
