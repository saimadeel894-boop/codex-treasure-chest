import prop1 from "@/assets/marketplace/prop-1.jpg";
import prop2 from "@/assets/marketplace/prop-2.jpg";
import prop3 from "@/assets/marketplace/prop-3.jpg";
import prop4 from "@/assets/marketplace/prop-4.jpg";
import prop5 from "@/assets/marketplace/prop-5.jpg";
import prop6 from "@/assets/marketplace/prop-6.jpg";
import prop7 from "@/assets/marketplace/prop-7.jpg";
import prop8 from "@/assets/marketplace/prop-8.jpg";

// DB stores an image "key" (e.g. "prop-1"); resolve to the bundled Vite URL here.
const IMAGE_MAP: Record<string, string> = {
  "prop-1": prop1,
  "prop-2": prop2,
  "prop-3": prop3,
  "prop-4": prop4,
  "prop-5": prop5,
  "prop-6": prop6,
  "prop-7": prop7,
  "prop-8": prop8,
};

export function resolvePropertyImage(key: string | null | undefined): string {
  if (!key) return prop1;
  return IMAGE_MAP[key] ?? key; // fall back to using the value as URL directly
}
