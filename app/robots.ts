export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/api",
        "/auth"
      ]
    },
    sitemap: "https://form-aro.vercel.app/sitemap.xml"
  }
}
