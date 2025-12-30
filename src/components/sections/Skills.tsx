import { useEffect, useState } from "react";
import Section from "../layout/Section";
import Card from "../ui/Card";
import { skillGroups, type SkillTier } from "../../data/skills";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

export default function Skills() {
  const tiers: {
    tier: SkillTier;
    label: string;
    color: string;
    baseProficiency: number;
  }[] = [
    {
      tier: "high",
      label: "High Performance",
      color: "#10B981",
      baseProficiency: 90,
    },
    {
      tier: "intermediate",
      label: "Intermediate",
      color: "#FBBF24",
      baseProficiency: 70,
    },
    {
      tier: "beginner",
      label: "Beginner",
      color: "#DC2626",
      baseProficiency: 50,
    },
  ];

  const getSkillsByTier = (tier: SkillTier) => {
    return skillGroups.filter((group) => group.tier === tier);
  };

  const { elementRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <Section id="skills" title="Technical Skills" className="max-w-7xl mx-auto">
      <div
        ref={elementRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {tiers.map(({ tier, label, color, baseProficiency }) => {
          const groups = getSkillsByTier(tier);

          return (
            <Card key={tier} hover>
              <div className="mb-6">
                <h3
                  className="text-lg font-display font-bold mb-2 uppercase tracking-wider"
                  style={{ color }}
                >
                  {label}
                </h3>
                <p className="text-xs font-body" style={{ color: "#9CA3AF" }}>
                  {tier === "high"
                    ? "Strongest Skills"
                    : tier === "intermediate"
                    ? "Proficient"
                    : "Learning & Exploring"}
                </p>
              </div>

              <div className="space-y-4">
                {groups.map((group, groupIndex) => (
                  <div key={groupIndex} className="mb-4">
                    <h4
                      className="text-xs font-display font-semibold uppercase tracking-wider mb-3"
                      style={{ color: "#FFFFFF" }}
                    >
                      {group.title}
                    </h4>
                    <div className="space-y-2.5">
                      {group.items.map((skill, skillIndex) => {
                        const proficiency =
                          baseProficiency + Math.random() * 10 - 5;
                        return (
                          <SkillProgressBar
                            key={skillIndex}
                            skill={skill}
                            proficiency={proficiency}
                            color={color}
                            isVisible={isVisible}
                            delay={(groupIndex * 10 + skillIndex) * 30}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}

interface SkillProgressBarProps {
  skill: string;
  proficiency: number;
  color: string;
  isVisible: boolean;
  delay: number;
}

function SkillProgressBar({
  skill,
  proficiency,
  color,
  isVisible,
  delay,
}: SkillProgressBarProps) {
  const [animatedProficiency, setAnimatedProficiency] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimatedProficiency(proficiency);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, proficiency, delay]);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span
          className="text-xs font-display font-semibold uppercase tracking-wider"
          style={{ color: "#FFFFFF" }}
        >
          {skill}
        </span>
        <span className="text-xs font-body font-medium" style={{ color }}>
          {Math.round(animatedProficiency)}%
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${animatedProficiency}%`,
            backgroundColor: color,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}
