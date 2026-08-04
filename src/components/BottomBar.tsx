"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, BookOpen, Swords, Trophy, LayoutDashboard, LogIn, Lock } from "lucide-react";
import { useSession } from "next-auth/react";

export function BottomBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboardadmin")) return null;
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const menuItems = [
    {
      label: "MAIN",
      href: "/play",
      icon: Play,
      color: "bg-comic-yellow",
      textColor: "text-comic-ink",
      iconColor: "fill-comic-ink text-comic-ink",
      isProtected: true,
    },
    {
      label: "CHAPTER",
      href: "/chapter",
      icon: BookOpen,
      color: "bg-blue-100",
      textColor: "text-comic-klu",
      iconColor: "text-comic-klu",
      isProtected: true,
    },
    {
      label: "DUEL",
      href: "/duel",
      icon: Swords,
      color: "bg-pink-100",
      textColor: "text-comic-bayangan",
      iconColor: "text-comic-bayangan",
      isProtected: true,
    },
    {
      label: "RANK",
      href: "/leaderboard",
      icon: Trophy,
      color: "bg-purple-100",
      textColor: "text-purple-700",
      iconColor: "text-purple-600",
      isProtected: true,
    },
    isLoggedIn
      ? {
          label: "DASH",
          href: "/dashboard",
          icon: LayoutDashboard,
          color: "bg-emerald-100",
          textColor: "text-emerald-700",
          iconColor: "text-emerald-600",
          isProtected: false,
        }
      : {
          label: "SIGN IN",
          href: "/auth/login",
          icon: LogIn,
          color: "bg-red-100",
          textColor: "text-red-600",
          iconColor: "text-red-500",
          isProtected: false,
        },
  ];

  const handleLinkClick = (e: React.MouseEvent, item: typeof menuItems[0]) => {
    if (item.isProtected && !isLoggedIn) {
      e.preventDefault();
      window.location.href = "/auth/login";
    }
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-comic-ink shadow-[0_-4px_0_#16161A] px-2 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all active:scale-95 ${
                isActive ? "scale-105" : "opacity-85"
              }`}
            >
              {/* Icon Container with Comic Bubble effect if active */}
              <div
                className={`p-1.5 rounded-lg transition-all ${
                  isActive
                    ? `${item.color} comic-border-sm comic-shadow-sm rotate-[-3deg]`
                    : "bg-transparent"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                  {item.isProtected && !isLoggedIn && (
                    <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 border border-comic-ink">
                      <Lock className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              </div>
              <span
                className={`font-bangers text-[10px] tracking-wider mt-0.5 leading-none ${
                  isActive ? "text-comic-ink font-extrabold" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
