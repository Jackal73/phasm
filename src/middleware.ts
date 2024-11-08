import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: [
    "/site",
    "/api/uploadthing",
    "/",
    "/agency/sign-in(.*)",
    "/agency/sign-up(.*)",
  ],
  async beforeAuth(auth, req) {},
  async afterAuth(auth, req) {
    // rewrite for domains
    const url = req.nextUrl;
    const searchParams = url.searchParams.toString();
    let hostname = req.headers;

    const pathWithSearchParams = `${url.pathname}${
      searchParams.length > 0 ? `?${searchParams}` : ""
    }`;

    //if subdomain exists
    const customSubDomain = hostname
      .get("host")
      ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
      .filter(Boolean)[0];

    if (customSubDomain) {
      return NextResponse.rewrite(
        new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
      );
    }

    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
    }

    if (
      url.pathname === "/" ||
      (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
    ) {
      return NextResponse.rewrite(new URL("/site", req.url));
    }

    if (
      url.pathname.startsWith("/agency") ||
      url.pathname.startsWith("/subaccount")
    ) {
      return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
    }

    // if (customSubDomain) {
    //   return NextResponse.rewrite(
    //     new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
    //   );
    // }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// import {
//   ClerkMiddlewareAuth,
//   clerkMiddleware,
//   createRouteMatcher,
// } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/agency/sign-in(.*)",
//   "/agency/sign-up(.*)",
//   "/site",
//   "/api/uploadthing",
// ]);

// const afterAuth = async (auth: ClerkMiddlewareAuth, req: any) => {
//   //rewrite for domains
//   const url = req.nextUrl;
//   const searchParams = url.searchParams.toString();
//   let hostname = req.headers;

//   const pathWithSearchParams = `${url.pathname}${
//     searchParams.length > 0 ? `?${searchParams}` : ""
//   }`;

//   //if subdomain exists
//   const customSubDomain = hostname
//     .get("host")
//     ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
//     .filter(Boolean)[0];

//   if (customSubDomain) {
//     return NextResponse.rewrite(
//       new URL(`/${customSubDomain}${pathWithSearchParams}`, req.url)
//     );
//   }

//   if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
//     return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));
//   }

//   if (
//     url.pathname === "/" ||
//     (url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
//   ) {
//     return NextResponse.rewrite(new URL("/site", req.url));
//   }

//   if (
//     url.pathname.startsWith("/agency") ||
//     url.pathname.startsWith("/subaccount")
//   ) {
//     return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
//   }
// };

// export default clerkMiddleware((auth, req) => {
//   // If we want to handle beforeAuth we will handle it here before th checking route

//   if (!isPublicRoute(req)) {
//     auth().protect();
//   }

//   // afterAuth will be used in end of he clerkMiddleware
//   return afterAuth(auth, req);
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };
