import { useState } from "react";
import { Github, FileText, Play } from "lucide-react";
import Section from "../layout/Section";
import Card from "../ui/Card";
import Chip from "../ui/Chip";
import type { Project } from "../../data/profile";

interface ProjectsGridProps {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <Section id="projects" title="Projects" className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </Section>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const [showAll, setShowAll] = useState(false);
  const maxBullets = 3;
  const hasMoreBullets = project.points.length > maxBullets;
  const displayedBullets = showAll
    ? project.points
    : project.points.slice(0, maxBullets);

  return (
    <Card hover className="flex flex-col h-full">
      {/* Title and Period */}
      <div className="mb-3">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3
            className="text-xl font-display font-bold leading-tight"
            style={{ color: "#FFFFFF" }}
          >
            {project.title}
          </h3>
          <Chip variant="hard" className="whitespace-nowrap text-xs flex-shrink-0">
            {project.period}
          </Chip>
        </div>
      </div>

      {/* 1-line Summary */}
      <p
        className="text-sm mb-4 leading-relaxed line-clamp-2"
        style={{ color: "#9CA3AF" }}
      >
        {project.description}
      </p>

      {/* Tech Chips */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {project.tech.split(", ").map((tech, i) => (
            <Chip key={i} variant="default" className="text-xs">
              {tech.trim()}
            </Chip>
          ))}
        </div>
      </div>

      {/* Bullets (2-4 shown by default) */}
      <ul className="space-y-2 mb-4 flex-grow">
        {displayedBullets.map((point, i) => (
          <li
            key={i}
            className="flex items-start text-sm leading-relaxed"
            style={{ color: "#9CA3AF" }}
          >
            <span
              className="mr-2 mt-1.5 font-bold flex-shrink-0"
              style={{ color: "#DC2626" }}
            >
              ▸
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {/* Show More Toggle */}
      {hasMoreBullets && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs font-display font-semibold uppercase tracking-wider mb-4 text-left transition-colors hover:opacity-80"
          style={{ color: "#DC2626" }}
          aria-label={showAll ? "Show less" : "Show more"}
        >
          {showAll ? "Show less" : `Show ${project.points.length - maxBullets} more`}
        </button>
      )}

      {/* Action Links Row */}
      {(project.github || project.demo || project.paper) && (
        <div
          className="pt-4 mt-auto border-t flex gap-3 flex-wrap"
          style={{ borderTopColor: "rgba(220, 38, 38, 0.2)" }}
        >
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-display font-medium transition-colors hover:opacity-80"
              style={{ color: "#9CA3AF" }}
              aria-label="View on GitHub"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-display font-medium transition-colors hover:opacity-80"
              style={{ color: "#9CA3AF" }}
              aria-label="View live demo"
            >
              <Play className="w-3.5 h-3.5" />
              Live
            </a>
          )}
          {project.paper && (
            <a
              href={project.paper}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-display font-medium transition-colors hover:opacity-80"
              style={{ color: "#9CA3AF" }}
              aria-label="View paper"
            >
              <FileText className="w-3.5 h-3.5" />
              Paper
            </a>
          )}
        </div>
      )}
    </Card>
  );
}
