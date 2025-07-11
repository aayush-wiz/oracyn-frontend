/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider, useSetAtom, useAtom } from "jotai"; // Import useAtom
import { api } from "@/lib/api";
import { userAtom, User } from "@/lib/atoms";
import { useAuth } from "@/hooks/useAuth";
import { AppSidebar } from "@/components/AppSidebar";

const FullPageLoader = () => (
  <div className="h-screen w-full bg-black flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const data: { user: User } = await api.getMe();
        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        // This is an expected error if the user has no cookie.
        setUser(null);
      } finally {
        // We have our definitive answer, stop loading.
        setLoading(false);
      }
    };

    checkUserSession();
  }, [setUser]); // Empty dependency array ensures this runs ONLY ONCE.

  if (loading) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}

// AppLayoutController now simply consumes the state set by AuthInitializer
function AppLayoutController({ children }: { children: React.ReactNode }) {
  const [user] = useAtom(userAtom);
  const { signout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const publicRoutes = ["/signin", "/signup"];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    // We check against `undefined` because that's the initial state of the atom
    // before the AuthInitializer has finished.
    if (user === undefined) return;

    // Redirect a logged-in user from a public page
    if (user && isPublicRoute) {
      router.push("/");
    }

    // Redirect a logged-out user from a protected page
    if (!user && !isPublicRoute) {
      router.push("/signin");
    }
  }, [user, isPublicRoute, router]);

  if (
    user === undefined ||
    (user && isPublicRoute) ||
    (!user && !isPublicRoute)
  ) {
    return <FullPageLoader />;
  }

  if (user) {
    return (
      <div className="h-screen w-full flex bg-black text-white">
        <AppSidebar signout={signout} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          <AppLayoutController>{children}</AppLayoutController>
        </AuthInitializer>
      </QueryClientProvider>
    </JotaiProvider>
  );
}
