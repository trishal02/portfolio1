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
            <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
              <h3 className="text-2xl font-display font-bold text-white group-hover:text-racing-red transition-colors">
                {project.title}
              </h3>
              <Badge variant="hard" className="whitespace-nowrap">
                {project.period}
              </Badge>
            </div>

            <p className="mb-6 text-metallic-gray-light leading-relaxed min-h-[60px]">
              {project.description}
            </p>

            <div className="mb-6">
              <p className="text-sm font-display font-bold mb-2 text-white uppercase tracking-wider">
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

            <ul className="space-y-2 text-sm">
              {project.points.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start text-metallic-gray-light leading-relaxed"
                >
                  <span className="text-racing-red mr-3 mt-1.5 font-bold">
                    ▸
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}
