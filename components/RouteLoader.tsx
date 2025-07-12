"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress (you can customize color via global CSS if needed)
NProgress.configure({ showSpinner: false });

export default function RouteLoader() {
  const pathname = usePathname();
  // Removed unused loading state

  useEffect(() => {
    if (!pathname) return;

    // Start loading
    NProgress.start();

    // Simulate slight delay (use transition start-end hooks for real usage)
    const timer = setTimeout(() => {
      NProgress.done();
    }, 200); // Adjust based on your page load performance

    // Cleanup
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
