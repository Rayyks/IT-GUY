import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(() => ["Luar Biasa", "Baru", "Unik", "Cerdas"], []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4">
              Read our launch article <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">Ini sesuatu yang</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: -100 }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Mengelola ekspektasi klien adalah aspek penting dari peran saya.
              Untuk Untuk menyederhanakan prosesnya, saya membuat situs web ini,
              sehingga memudahkan klien saya untuk menjadwalkan panggilan dengan
              saya untuk mendapatkan dukungan TI. memudahkan klien saya untuk
              menjadwalkan panggilan dengan saya untuk mendapatkan dukungan TI.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <ScrollLink to="about" smooth={true} duration={500}>
              <Button
                size="lg"
                className="gap-4 cursor-pointer"
                variant="outline"
              >
                Learn More <PhoneCall className="w-4 h-4" />
              </Button>
            </ScrollLink>
            <Link to="/auth/signup">
              <Button size="lg" className="gap-4 cursor-pointer">
                Sign up here <MoveRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
