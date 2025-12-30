import { Linkedin, Github, Mail } from "lucide-react";

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
}

export default function Footer() {
  const socialLinks: SocialLink[] = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/thrishalreddy-i-4089a8207/",
      icon: <Linkedin className="w-5 h-5" />,
    },
    {
      name: "GitHub",
      url: "https://github.com/trishal02",
      icon: <Github className="w-5 h-5" />,
    },
    {
      name: "Email",
      url: "mailto:tindireddy@binghamton.edu",
      icon: <Mail className="w-5 h-5" />,
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="carbon-fiber border-t py-8 px-6"
      style={{ borderTopColor: "rgba(220, 38, 38, 0.3)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Social Links */}
        <div className="flex justify-center items-center gap-6 mb-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target={link.url.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 hover:glow-red"
              style={{
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                color: "#DC2626",
                border: "1px solid rgba(220, 38, 38, 0.3)",
              }}
              aria-label={`Visit ${link.name} profile`}
            >
              {link.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p 
            className="text-sm font-body mb-2"
            style={{ color: "#6B7280" }}
          >
            © {currentYear} Trishal Reddy Indireddy. All rights reserved.
          </p>
          <p 
            className="text-xs font-body"
            style={{ color: "#6B7280" }}
          >
            Built with React, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
