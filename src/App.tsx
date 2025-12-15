import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, MapPin } from "lucide-react";
import BlurText from "./components/BlurText";

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

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

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const menuItems = [
    { label: "HOME", href: "#home", highlight: true },
    { label: "ABOUT", href: "#about" },
    { label: "EXPERIENCE", href: "#experience" },
    { label: "PROJECTS", href: "#projects" },
    { label: "EDUCATION", href: "#education" },
    { label: "SKILLS", href: "#skills" },
    { label: "CONTACT", href: "#contact" },
  ];

  const experience = [
    {
      company: "BINGHAMTON UNIVERSITY",
      role: "Research Intern",
      period: "Jan 2025 - Oct 2025",
      points: [
        "Developed a scalable PySpark pipeline to preprocess large-scale social media datasets and applied transformer-based models (DistilBERT, RoBERTa, ViT) to classify AI-generated versus authentic content.",
        "Implemented clustering and visualization workflows with LDA and Plotly to identify misinformation patterns and trends."
      ]
    },
    {
      company: "Bright Curve IT Solutions",
      role: "Software Developer",
      period: "Aug 2021 - Jun 2023",
      points: [
        "Designed and constructed an orchestrated pipeline to process Outlook emails, extracting log paths and parsing log content with Python, while fine-tuning an LLaMA model for test case generation.",
        "Deployed a Jenkins-based automation system using TF-IDF matching to detect duplicate issues, reducing manual effort by 60%.",
        "Refactored legacy codebase into microservices using Spring Boot, Docker, and Kubernetes, improving deployment frequency by 18%.",
        "Implemented RESTful APIs to exclude high-propensity users, driving a 17% revenue boost.",
        "Developed real-time Grafana dashboards integrated with Slack and Splunk, cutting incident resolution time by 45%."
      ]
    },
    {
      company: "Bright Curve IT Solutions",
      role: "Software Developer Intern",
      period: "Jan 2021 - Apr 2021",
      points: [
        "Built a RESTful microservice to optimize offer distribution, reducing response time by 40% for over 15,000 daily users.",
        "Improved reliability by achieving 80% unit test coverage through TDD, reducing production bugs by 25%.",
        "Resolved over 300+ real-time bugs during deployment, significantly enhancing system stability."
      ]
    }
  ];

  const projects = [
    {
      title: "Social Media Election Analysis Platform",
      period: "Sep 2024 - Dec 2024",
      description: "Developed a data pipeline to collect election discussions from Reddit and 4chan.",
      tech: "Python, PostgreSQL, OAuth, Data Pipeline",
      points: [
        "Designed scalable PostgreSQL architecture achieving 90%+ uptime with 127K+ Reddit posts daily.",
        "Tackled API limitations and dynamic data filtering for continuous data flow."
      ]
    },
    {
      title: "Crime Analysis and Prediction System",
      period: "Oct 2022 - Mar 2023",
      description: "Predictive analytics system using PySpark to forecast crime patterns.",
      tech: "PySpark, LSTM, Prophet, Pandas",
      points: [
        "Forecasted crime patterns and identified high-risk areas using distributed Spark clusters.",
        "Engineered a scalable data processing pipeline to generate crime hotspot visualizations for law enforcement."
      ]
    }
  ];

  return (
    <div
      className="min-h-screen transition-colors font-sans"
      style={{
        backgroundColor: isDark ? "hsl(0 0% 0%)" : "hsl(0 0% 98%)",
        color: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)",
      }}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 mix-blend-difference text-white">
        <nav className="flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Menu Button */}
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              className="p-2 transition-colors duration-300 z-[60] hover:text-[#C3E41D]"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-8 h-8 transition-colors duration-300" strokeWidth={2} />
              ) : (
                <Menu className="w-8 h-8 transition-colors duration-300" strokeWidth={2} />
              )}
            </button>

            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute top-full left-0 w-[200px] md:w-[240px] border-none shadow-2xl mt-2 ml-4 p-4 rounded-lg z-[100] backdrop-blur-md"
                style={{
                  backgroundColor: isDark ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.9)",
                  color: isDark ? "white" : "black"
                }}
              >
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-lg md:text-xl font-bold tracking-tight py-1.5 px-2 cursor-pointer transition-colors duration-300 hover:text-[#C3E41D]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Signature */}
          <div className="text-3xl font-bold tracking-tighter" style={{ fontFamily: "'Fira Code', monospace" }}>
            TRI
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full transition-colors border border-neutral-700"
            style={{ backgroundColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)" }}
            aria-label="Toggle theme"
          >
            <div
              className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full transition-transform duration-300 bg-white shadow-sm"
              style={{
                transform: isDark ? "translateX(1.75rem)" : "translateX(0)",
              }}
            />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Centered Main Name */}
        <div className="relative z-10 text-center px-4">
          <div>
            <BlurText
              text="TRISHAL"
              delay={80}
              animateBy="letters"
              direction="top"
              className="font-black text-[12vw] leading-[0.8] tracking-tighter uppercase justify-center whitespace-nowrap"
              style={{ color: "#C3E41D", fontFamily: "'Inter', sans-serif" }}
            />
          </div>
          <div>
            <BlurText
              text="REDDY"
              delay={80}
              animateBy="letters"
              direction="top"
              className="font-black text-[12vw] leading-[0.8] tracking-tighter uppercase justify-center whitespace-nowrap"
              style={{ color: "#C3E41D", fontFamily: "'Inter', sans-serif" }}
            />
          </div>

          {/* Profile Picture Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none mix-blend-difference hidden md:block">
            {/* You can add a profile image here if available, currently using placeholder or effect */}
          </div>
        </div>

        {/* Tagline */}
        <div className="absolute bottom-20 left-0 right-0 px-6 text-center">
          <BlurText
            text="Software Developer | C++ & Python | Distributed Systems"
            delay={50}
            animateBy="words"
            direction="bottom"
            className="text-lg md:text-2xl font-light tracking-widest uppercase text-neutral-500"
          />
        </div>

        {/* Scroll Indicator */}
        <a
          href="#about"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer p-2"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-8 h-8 text-neutral-500" />
        </a>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-sm font-bold tracking-widest text-[#C3E41D] mb-8 uppercase">About Me</h2>
        <p className="text-2xl md:text-4xl font-light leading-relaxed">
          Software Developer with expertise in <span className="text-[#C3E41D]">C++ and Python</span>, specializing in backend development and distributed computing.
          Experienced in designing scalable, data-driven applications. Certified in AWS Cloud, with a passion for leveraging technical skills to enhance backend engineering projects.
        </p>
      </section>

      {/* Experience Section */}
      <section id="experience" className="px-6 py-20 max-w-6xl mx-auto bg-neutral-50/5 dark:bg-neutral-900/20 rounded-3xl my-10">
        <h2 className="text-sm font-bold tracking-widest text-[#C3E41D] mb-12 uppercase">Work Experience</h2>
        <div className="space-y-16">
          {experience.map((job, index) => (
            <div key={index} className="grid md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <h3 className="text-xl font-bold">{job.company}</h3>
                <p className="text-neutral-500 mt-1 text-sm">{job.period}</p>
              </div>
              <div className="md:col-span-3">
                <h4 className="text-2xl font-semibold mb-4 text-[#C3E41D]">{job.role}</h4>
                <ul className="space-y-3 text-neutral-400">
                  {job.points.map((point, i) => (
                    <li key={i} className="leading-relaxed flex items-start">
                      <span className="mr-3 opacity-50 mt-1.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-sm font-bold tracking-widest text-[#C3E41D] mb-12 uppercase">Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="group border border-neutral-200 dark:border-neutral-800 p-8 rounded-2xl hover:border-[#C3E41D] transition-colors duration-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold group-hover:text-[#C3E41D] transition-colors">{project.title}</h3>
                <span className="text-xs font-mono py-1 px-2 rounded-full border border-neutral-700 text-neutral-500">{project.period}</span>
              </div>
              <p className="text-neutral-400 mb-6 min-h-[50px]">{project.description}</p>
              <div className="mb-6">
                <p className="text-sm font-bold text-neutral-300 mb-2">Tech: <span className="text-neutral-500 font-normal">{project.tech}</span></p>
              </div>
              <ul className="space-y-2 text-sm text-neutral-500">
                {project.points.map((pt, i) => (
                  <li key={i}>• {pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education & Skills */}
      <section id="education" className="px-6 py-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-[#C3E41D] mb-8 uppercase">Education</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold">Binghamton University, SUNY</h3>
              <p className="text-[#C3E41D]">Master's, Computer Science</p>
              <p className="text-neutral-500 text-sm">GPA: 3.53/4</p>
            </div>
            <div>
              <h3 className="text-xl font-bold">Indian Institute of Information & Technology, Kottayam</h3>
              <p className="text-[#C3E41D]">Bachelor of Technology, CSE</p>
              <p className="text-neutral-500 text-sm">GPA: 3.6/4</p>
            </div>
          </div>
        </div>
        <div id="skills">
          <h2 className="text-sm font-bold tracking-widest text-[#C3E41D] mb-8 uppercase">Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {["Python", "C++", "Java", "JavaScript", "AWS", "Docker", "Kubernetes", "React", "PostgreSQL", "MongoDB", "PySpark", "Git", "Linux", "RESTful APIs"].map((skill) => (
              <span key={skill} className="px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm font-medium hover:bg-[#C3E41D] hover:text-black transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 py-32 text-center bg-neutral-900 text-white relative">
        <h2 className="text-sm font-bold tracking-widest text-[#C3E41D] mb-8 uppercase">Contact</h2>
        <div className="flex flex-col items-center gap-6">
          <a href="mailto:tindireddy@binghamton.edu" className="text-3xl md:text-5xl font-bold hover:text-[#C3E41D] transition-colors">
            tindireddy@binghamton.edu
          </a>
          <p className="text-xl text-neutral-400">+1-607-232-1218</p>
          <div className="flex gap-4 mt-8">
            <div className="flex items-center gap-2 text-neutral-500">
              <MapPin className="w-5 h-5" />
              <span>Binghamton, NY</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-0 right-0 text-center text-neutral-700 text-sm">
          © {new Date().getFullYear()} Trishal Reddy Indireddy.
        </div>
      </section>
    </div>
  );
}
