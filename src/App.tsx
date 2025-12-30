import { useEffect } from "react";
import { profileData } from "./data/profile";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import F1Background from "./components/background/F1Background";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import ExperienceTimeline from "./components/sections/ExperienceTimeline";
import ProjectsGrid from "./components/sections/ProjectsGrid";
import Education from "./components/sections/Education";
import Skills from "./components/sections/Skills";
import Extracurriculars from "./components/sections/Extracurriculars";
import Contact from "./components/sections/Contact";

export default function App() {
  useEffect(() => {
    // Ensure dark mode is always on (F1 theme is dark)
    document.documentElement.classList.add("dark");
  }, []);

  const menuItems = [
    { label: "HOME", href: "#home" },
    { label: "ABOUT", href: "#about" },
    { label: "EXPERIENCE", href: "#experience" },
    { label: "PROJECTS", href: "#projects" },
    { label: "EDUCATION", href: "#education" },
    { label: "SKILLS", href: "#skills" },
    { label: "EXTRACURRICULARS", href: "#extracurriculars" },
    { label: "CONTACT", href: "#contact" },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: 'var(--asphalt)', color: 'var(--white)' }}>
      {/* F1 Background */}
      <F1Background />

      {/* Navigation */}
      <Navbar items={menuItems} quote={profileData.quote} />

      {/* Main Content */}
      <main>
        <Hero
          firstName={profileData.name.first}
          lastName={profileData.name.last}
          tagline={profileData.tagline}
        />
        <About content={profileData.about} />
        <ExperienceTimeline experiences={profileData.experience} />
        <ProjectsGrid projects={profileData.projects} />
        <Education education={profileData.education} />
        <Skills skills={profileData.skills} />
        <Extracurriculars extracurriculars={profileData.extracurriculars} />
        <Contact
          email={profileData.contact.email}
          phone={profileData.contact.phone}
          location={profileData.contact.location}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
