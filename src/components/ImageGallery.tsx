

import { Image } from "@/components/compat/Image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageGalleryProps = {
  images: string[];
  title: string;
};

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full rounded-lg bg-slate-100 flex items-center justify-center">
        <span className="text-slate-400">No images available</span>
      </div>
    );
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image View */}
      <div className="relative group overflow-hidden rounded-lg bg-slate-100 aspect-[16/10] sm:aspect-[16/9]">
        <Image
          src={images[activeIndex]}
          alt={`${title} main view ${activeIndex + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="object-cover transition duration-300"
        />

        {/* Navigation Arrows for multi-image gallery */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/80 text-slate-800 shadow-md backdrop-blur-sm transition hover:bg-white hover:text-emerald-800 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/80 text-slate-800 shadow-md backdrop-blur-sm transition hover:bg-white hover:text-emerald-800 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </>
        )}

        {/* Image Index Indicator */}
        <span className="absolute bottom-3 right-3 rounded bg-slate-900/75 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-[4/3] w-20 sm:w-24 shrink-0 overflow-hidden rounded-md border-2 bg-slate-100 transition ${
                activeIndex === index
                  ? "border-emerald-700 ring-2 ring-emerald-100"
                  : "border-transparent hover:border-slate-300"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
