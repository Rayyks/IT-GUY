"use client";
import { Hexagon, Github, Twitter } from "lucide-react";

import { HelmetProvider } from "@/utils/HelmetProvider";
import { Element as ScrollElement } from "react-scroll";
import { Hero } from "@/components/landing/animated-hero";
import { AboutTab } from "@/components/landing/about-tab";
import { BookNow } from "@/components/landing/book-now";

import { cn } from "@/lib/utils";
import { CTASection } from "@/components/landing/cta-with-glow";
import { Footer } from "@/components/landing/footer";

const LandingPage = () => {
  return (
    <main>
      <HelmetProvider
        title="Landing"
        content="Landing page, you can see the overview of the website here"
      />

      <ScrollElement name="hero">
        <section className="block min-h-screen w-full">
          <Hero />
        </section>
      </ScrollElement>
      <ScrollElement name="about">
        <section className="min-h-screen w-full bg-black">
          <AboutTab />
        </section>
      </ScrollElement>
      <ScrollElement name="booknow">
        <section className="min-h-screen w-full">
          <BookNow
            badge="IT.GUY"
            title1="Smarter Repairs"
            title2="Smoother Tech"
          />
        </section>
      </ScrollElement>
      <ScrollElement name="cta">
        <section
          className={cn(
            "group relative overflow-hidden py-24 sm:py-32"
            // className
          )}
        >
          <CTASection
            title="Mulai sekarang dan nikmati layanan terbaik kami"
            action={{
              text: "Get Started",
              href: "/dashboard/book",
              variant: "default",
            }}
          />
        </section>
      </ScrollElement>
      <ScrollElement name="footer">
        <div className="w-full">
          <Footer
            logo={<Hexagon className="h-10 w-10" />}
            brandName="IT.GUY"
            socialLinks={[
              {
                icon: <Twitter className="h-5 w-5" />,
                href: "https://twitter.com",
                label: "Twitter",
              },
              {
                icon: <Github className="h-5 w-5" />,
                href: "https://github.com",
                label: "GitHub",
              },
            ]}
            mainLinks={[
              { href: "/products", label: "Products" },
              { href: "/about", label: "About" },
              { href: "/blog", label: "Blog" },
              { href: "/contact", label: "Contact" },
            ]}
            legalLinks={[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
            ]}
            copyright={{
              text: "© 2024 IT.GUY",
              license: "All rights reserved",
            }}
          />
        </div>
      </ScrollElement>
    </main>
  );
};

export default LandingPage;
