export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboardadmin/", "/api/admin/"],
      },
    ],
    sitemap: "https://tekakomik.vercel.app/sitemap.xml",
  };
}
