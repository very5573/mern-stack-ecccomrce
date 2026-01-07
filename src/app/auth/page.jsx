"use client";

import { useState } from "react";
import AuthModal from "../components/Signup/AuthModal";

const AuthPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    /* 🔴 Outer Wrapper → Full viewport, no scroll */
    <div
      className="
        relative h-screen flex -mt-16
        items-center justify-center
        overflow-hidden   /* 👈 Scrollbar remove */
        bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500
      "
    >
      {/* 🔵 Background glow blobs */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-purple-500/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-32 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-3xl" />

      {/* 🧊 Glass Card */}
      <div className="relative z-10 -mt-16 w-full max-w-xl mx-4 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl p-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Welcome Back
        </h1>

        <p className="text-white/80 text-lg mb-10 leading-relaxed">
          Login or create your account to explore powerful features, seamless
          experience and premium services.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="
            px-10 py-4 text-lg font-semibold text-white
            rounded-2xl
            bg-gradient-to-r from-amber-400 to-orange-500
            shadow-xl shadow-orange-500/30
            hover:scale-105 hover:shadow-orange-500/50
            active:scale-95
            transition-all duration-300
          "
        >
          Login / Register
        </button>

        <p className="mt-6 text-sm text-white/60">Secure • Fast • Reliable</p>
      </div>

      {isModalOpen && <AuthModal closeModal={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default AuthPage;
