import generatedGuides from "../generated/breastfeeding-tracker-guides.json";
import { appsBySlug } from "./apps";

export const breastfeedingTrackerApp = appsBySlug.get("breast-feeding-tracker")!;

export const breastfeedingTrackerAppStoreUrl = "https://apps.apple.com/app/id6754637800";
export const breastfeedingTrackerOgImage = "/assets/breastfeeding-tracker-og.png";

export type BreastfeedingTrackerGuide = {
  slug: string;
  title: string;
  metaTitle: string | null;
  description: string;
  publishedAt: string;
  updatedAt: string | null;
  excerpt: string;
  tags: string[];
  draft: boolean;
  ogImage: string;
  ogImageAlt: string | null;
  faqItems: Array<{ question: string; answer: string }>;
  showDefaultCta: boolean;
  html: string;
};

export const breastfeedingTrackerGuides = generatedGuides.posts as BreastfeedingTrackerGuide[];
export const breastfeedingTrackerGuidesBySlug = new Map(
  breastfeedingTrackerGuides.map((guide) => [guide.slug, guide])
);

export const breastfeedingTrackerFaqs = [
  {
    question: "Is the app designed for a newborn’s first feeds?",
    answer:
      "Yes. Its quick left and right timer, recent history, widgets, and Apple Watch controls are designed to reduce the memory load of the first few weeks. You can keep using it for as long as it remains helpful."
  },
  {
    question: "Can I track breastfeeding from Apple Watch?",
    answer:
      "Yes. The companion Apple Watch app can start and stop feeds from your wrist and sync completed sessions back to iPhone."
  },
  {
    question: "Does the Apple Watch app work when my iPhone is unavailable?",
    answer:
      "Yes. The watch can keep recording while it is offline and send completed feeds back when the devices reconnect."
  },
  {
    question: "Can I add or correct a feed after it happened?",
    answer:
      "Yes. Feed history supports adding, editing, and deleting entries. You can also adjust a running timer when the feed began before you started it."
  },
  {
    question: "Can I share feed history with a midwife?",
    answer:
      "Yes. You can create a PDF from selected feed history and choose where to save or share it. The PDF only reflects what you recorded and is not a clinical report or a substitute for professional care."
  },
  {
    question: "Does the app require an account or subscription?",
    answer:
      "No account or subscription is required. The App Store lists the app as free with an optional lifetime in-app purchase."
  },
  {
    question: "Does the tracker provide medical advice?",
    answer:
      "No. It records the timing, duration, and side you enter. Its private on-device summaries are informational and do not assess feeding or replace professional care."
  }
];

export const breastfeedingTrackerKeywords = [
  "breastfeeding tracker",
  "breast feeding tracker",
  "breastfeeding timer",
  "newborn breastfeeding tracker",
  "newborn feeding timer",
  "first weeks breastfeeding log",
  "breastfeeding tracker Apple Watch",
  "breastfeeding timer iPhone",
  "nursing tracker",
  "left and right breastfeeding tracker",
  "private breastfeeding tracker"
];
