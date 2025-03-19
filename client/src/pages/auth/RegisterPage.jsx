"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RegisterForm } from "@/components/auth";

import {
  FigmaIcon,
  GithubIcon,
  InstagramIcon,
  TwitchIcon,
  TwitterIcon,
} from "lucide-react";
import { Link } from "react-router";
import { Waves } from "@/components/ui/waves-background";

const RegisterPage = () => (
  <div className="h-screen grid lg:grid-cols-2">
    {/* Left Column  */}
    <div className="flex items-center justify-center p-4">
      <div className="max-w-xs m-auto w-full flex flex-col items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" className="w-12 h-12" />
        </Link>
        <p className="mt-4 text-xl font-bold tracking-tight text-center">
          Buat akun untuk menikmati layanan kami
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
          >
            <GithubIcon className="!h-[18px] !w-[18px]" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
          >
            <InstagramIcon className="!h-[18px] !w-[18px]" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
          >
            <TwitterIcon className="!h-[18px] !w-[18px]" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
          >
            <FigmaIcon className="!h-[18px] !w-[18px]" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
          >
            <TwitchIcon className="!h-[18px] !w-[18px]" />
          </Button>
        </div>

        <div className="my-7 w-full flex items-center justify-center overflow-hidden">
          <Separator />
          <span className="text-sm px-2">OR</span>
          <Separator />
        </div>

        <RegisterForm />

        <p className="mt-5 text-sm text-center">
          Sudah punya akun?
          <Link
            to="/auth/login"
            className="ml-1 underline text-muted-foreground"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
    {/* Right Column with waves */}
    <div className="relative hidden lg:block">
      <Waves
        lineColor={"rgba(0, 0, 0, 0.3)"}
        backgroundColor="transparent"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
    </div>
  </div>
);

export default RegisterPage;
