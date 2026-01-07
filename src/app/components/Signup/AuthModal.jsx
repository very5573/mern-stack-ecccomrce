"use client";

import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import CloseIcon from "@mui/icons-material/Close";

const AuthModal = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  return (
    /* OVERLAY */
    <div
      onClick={closeModal}
      className="
        fixed inset-0 z-50 flex items-center justify-center px-4
        bg-gradient-to-br from-black/70 via-black/60 to-black/80
        backdrop-blur-md
      "
    >
      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative w-full max-w-lg
          rounded-3xl
          bg-gradient-to-br from-white/15 via-white/10 to-white/5
          backdrop-blur-2xl
          ring-1 ring-white/30
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]
          animate-fadeIn
        "
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={closeModal}
          className="
            absolute top-4 -right-10
            p-2.5 rounded-full
            bg-white/10 backdrop-blur
            hover:bg-white/20
            text-white
            transition
          "
        >
          <CloseIcon fontSize="small" />
        </button>

        {/* TABS */}
        <div className="flex p-1 m-5 rounded-full bg-white/10">
          {["login", "register"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="px-7 pb-7 max-h-[75vh] overflow-y-auto scrollbar-hide">
          {activeTab === "login" ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
