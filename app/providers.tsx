"use client";

import { useState, useEffect } from "react"; // Import useEffect
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Create a consistent, reusable loader component
const FullPageLoader = () => (
  <div className="h-screen w-full bg-black flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function AppLayoutController({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false); // --- HYDRATION FIX ---
  const pathname = usePathname();
  const { user, loading, signout } = useAuth(pathname);
  const router = useRouter();

  // This useEffect only runs once on the client, after initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && !publicRoutes.includes(pathname)) {
      router.push("/signin");
    }
  }, [user, loading, pathname, router]);

  const publicRoutes = ["/signin", "/signup"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // --- START OF THE RENDER LOGIC FIX ---
  // On the server, and on the very first client render, isMounted will be false.
  // This forces a consistent output between server and client, fixing the hydration error.
  if (!isMounted) {
    return <FullPageLoader />;
  }

  if (loading && !isPublicRoute) {
    return <FullPageLoader />;
  }

  if (isPublicRoute) {
    // If we're on a public route, and we have a user, redirect to dashboard.
    // Otherwise, show the public page.
    if (user) {
      router.push("/");
      return <FullPageLoader />;
    }
    return <>{children}</>;
  }

  if (user) {
    return (
      <SidebarProvider>
        <div className="h-screen w-full flex bg-black text-white">
          <AppSidebar signout={signout} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  // If no other condition is met (e.g., protected route, no user, but not yet redirected), show loader.
  return <FullPageLoader />;
}
// --- END OF THE RENDER LOGIC FIX ---

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <AppLayoutController>{children}</AppLayoutController>
      </QueryClientProvider>
    </JotaiProvider>
  );
}
