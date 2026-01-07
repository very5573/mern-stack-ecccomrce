"use client";

import PeopleIcon from "@mui/icons-material/People";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const WelcomeAdmin = () => {
  const stats = [
    { label: "Total Users", value: 1250, icon: <PeopleIcon fontSize="large" />, color: "from-blue-500 to-indigo-500" },
    { label: "Products", value: 340, icon: <Inventory2Icon fontSize="large" />, color: "from-emerald-500 to-teal-500" },
    { label: "Orders", value: 542, icon: <ShoppingCartIcon fontSize="large" />, color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="min-h-[80vh] px-6 py-12 flex flex-col items-center gap-12 bg-gradient-to-br from-gray-100 via-white to-gray-200">

      {/* ================= WELCOME CARD ================= */}
      <div
        className="
          max-w-3xl w-full
          bg-white/70 backdrop-blur-2xl
          rounded-[2.5rem]
          shadow-[0_40px_120px_-30px_rgba(0,0,0,0.25)]
          p-12 text-center
          transition-all duration-700
          hover:-translate-y-1
          hover:shadow-[0_60px_160px_-30px_rgba(0,0,0,0.35)]
        "
      >
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Welcome to the <span className="text-indigo-600">Admin Dashboard</span>
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Take full control of your platform — manage users, products and orders,
          monitor growth, and deliver a world-class experience.
        </p>

        <button
          className="
            inline-flex items-center justify-center
            px-8 py-4 rounded-2xl
            bg-indigo-600 text-white font-semibold
            shadow-[0_15px_40px_-10px_rgba(79,70,229,0.7)]
            hover:bg-indigo-700
            hover:scale-[1.04]
            transition-all duration-300
          "
        >
          Get Started
        </button>

        <p className="mt-6 text-sm text-gray-500">
          Tip: Use the sidebar to navigate admin tools
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full">
        {stats.map((s) => (
          <div
            key={s.label}
            className="
              group relative
              bg-white/80 backdrop-blur-xl
              rounded-3xl p-8
              shadow-[0_25px_70px_-20px_rgba(0,0,0,0.2)]
              transition-all duration-500
              hover:-translate-y-1
              hover:shadow-[0_45px_120px_-25px_rgba(0,0,0,0.3)]
            "
          >
            {/* Glow */}
            <div
              className={`
                absolute inset-0 rounded-3xl blur-2xl opacity-0
                group-hover:opacity-40 transition duration-700
                bg-gradient-to-br ${s.color}
              `}
            />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wider text-gray-500">
                  {s.label}
                </p>
                <p className="text-3xl font-extrabold text-gray-900 mt-2">
                  {s.value}
                </p>
              </div>

              <div
                className={`
                  w-14 h-14 flex items-center justify-center
                  rounded-2xl text-white text-2xl
                  bg-gradient-to-br ${s.color}
                  shadow-lg
                `}
              >
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default WelcomeAdmin;
