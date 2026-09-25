"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/format";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div
        onScroll={(e) => {
          const el = e.currentTarget;
          setActive(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto md:mx-0 md:flex-col md:gap-4 md:overflow-visible"
      >
        {images.map((src, i) => (
          <motion.div
            key={src}
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ delay: 0.1 + i * 0.15, duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            className="relative aspect-[3/4] w-full shrink-0 snap-center overflow-hidden bg-smoke"
          >
            <motion.div
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 + i * 0.15, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={src}
                alt={i === 0 ? name : `${name} — alternate view`}
                fill
                preload={i === 0}
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2 md:hidden" aria-hidden>
          {images.map((src, i) => (
            <span key={src} className={cn("h-0.5 w-8 transition-colors", i === active ? "bg-blood" : "bg-white/20")} />
          ))}
        </div>
      )}
    </div>
  );
}
