"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function About() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 150);
  }, []);

  return (
    <div
      className="
       flex items-start justify-center
  px-4 pt-0 pb-4 -mt-13
  overflow-y-auto scrollbar-hidden
  bg-gradient-to-br from-zinc-100 via-white to-zinc-200
      "
    >
      <div
        className={`
          relative max-w-7xl w-full
          bg-white/70 backdrop-blur-2xl
          rounded-[2.5rem]
          shadow-[0_40px_120px_-30px_rgba(0,0,0,0.25)]
          overflow-hidden
          transition-all duration-1000
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
        `}
      >
        <div className="flex flex-col lg:flex-row">
          {/* IMAGE */}
          <div className="relative lg:w-1/2 h-[520px] lg:h-[900px] group overflow-hidden">
            <Image
              src="/images/developers.jpg"
              alt="MERN Developer"
              fill
              priority
              className="
                object-cover scale-105
                transition-transform duration-[1500ms]
                group-hover:scale-110
              "
            />

            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/30 to-transparent" />

            <div className="absolute bottom-8 left-8 px-6 py-3 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white text-sm font-semibold shadow-lg">
              MERN Stack Specialist
            </div>
          </div>

          {/* CONTENT */}
          <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.35em] text-amber-500 font-semibold mb-4">
              About Me
            </span>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-zinc-900 leading-tight mb-6">
              Crafting <br />
              <span className="text-amber-500">Premium Experiences</span>
            </h1>

            <p className="text-zinc-600 text-lg leading-relaxed mb-6">
              I’m a <strong>full-stack MERN developer</strong> focused on
              building high-performance, scalable and visually premium
              applications.
            </p>

            <p className="text-zinc-600 leading-relaxed mb-10">
              Every product is crafted with performance, security and clean
              architecture — inspired by{" "}
              <strong>Amazon-level reliability</strong>.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="/contact"
                className="
                  relative inline-flex items-center justify-center
                  px-9 py-4 rounded-2xl
                  bg-amber-500 text-white font-semibold
                  shadow-[0_18px_45px_-10px_rgba(245,158,11,0.7)]
                  hover:bg-amber-600
                  hover:scale-[1.04]
                  active:scale-95
                  transition-all duration-300
                "
              >
                Let’s Work Together
              </Link>

              <span className="text-sm text-zinc-500">
                Available for freelance & projects
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
