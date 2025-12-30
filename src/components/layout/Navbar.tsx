import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  items: NavItem[];
  quote: string;
}

export default function Navbar({ items, quote }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = items.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 carbon-fiber border-b pit-wall-border"
      style={{ borderBottomColor: "rgba(220, 38, 38, 0.3)" }}
    >
      <nav className="flex items-center justify-between max-w-screen-2xl mx-auto px-6 py-4">
        {/* Menu Button */}
        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            className="p-2 transition-colors duration-300 z-[60] focus:outline-none focus:ring-2 rounded"
            style={{ color: "#FFFFFF" }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X
                className="w-6 h-6 transition-colors duration-300"
                strokeWidth={2}
              />
            ) : (
              <Menu
                className="w-6 h-6 transition-colors duration-300"
                strokeWidth={2}
              />
            )}
          </button>

          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute top-full left-0 w-[200px] md:w-[240px] carbon-fiber border shadow-2xl mt-2 ml-4 p-4 rounded-lg z-[100] glow-red"
              style={{ borderColor: "rgba(220, 38, 38, 0.5)" }}
              role="menu"
            >
              {items.map((item) => {
                const sectionId = item.href.substring(1);
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`block text-base md:text-lg font-display font-bold tracking-wider py-2 px-2 cursor-pointer transition-all duration-300 ${
                      isActive ? "glow-red" : ""
                    }`}
                    style={{ color: isActive ? "#DC2626" : "#FFFFFF" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    role="menuitem"
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Quote */}
        <div 
          className="text-xs md:text-sm font-body font-medium tracking-wide italic text-center max-w-xs"
          style={{ color: "rgba(220, 38, 38, 0.8)" }}
        >
          "{quote}"
        </div>

        {/* Placeholder for symmetry */}
        <div className="w-10" />
      </nav>
    </header>
  );
}
