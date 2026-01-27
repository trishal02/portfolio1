import { useState, useEffect, useRef } from "react";
import { Menu, X, Gauge } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

export type PerformancePref = "off" | "auto" | "low" | "high";

interface NavbarProps {
  items: NavItem[];
  quote: string;
  performancePref?: PerformancePref;
  onPerformancePrefChange?: (value: PerformancePref) => void;
}

const PERF_OPTIONS: { value: PerformancePref; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "auto", label: "Auto" },
  { value: "low", label: "Low" },
  { value: "high", label: "High" },
];

export default function Navbar({
  items,
  quote,
  performancePref = "auto",
  onPerformancePrefChange,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [perfMenuOpen, setPerfMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const perfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
      if (
        perfMenuOpen &&
        perfRef.current &&
        !perfRef.current.contains(target)
      ) {
        setPerfMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, perfMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = items.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop } = element;
          if (scrollPosition >= offsetTop) {
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
      className="fixed top-0 left-0 right-0 z-50 carbon-fiber border-b pit-wall-border backdrop-blur-sm"
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
                    style={{ 
                      color: isActive ? "#DC2626" : "#FFFFFF",
                      borderLeft: isActive ? "3px solid #DC2626" : "3px solid transparent",
                      paddingLeft: isActive ? "0.5rem" : "0.5rem",
                    }}
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

        {/* Performance toggle: Off / Auto / Low / High */}
        <div className="relative" ref={perfRef}>
          <button
            type="button"
            className="p-2 rounded transition-colors duration-300 focus:outline-none focus:ring-2 flex items-center gap-1"
            style={{ color: "rgba(255, 255, 255, 0.85)" }}
            aria-label="Background performance"
            aria-haspopup="listbox"
            aria-expanded={perfMenuOpen}
            onClick={() => setPerfMenuOpen((o) => !o)}
          >
            <Gauge className="w-4 h-4" strokeWidth={2} />
            <span className="text-xs font-mono hidden sm:inline capitalize">{performancePref}</span>
          </button>
          {perfMenuOpen && onPerformancePrefChange && (
            <div
              className="absolute top-full right-0 mt-2 w-32 carbon-fiber border rounded-lg shadow-xl p-1 z-[100]"
              style={{ borderColor: "rgba(220, 38, 38, 0.5)" }}
              role="listbox"
              aria-label="Performance mode"
            >
              {PERF_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={performancePref === opt.value}
                  className={`block w-full text-left text-xs font-mono py-2 px-3 rounded capitalize transition-colors ${
                    performancePref === opt.value ? "glow-red" : ""
                  }`}
                  style={{
                    color: performancePref === opt.value ? "#DC2626" : "#FFFFFF",
                  }}
                  onClick={() => {
                    onPerformancePrefChange(opt.value);
                    setPerfMenuOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
