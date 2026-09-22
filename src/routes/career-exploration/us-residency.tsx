import { createFileRoute } from "@tanstack/react-router";
import { UsResidencyPathwayPage } from "@/components/pages";

export const Route = createFileRoute("/career-exploration/us-residency")({
  head: () => ({
    meta: [
      { title: "U.S. Residency Pathway Roadmap | BMS Step-by-Step Guide" },
      {
        name: "description",
        content:
          "Step-by-step roadmap to U.S. residency for international medical graduates. Detailed guide covering USMLE Step 1 & 2 CK, ECFMG Certification, MyIntealth, ERAS, and the NRMP Match.",
      },
      {
        property: "og:title",
        content: "U.S. Residency Pathway Roadmap | BMS Step-by-Step Guide",
      },
      {
        property: "og:description",
        content:
          "Step-by-step roadmap to U.S. residency for international medical graduates. Detailed guide covering USMLE Step 1 & 2 CK, ECFMG Certification, MyIntealth, ERAS, and the NRMP Match.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UsResidencyPathwayPage,
});
