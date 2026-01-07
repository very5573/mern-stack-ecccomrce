"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

const Middle = () => {
  const slides = [
    { image: "/banner1.jpg" },
    { image: "/banner2.jpg" },
    { image: "/banner3.jpg" },
    { image: "/banner4.jpg" },
    { image: "/banner5.jpg" },
  ];

  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  const nextSlide = () => setIndex((i) => (i + 1) % slides.length);

  const prevSlide = () =>
    setIndex((i) => (i - 1 + slides.length) % slides.length);

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
      className="relative -mt-16 w-full h-[120px] sm:h-[120px] md:h-[120px] lg:h-[450px] overflow-hidden group"
      onMouseEnter={() => clearInterval(intervalRef.current)}
      onMouseLeave={() => (intervalRef.current = setInterval(nextSlide, 2500))}
    >
      {/* Image */}
      <Image
        src={slides[index].image}
        alt={`Banner ${index + 1}`}
        fill
        priority
        className="
          object-cover
          transition-all duration-1000
          scale-105 group-hover:scale-100
        "
      />

      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="
          absolute left-4 md:left-8 top-1/2 -translate-y-1/2
          w-11 h-11 md:w-12 md:h-12
          rounded-full
          bg-white/80 backdrop-blur
          shadow-xl
          flex items-center justify-center
          hover:bg-white transition
          opacity-0 group-hover:opacity-100
        "
      >
        <ArrowBackIosNew fontSize="small" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="
          absolute right-4 md:right-8 top-1/2 -translate-y-1/2
          w-11 h-11 md:w-12 md:h-12
          rounded-full
          bg-white/80 backdrop-blur
          shadow-xl
          flex items-center justify-center
          hover:bg-white transition
          opacity-0 group-hover:opacity-100
        "
      >
        <ArrowForwardIos fontSize="small" />
      </button>

      {/* Optional Text Overlay (Premium Feel) */}
      <div className="absolute left-6 md:left-16 bottom-16 text-white max-w-lg">
        <h2 className="text-3xl md:text-5xl font-extrabold leading-tight"></h2>
        <p className="mt-3 text-sm md:text-base text-white/90"></p>
      </div>
    </div>
  );
};

export default Middle;
