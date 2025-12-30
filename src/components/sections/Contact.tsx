import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import Section from "../layout/Section";
import Card from "../ui/Card";
import Button from "../ui/Button";

interface ContactProps {
  email: string;
  phone: string;
  location: string;
}

export default function Contact({ email, phone, location }: ContactProps) {
  return (
    <Section
      id="contact"
      title="Contact"
      className="max-w-4xl mx-auto relative"
    >
      <Card className="text-center">
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-4">
              Let's Connect
            </h3>
            <p className="text-metallic-gray-light font-body text-lg">
              Ready to collaborate or discuss opportunities
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <a
              href={`mailto:${email}`}
              className="text-xl md:text-3xl font-display font-bold text-racing-red hover:text-racing-red-light transition-colors flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-racing-red rounded"
            >
              <Mail className="w-6 h-6 md:w-8 md:h-8" />
              {email}
            </a>

            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="text-lg md:text-2xl font-body text-metallic-gray-light hover:text-white transition-colors flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-racing-red rounded"
            >
              <Phone className="w-5 h-5 md:w-6 md:h-6" />
              {phone}
            </a>

            <div className="flex items-center gap-3 text-metallic-gray-light">
              <MapPin className="w-5 h-5 md:w-6 md:h-6" />
              <span className="font-body">{location}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button
              variant="primary"
              onClick={() => {
                window.open("https://linkedin.com", "_blank");
              }}
              className="flex items-center gap-2"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.open("https://github.com", "_blank");
              }}
              className="flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              GitHub
            </Button>
          </div>
        </div>
      </Card>
    </Section>
  );
}
