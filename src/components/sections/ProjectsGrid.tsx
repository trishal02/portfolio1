import { Github, ExternalLink } from "lucide-react";
import Section from "../layout/Section";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import type { Project } from "../../data/profile";

interface ProjectsGridProps {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <Section id="projects" title="Projects" className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <Card key={index} hover>
            {/* Impact Line */}
            {project.impact && (
              <div 
                className="mb-4 p-3 rounded border-l-4"
                style={{
                  backgroundColor: "rgba(220, 38, 38, 0.1)",
                  borderLeftColor: "#DC2626",
                }}
              >
                <p className="text-sm leading-relaxed" style={{ color: "#FFFFFF" }}>
                  <span className="font-display font-semibold" style={{ color: "#DC2626" }}>
                    Impact:
                  </span>{" "}
                  {project.impact}
                </p>
              </div>
            )}

            <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
              <h3 className="text-2xl font-display font-bold" style={{ color: "#FFFFFF" }}>
                {project.title}
              </h3>
              <Badge variant="hard" className="whitespace-nowrap">
                {project.period}
              </Badge>
            </div>

            <p 
              className="mb-6 leading-relaxed"
              style={{ color: "#9CA3AF" }}
            >
              {project.description}
            </p>

            <div className="mb-6">
              <p 
                className="text-sm font-display font-bold mb-3 uppercase tracking-wider"
                style={{ color: "#FFFFFF" }}
              >
                Tech Stack:
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.split(", ").map((tech, i) => (
                  <Badge key={i} variant="default">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <ul className="space-y-2.5 mb-6">
              {project.points.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start leading-relaxed"
                  style={{ color: "#9CA3AF" }}
                >
                  <span 
                    className="mr-3 mt-1.5 font-bold flex-shrink-0"
                    style={{ color: "#DC2626" }}
                  >
                    ▸
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Action Links */}
            {(project.github || project.demo) && (
              <div 
                className="pt-4 border-t flex gap-4 flex-wrap"
                style={{ borderTopColor: "rgba(220, 38, 38, 0.2)" }}
              >
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-display font-medium transition-colors hover:opacity-80"
                    style={{ color: "#9CA3AF" }}
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-display font-medium transition-colors hover:opacity-80"
                    style={{ color: "#9CA3AF" }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </Section>
  );
}
