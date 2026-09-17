# Beyond Medical School platform

## Goal

Build a modern, responsive multi-page BMS website that feels inspiring, credible, and welcoming to students, mentors, speakers, and partners.

## Pages

- Home with campaign message, BMS pillars, program overview, mission and vision, audience groups, events teaser, and community call-to-action.
- About with the BMS story, mission, vision, and six core values.
- Programs with category navigation for career development, exploration, mentorship, exposure, and research.
- Mentorship with dedicated student and mentor pathways, benefits, and calls-to-action.
- Events with category filters, upcoming sample events, “Coming Soon” states, and registration dialogs.
- Resources with search, category filtering, and downloadable-style resource cards.
- Team with eight leadership roles, short biographies, and social links.
- Join BMS with Student, Mentor/Speaker, and Partner forms, validation, success feedback, and pathway-specific fields.
- Contact with inquiry form, contact details, social placeholders, and FAQs.

## Shared experience

- Sticky desktop navigation and a mobile drawer.
- Consistent footer with newsletter signup and copyright.
- Navy, white, and warm-gold visual system with modern sans-serif typography, subtle depth, and restrained motion.
- Reusable page headers, cards, buttons, form controls, section layouts, and empty/success states.
- Responsive behavior across phones, tablets, and desktop screens, with accessible labels and keyboard-friendly interactions.

## Technical details

- Use TanStack Router’s file-based routes for every page and typed internal links.
- Keep page content in lightweight reusable React components and static content collections.
- Implement interactions locally in the browser; form submissions provide polished demo feedback without storing or sending data.
- Add unique titles, descriptions, Open Graph metadata, and Twitter card metadata to every public page.
- Load the selected web font through the document head and define all visual values as semantic theme tokens.
- Verify the main navigation, mobile layout, filters, dialogs, and forms in the running preview.
