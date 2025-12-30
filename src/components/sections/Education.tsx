import Section from "../layout/Section";
import FlipCard from "../ui/FlipCard";
import Badge from "../ui/Badge";
import type { Education } from "../../data/profile";

interface EducationProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationProps) {
  return (
    <Section id="education" title="Education" className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {education.map((edu, index) => (
          <FlipCard
            key={index}
            front={
              <div
                className="carbon-fiber border rounded-lg p-6 h-full min-h-[300px] flex flex-col backdrop-blur-md"
                style={{
                  borderColor: "rgba(220, 38, 38, 0.3)",
                  backgroundColor: "rgba(15, 23, 42, 0.4)",
                }}
              >
                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                  <h3
                    className="text-xl font-display font-bold"
                    style={{ color: "#FFFFFF" }}
                  >
                    {edu.institution}
                  </h3>
                  <Badge variant="soft">{edu.gpa}</Badge>
                </div>
                <p
                  className="font-body font-semibold text-lg mb-4"
                  style={{ color: "#DC2626" }}
                >
                  {edu.degree}
                </p>
                {edu.courses && edu.courses.length > 0 && (
                  <p
                    className="text-xs font-body mt-auto pt-4 border-t"
                    style={{
                      color: "rgba(156, 163, 175, 0.7)",
                      borderTopColor: "rgba(220, 38, 38, 0.2)",
                    }}
                  >
                    Hover / Tap to view coursework
                  </p>
                )}
              </div>
            }
            back={
              <div
                className="carbon-fiber border rounded-lg p-6 h-full min-h-[300px] flex flex-col backdrop-blur-md"
                style={{
                  borderColor: "rgba(220, 38, 38, 0.3)",
                  backgroundColor: "rgba(15, 23, 42, 0.4)",
                }}
              >
                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                  <h3
                    className="text-xl font-display font-bold"
                    style={{ color: "#FFFFFF" }}
                  >
                    {edu.institution}
                  </h3>
                  <Badge variant="soft">{edu.gpa}</Badge>
                </div>
                <p
                  className="font-body font-semibold text-lg mb-4"
                  style={{ color: "#DC2626" }}
                >
                  {edu.degree}
                </p>

                {edu.courses && edu.courses.length > 0 && (
                  <div className="flex-grow overflow-hidden flex flex-col">
                    <h4
                      className="text-sm font-display font-bold uppercase tracking-wider mb-3"
                      style={{ color: "#DC2626" }}
                    >
                      Relevant Coursework
                    </h4>
                    <div
                      className="overflow-y-auto flex-grow pr-2"
                      style={{ scrollbarWidth: "thin", maxHeight: "400px" }}
                    >
                      <ul className="space-y-2">
                        {edu.courses.map((course, i) => (
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
                            <span>{course}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            }
          />
        ))}
      </div>
    </Section>
  );
}
