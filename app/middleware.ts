import { type NextRequest, NextResponse } from "next/server"

const locales = ["en", "ja", "pt"]
const defaultLocale = "en"

export function middleware(request: NextRequest) {
  // Get the pathname from the request
  const pathname = request.nextUrl.pathname

  // Check if the pathname already includes a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) return NextResponse.next()

  // Get locale from cookie or Accept-Language header
  let locale = defaultLocale
  const cookieLocale = request.cookies.get("locale")?.value

  if (cookieLocale && locales.includes(cookieLocale)) {
    locale = cookieLocale
  } else {
    const acceptLanguage = request.headers.get("Accept-Language") || ""
    if (acceptLanguage.includes("ja")) locale = "ja"
    else if (acceptLanguage.includes("pt")) locale = "pt"
  }

  // Redirect to the same pathname but with the locale prefix
  return NextResponse.redirect(
    new URL(`/${locale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`, request.url),
  )
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
