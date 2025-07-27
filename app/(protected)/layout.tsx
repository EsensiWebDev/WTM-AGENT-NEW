import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import React from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      <main className="@container/main mx-auto max-w-7xl overflow-x-hidden px-6 pt-30 pb-12 transition-all duration-300">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default DashboardLayout;
