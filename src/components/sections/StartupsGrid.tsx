import { useState } from "react";
import { Github, FileText, Play } from "lucide-react";
import Section from "../layout/Section";
import Card from "../ui/Card";
import Chip from "../ui/Chip";
import Badge from "../ui/Badge";
import type { Project } from "../../data/profile";

interface StartupsGridProps {
  startups: Project[];
}

export default function StartupsGrid({ startups }: StartupsGridProps) {
  return (
    <Section id="startups" title="Startups" className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map((startup, index) => (
          <StartupCard key={index} startup={startup} isFeatured={index === 0} />
        ))}
      </div>
    </Section>
  );
}

interface StartupCardProps {
  startup: Project;
  isFeatured?: boolean;
}

function StartupCard({ startup, isFeatured = false }: StartupCardProps) {
  const [showAll, setShowAll] = useState(false);
  const maxBullets = 4;
  const hasMoreBullets = startup.points.length > maxBullets;
  const displayedBullets = showAll
    ? startup.points
    : startup.points.slice(0, maxBullets);

  return (
    <Card hover className="flex flex-col h-full">
      {/* Impact Line */}
      {startup.impact && (
        <div
          className="mb-4 p-3 rounded border-l-4"
          style={{
            backgroundColor: "rgba(220, 38, 38, 0.1)",
            borderLeftColor: "#DC2626",
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "#FFFFFF" }}>
            <span
              className="font-display font-semibold"
              style={{ color: "#DC2626" }}
            >
              Impact:
            </span>{" "}
            {startup.impact}
          </p>
        </div>
      )}

      {/* Title and Period */}
      <div className="mb-3">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className="text-xl font-display font-bold leading-tight"
              style={{ color: "#FFFFFF" }}
            >
              {startup.title}
            </h3>
            <Badge variant="hard" className="text-xs">
              Startup
            </Badge>
            {isFeatured && (
              <Badge variant="hard" className="text-xs">
                Featured
              </Badge>
            )}
            {startup.title.includes("AEGIS") && (
              <Badge variant="default" className="text-xs">
                MIT License
              </Badge>
            )}
          </div>
          <Chip
            variant="hard"
            className="whitespace-nowrap text-xs flex-shrink-0"
          >
            {startup.period}
          </Chip>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm mb-4 leading-relaxed" style={{ color: "#9CA3AF" }}>
        {startup.description}
      </p>

      {/* Tech Chips */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {startup.tech.split(", ").map((tech, i) => (
            <Chip key={i} variant="default" className="text-xs">
              {tech.trim()}
            </Chip>
          ))}
        </div>
      </div>

      {/* Bullets */}
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
          {showAll
            ? "Show less"
            : `Show ${startup.points.length - maxBullets} more`}
        </button>
      )}

      {/* Action Links Row */}
      {(startup.github || startup.demo || startup.paper) && (
        <div
          className="pt-4 mt-auto border-t flex gap-3 flex-wrap"
          style={{ borderTopColor: "rgba(220, 38, 38, 0.2)" }}
        >
          {startup.github && (
            <a
              href={startup.github}
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
          {startup.demo && (
            <a
              href={startup.demo}
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
          {startup.paper && (
            <a
              href={startup.paper}
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
