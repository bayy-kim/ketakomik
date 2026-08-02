import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tekakonik — Game Tebak Kata Komik Modern",
    short_name: "Tekakonik",
    description: "Bantu Kapten Klu dan selidiki trik Bayangan dalam game tebak kata harian bergaya komik modern!",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F0",
    theme_color: "#FFD200",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
