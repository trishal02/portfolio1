import { ChevronDown, Download, Mail } from "lucide-react";
import Button from "../ui/Button";
import BlurText from "../BlurText";

interface HeroProps {
  firstName: string;
  lastName: string;
  tagline: string;
  resumeUrl?: string;
}

export default function Hero({
  firstName,
  lastName,
  tagline,
  resumeUrl = "/Trishal_Reddy_Indireddy_2.pdf",
}: HeroProps) {
  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = "Trishal_Reddy_Indireddy_Resume.pdf";
    link.click();
  };

  const handleContact = () => {
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20"
    >
      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Name */}
        <div className="mb-8">
          <BlurText
            text={firstName}
            delay={80}
            animateBy="letters"
            direction="top"
            className="font-display font-black text-[10vw] md:text-[8vw] leading-[0.9] tracking-tighter uppercase justify-center whitespace-nowrap"
            style={{ color: "#DC2626" }}
          />
          <BlurText
            text={lastName}
            delay={80}
            animateBy="letters"
            direction="top"
            className="font-display font-black text-[10vw] md:text-[8vw] leading-[0.9] tracking-tighter uppercase justify-center whitespace-nowrap"
            style={{ color: "#DC2626" }}
          />
        </div>

        {/* Tagline */}
        <div className="mb-12">
          <BlurText
            text={tagline}
            delay={50}
            animateBy="words"
            direction="bottom"
            className="text-lg md:text-2xl font-body font-light tracking-widest uppercase"
            style={{ color: "#9CA3AF" }}
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="primary"
            onClick={handleDownloadResume}
            className="flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Resume
          </Button>
          <Button
            variant="outline"
            onClick={handleContact}
            className="flex items-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Contact Me
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer p-2 transition-colors hover:text-racing-red focus:outline-none focus:ring-2 focus:ring-racing-red rounded"
        aria-label="Scroll down to About section"
      >
        <ChevronDown className="w-8 h-8" style={{ color: "rgba(220, 38, 38, 0.6)" }} />
      </a>
    </section>
  );
}
