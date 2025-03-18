"use client";

import { Button } from "@/components/ui/button";
import { Glow } from "@/components/ui/glow";
import "@/styles/cta.css";
import { Link } from "react-router";

export function CTASection({ title, action }) {
  return (
    <div>
      <div className="relative z-10 mx-auto flex max-w-container flex-col items-center gap-6 text-center sm:gap-8">
        <h2 className="text-3xl font-semibold sm:text-5xl animate-appear">
          {title}
        </h2>
        <Button
          variant={action.variant || "default"}
          size="lg"
          className="animate-appear delay-100"
          asChild
        >
          <Link to={action.href}>{action.text}</Link>
        </Button>
      </div>
      <div className="absolute left-0 top-0 h-full w-full translate-y-[1rem] opacity-80 transition-all duration-500 ease-in-out group-hover:translate-y-[-2rem] group-hover:opacity-100">
        <Glow variant="bottom" className="animate-appear-zoom delay-300" />
      </div>
    </div>
  );
}
