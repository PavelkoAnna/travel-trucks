"use client";

import { useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Keyboard, Navigation } from "swiper/modules";
import type { CamperImage } from "@/types/camper";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";

import styles from "./CamperGallery.module.css";

interface CamperGalleryProps {
  images: CamperImage[];
  camperName: string;
}

export default function CamperGallery({
  images,
  camperName,
}: CamperGalleryProps) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  if (sortedImages.length === 0) {
    return <p>No photos available.</p>;
  }

  return (
    <section className={styles.gallery} aria-label="Camper photos">
      <Swiper
        className={styles.main}
        modules={[Navigation, Keyboard, A11y]}
        onSwiper={setSwiper}
        onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
        slidesPerView={1}
        spaceBetween={16}
        navigation
        keyboard={{ enabled: true, onlyInViewport: true }}
      >
        {sortedImages.map((image, index) => (
          <SwiperSlide key={image.id}>
            <Image
              className={styles.mainImage}
              src={image.original}
              alt={`${camperName} — photo ${index + 1}`}
              width={1200}
              height={480}
              sizes="(max-width: 1440px) 50vw, 644px"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.thumbnails}>
        {sortedImages.map((image, index) => (
          <button
            className={styles.thumbnailButton}
            key={image.id}
            type="button"
            aria-label={`Show photo ${index + 1}`}
            aria-pressed={activeIndex === index}
            onClick={() => {
              if (swiper && !swiper.destroyed) {
                swiper.slideTo(index);
              }
            }}
          >
            <Image
              className={styles.thumbnailImage}
              src={image.thumb}
              alt=""
              width={292}
              height={120}
              sizes="(max-width: 1440px) 12vw, 143px"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
