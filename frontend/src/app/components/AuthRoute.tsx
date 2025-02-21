"use client";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";

export default function AuthRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return <>{children}</>;
}