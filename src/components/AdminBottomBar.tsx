"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Layers, BarChart3, MessageSquarePlus, Megaphone, Flag, Play } from "lucide-react";

export function AdminBottomBar() {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "DASH",
      href: "/dashboardadmin",
      icon: Home,
      color: "bg-comic-yellow",
      iconColor: "text-comic-ink",
    },
    {
      label: "WORDS",
      href: "/dashboardadmin/words",
      icon: BookOpen,
      color: "bg-blue-100",
      iconColor: "text-comic-klu",
    },
    {
      label: "CHAPTERS",
      href: "/dashboardadmin/chapters",
      icon: Layers,
      color: "bg-pink-100",
      iconColor: "text-comic-bayangan",
    },
    {
      label: "ANALYTICS",
      href: "/dashboardadmin/analytics",
      icon: BarChart3,
      color: "bg-green-100",
      iconColor: "text-emerald-700",
    },
    {
      label: "USULAN",
      href: "/dashboardadmin/suggestions",
      icon: MessageSquarePlus,
      color: "bg-amber-100",
      iconColor: "text-amber-700",
    },
    {
      label: "GAME",
      href: "/play",
      icon: Play,
      color: "bg-gray-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-comic-ink shadow-[0_-4px_0_#16161A] px-1 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all active:scale-95 ${
                isActive ? "scale-105" : "opacity-80"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-all ${
                  isActive
                    ? `${item.color} comic-border-sm comic-shadow-sm rotate-[-3deg]`
                    : "bg-transparent"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${item.iconColor}`} />
              </div>
              <span
                className={`font-bangers text-[9px] tracking-wide mt-0.5 leading-none ${
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
