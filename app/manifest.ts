import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EduDroid - Android-Inspired Teaching Platform",
    short_name: "EduDroid",
    description: "A modern teaching platform with Android design principles",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6200ee",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
