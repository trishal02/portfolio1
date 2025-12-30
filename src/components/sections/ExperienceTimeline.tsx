import Section from "../layout/Section";
import TimelineItem from "../ui/TimelineItem";
import type { Experience } from "../../data/profile";

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export default function ExperienceTimeline({
  experiences,
}: ExperienceTimelineProps) {
  return (
    <Section
      id="experience"
      title="Work Experience"
      className="max-w-6xl mx-auto"
    >
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <TimelineItem
            key={index}
            title={exp.company}
            subtitle={exp.role}
            period={exp.period}
            points={exp.points}
            isLast={index === experiences.length - 1}
          />
        ))}
      </div>
    </Section>
  );
}
