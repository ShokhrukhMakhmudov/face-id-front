"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import queryClient from "../../../lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import Header from "@/components/Header";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      fetch("/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            sessionStorage.removeItem("token");
            router.push("/login");
          } else {
            setUserData(data);
            setIsLoading(false);
          }
        });
    }
  }, [router]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-full w-full" data-theme={darkMode ? "dark" : "light"}>
      <Header setDarkMode={setDarkMode} />

      <main>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </main>
    </div>
  );
};

export default RootLayout;
