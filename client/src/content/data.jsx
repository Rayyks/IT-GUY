import {
  Wrench,
  CalendarClock,
  BadgeDollarSign,
  ShieldCheck,
  History,
  Bell,
  RotateCw,
  Settings,
  Layout,
  Pointer,
  Zap,
} from "lucide-react";

export const aboutData = {
  badge: "IT.GUY",
  heading: "A Better Way to Repair Your Tech",
  description:
    "From broken screens to hardware malfunctions—IT.GUY makes repair scheduling effortless.",
  tabs: [
    {
      value: "tab-1",
      icon: <Zap className="h-auto w-4 shrink-0" />,
      label: "Boost Revenue",
      content: {
        badge: "Modern Tactics",
        title: "Make your site a true standout.",
        description:
          "Discover new web trends that help you craft sleek, highly functional sites that drive traffic and convert leads into customers.",
        buttonText: "See Plans",
        imageSrc:
          "https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg",
        imageAlt: "placeholder",
      },
    },
    {
      value: "tab-2",
      icon: <Pointer className="h-auto w-4 shrink-0" />,
      label: "Higher Engagement",
      content: {
        badge: "Expert Features",
        title: "Boost your site with top-tier design.",
        description:
          "Use stellar design to easily engage users and strengthen their loyalty. Create a seamless experience that keeps them coming back for more.",
        buttonText: "See Tools",
        imageSrc:
          "https://www.shadcnblocks.com/images/block/placeholder-dark-2.svg",
        imageAlt: "placeholder",
      },
    },
    {
      value: "tab-3",
      icon: <Layout className="h-auto w-4 shrink-0" />,
      label: "Stunning Layouts",
      content: {
        badge: "Elite Solutions",
        title: "Build an advanced web experience.",
        description:
          "Lift your brand with modern tech that grabs attention and drives action. Create a digital experience that stands out from the crowd.",
        buttonText: "See Options",
        imageSrc:
          "https://www.shadcnblocks.com/images/block/placeholder-dark-3.svg",
        imageAlt: "placeholder",
      },
    },
  ],
};

export const features = [
  {
    title: "Tech Repairs Made Easy",
    description:
      "From broken screens to hardware malfunctions—IT.GUY makes repair scheduling effortless.",
    icon: <Wrench size={24} />,
  },
  {
    title: "Flexible Booking Options",
    description:
      "Choose your preferred time, opt for home service or drop-off, and manage everything online.",
    icon: <CalendarClock size={24} />,
  },
  {
    title: "Transparent Pricing",
    description:
      "Know the cost upfront—no hidden fees. Pay via Midtrans or cash on delivery (COD).",
    icon: <BadgeDollarSign size={24} />,
  },
  {
    title: "Secure & Reliable Service",
    description:
      "Your data and devices are safe with us. Every repair follows strict security measures.",
    icon: <ShieldCheck size={24} />,
  },
  {
    title: "Track Repair History",
    description:
      "View all past fixes and service details at any time in your account history.",
    icon: <History size={24} />,
  },
  {
    title: "Real-time Updates & Notifications",
    description:
      "Get instant alerts on repair status, booking confirmations, and payment updates.",
    icon: <Bell size={24} />,
  },
  {
    title: "Hassle-Free Rescheduling",
    description:
      "Need to change your booking? Reschedule easily and stay updated via email notifications.",
    icon: <RotateCw size={24} />,
  },
  {
    title: "Admin-Managed Efficiency",
    description:
      "Every booking, payment, and update is handled directly by the admin for a smooth experience.",
    icon: <Settings size={24} />,
  },
];
