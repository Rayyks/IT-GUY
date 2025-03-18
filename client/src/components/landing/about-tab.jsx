import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Wrench, CalendarClock, BadgeDollarSign, Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AboutTab = ({
  heading = "Kenapa Memilih IT.GUY?",
  description = "IT.GUY hadir untuk memudahkan perbaikan perangkat teknologi. Seperti apa layanannya?",
  tabs = [
    {
      value: "tab-1",
      icon: <Wrench className="h-auto w-4 shrink-0" />,
      label: "Perbaikan Tanpa Ribet",
      content: {
        badge: "Layanan Mudah",
        title: "Perbaiki perangkat tanpa stres.",
        description:
          "Pesan perbaikan dengan mudah, lacak prosesnya, dan kembali bekerja tanpa gangguan. Kami yang urus semuanya.",
        buttonText: "Pesan Perbaikan",
        imageSrc:
          "https://i.pinimg.com/736x/4c/c4/d7/4cc4d7dccbfd892fdda08bc468e3c7f9.jpg",
        imageAlt: "Proses perbaikan teknologi",
      },
    },
    {
      value: "tab-2",
      icon: <CalendarClock className="h-auto w-4 shrink-0" />,
      label: "Jadwal Fleksibel",
      content: {
        badge: "Atur Waktu Sendiri",
        title: "Booking kapan saja sesuai kebutuhan.",
        description:
          "Pilih waktu yang cocok untukmu. Baik itu perbaikan darurat atau terjadwal, IT.GUY menyesuaikan dengan waktumu.",
        buttonText: "Lihat Ketersediaan",
        imageSrc:
          "https://i.pinimg.com/736x/c5/39/c7/c539c756459556faf825cdf46b149b91.jpg",
        imageAlt: "Jadwal booking fleksibel",
      },
    },
    {
      value: "tab-3",
      icon: <BadgeDollarSign className="h-auto w-4 shrink-0" />,
      label: "Harga Transparan",
      content: {
        badge: "Tanpa Biaya Tersembunyi",
        title: "Ketahui biaya sebelum perbaikan.",
        description:
          "Harga jelas dan transparan—tanpa kejutan. Pilih pembayaran online via Midtrans atau bayar di tempat (COD).",
        buttonText: "Cek Harga",
        imageSrc:
          "https://i.pinimg.com/736x/36/b0/60/36b0601693375e3358a7d134c5a2b37f.jpg",
        imageAlt: "Transparansi harga",
      },
    },
    {
      value: "tab-4",
      icon: <Bell className="h-auto w-4 shrink-0" />,
      label: "Notifikasi Real-Time",
      content: {
        badge: "Selalu Update",
        title: "Dapatkan status perbaikan secara instan.",
        description:
          "Dari konfirmasi booking hingga perbaikan selesai, terima notifikasi real-time agar selalu tahu perkembangan layanan.",
        buttonText: "Aktifkan Notifikasi",
        imageSrc:
          "https://i.pinimg.com/736x/22/1e/3a/221e3a7b3d0e97157543364e4e32ed09.jpg",
        imageAlt: "Notifikasi live",
      },
    },
  ],
}) => {
  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="max-w-2xl text-3xl font-semibold md:text-4xl text-white">
            {heading}
          </h1>
          <p className="text-neutral-400">{description}</p>
        </div>
        <Tabs defaultValue={tabs[0].value} className="mt-8">
          <TabsList className="container flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-10">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-8 max-w-screen-xl rounded-2xl bg-muted/70 p-6 lg:p-16">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-20 lg:grid-cols-2 lg:gap-10"
              >
                <div className="flex flex-col gap-5">
                  <Badge variant="outline" className="w-fit bg-background">
                    {tab.content.badge}
                  </Badge>
                  <h3 className="text-3xl font-semibold lg:text-5xl">
                    {tab.content.title}
                  </h3>
                  <p className="text-neutral-700 lg:text-lg">
                    {tab.content.description}
                  </p>
                  <Button className="mt-2.5 w-fit gap-2" size="lg">
                    {tab.content.buttonText}
                  </Button>
                </div>
                <img
                  src={tab.content.imageSrc}
                  alt={tab.content.imageAlt}
                  className="rounded-xl"
                  loading=""
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { AboutTab };
