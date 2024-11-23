import React from "react";
import { Header } from "@/components/ui/Header/Header";
import { WordFooter } from "@/components/ui/WordFooter/WordFooter";
import { TuneFooter } from "@/components/ui/TuneFooter/TuneFooter";
import { Helmet } from "react-helmet-async";

interface LayoutProps {
  children: React.ReactNode;
  tune?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, tune }) => {
  return (
    <div className="min-h-screen flex flex-col w-screen bg-black overflow-x-hidden">
      <Helmet>
        <title>Mixtones</title>
        <meta name="description" content="This is my application" />
        <link rel="icon" href="/images/trumpet_logo2.jpeg" type="image/jpeg" />
      </Helmet>

      <Header />

      <main className="flex-1 w-full pt-16 pb-[72px]">
        {children}
        <div className="px-16">
          <WordFooter />
        </div>
      </main>

      {tune && <TuneFooter />}
    </div>
  );
};
