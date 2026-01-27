import { useEffect, useState } from "react";
import { profileData } from "./data/profile";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import BackgroundManager from "./components/background/BackgroundManager";
import type { BackgroundMode } from "./components/background/BackgroundManager";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import ExperienceTimeline from "./components/sections/ExperienceTimeline";
import ProjectsGrid from "./components/sections/ProjectsGrid";
import StartupsGrid from "./components/sections/StartupsGrid";
import Education from "./components/sections/Education";
import Skills from "./components/sections/Skills";
import ExtracurricularGrid from "./components/sections/ExtracurricularGrid";
import LeadershipGrid from "./components/sections/LeadershipGrid";
import Contact from "./components/sections/Contact";

const STORAGE_KEY = "trishal-bg-perf";
type PerfPref = "off" | "auto" | "low" | "high";

function perfToMode(p: PerfPref): BackgroundMode {
  if (p === "off") return "static";
  if (p === "low") return "light";
  if (p === "high") return "full";
  return "auto";
}

function getInitialPerfPref(): PerfPref {
  if (typeof localStorage === "undefined") return "auto";
  const stored = localStorage.getItem(STORAGE_KEY) as PerfPref | null;
  return stored && ["off", "auto", "low", "high"].includes(stored) ? stored : "auto";
}

export default function App() {
  const [perfPref, setPerfPref] = useState<PerfPref>(getInitialPerfPref);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const setAndPersistPerf = (value: PerfPref) => {
    setPerfPref(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  const menuItems = [
    { label: "HOME", href: "#home" },
    { label: "ABOUT", href: "#about" },
    { label: "EDUCATION", href: "#education" },
    { label: "EXPERIENCE", href: "#experience" },
    { label: "STARTUPS", href: "#startups" },
    { label: "PROJECTS", href: "#projects" },
    { label: "SKILLS", href: "#skills" },
    { label: "LEADERSHIP", href: "#leadership" },
    { label: "EXTRACURRICULARS", href: "#extracurriculars" },
    { label: "CONTACT", href: "#contact" },
  ];

  return (
    <div
      className="min-h-screen relative overflow-x-hidden bg-transparent"
      style={{ color: "var(--white)" }}
    >
      <BackgroundManager mode={perfToMode(perfPref)} variant="aurora" />

      <Navbar
        items={menuItems}
        quote={profileData.quote}
        performancePref={perfPref}
        onPerformancePrefChange={setAndPersistPerf}
      />

      <main className="relative z-0">
        <Hero
          firstName={profileData.name.first}
          lastName={profileData.name.last}
          tagline={profileData.tagline}
        />
        <About content={profileData.about} />
        <Education education={profileData.education} />
        <ExperienceTimeline experiences={profileData.experience} />
        <StartupsGrid startups={profileData.startups} />
        <ProjectsGrid projects={profileData.projects} />
        <Skills />
        <LeadershipGrid />
        <ExtracurricularGrid />
        <Contact
          email={profileData.contact.email}
          phone={profileData.contact.phone}
          location={profileData.contact.location}
        />
      </main>

      <Footer />
    </div>
  );
}
