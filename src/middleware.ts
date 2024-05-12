import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoutes = createRouteMatcher(["/", "/browser"]);
export default clerkMiddleware((auth, req) => {
  console.log("Middleware", req.url);

  if (protectedRoutes(req)) {
    console.log("Protected route", req.url);

    auth().protect();
  }
});
export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
