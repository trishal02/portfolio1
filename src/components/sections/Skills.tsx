import { useEffect, useState } from "react";
import Section from "../layout/Section";
import Card from "../ui/Card";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

interface SkillsProps {
  skills: string[];
}

interface SkillProgress {
  skill: string;
  proficiency: number; // 0-100
}

export default function Skills({ skills }: SkillsProps) {
  // Group skills into "tyre compounds" - Soft (most proficient), Medium, Hard
  const softSkills = skills.slice(0, Math.ceil(skills.length / 3));
  const mediumSkills = skills.slice(
    Math.ceil(skills.length / 3),
    Math.ceil((skills.length * 2) / 3)
  );
  const hardSkills = skills.slice(Math.ceil((skills.length * 2) / 3));

  // Assign proficiency levels
  const getSkillProgress = (skillList: string[], baseProficiency: number): SkillProgress[] => {
    return skillList.map((skill) => ({
      skill,
      proficiency: baseProficiency + Math.random() * 10 - 5, // Add slight variation
    }));
  };

  const softProgress = getSkillProgress(softSkills, 90);
  const mediumProgress = getSkillProgress(mediumSkills, 70);
  const hardProgress = getSkillProgress(hardSkills, 50);

  const { elementRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <Section id="skills" title="Technical Skills" className="max-w-6xl mx-auto">
      <div ref={elementRef} className="grid md:grid-cols-3 gap-6">
        {/* Soft Compound - Most Proficient */}
        <Card>
          <div className="mb-4">
            <h3 
              className="text-lg font-display font-bold mb-2 uppercase tracking-wider"
              style={{ color: "#10B981" }}
            >
              Soft Compound
            </h3>
            <p 
              className="text-xs font-body"
              style={{ color: "#9CA3AF" }}
            >
              Maximum Performance
            </p>
          </div>
          <div className="space-y-3">
            {softProgress.map(({ skill, proficiency }, index) => (
              <SkillProgressBar
                key={skill}
                skill={skill}
                proficiency={proficiency}
                color="#10B981"
                isVisible={isVisible}
                delay={index * 50}
              />
            ))}
          </div>
        </Card>

        {/* Medium Compound */}
        <Card>
          <div className="mb-4">
            <h3 
              className="text-lg font-display font-bold mb-2 uppercase tracking-wider"
              style={{ color: "#FBBF24" }}
            >
              Medium Compound
            </h3>
            <p 
              className="text-xs font-body"
              style={{ color: "#9CA3AF" }}
            >
              Balanced Performance
            </p>
          </div>
          <div className="space-y-3">
            {mediumProgress.map(({ skill, proficiency }, index) => (
              <SkillProgressBar
                key={skill}
                skill={skill}
                proficiency={proficiency}
                color="#FBBF24"
                isVisible={isVisible}
                delay={index * 50}
              />
            ))}
          </div>
        </Card>

        {/* Hard Compound */}
        <Card>
          <div className="mb-4">
            <h3 
              className="text-lg font-display font-bold mb-2 uppercase tracking-wider"
              style={{ color: "#DC2626" }}
            >
              Hard Compound
            </h3>
            <p 
              className="text-xs font-body"
              style={{ color: "#9CA3AF" }}
            >
              Durable & Reliable
            </p>
          </div>
          <div className="space-y-3">
            {hardProgress.map(({ skill, proficiency }, index) => (
              <SkillProgressBar
                key={skill}
                skill={skill}
                proficiency={proficiency}
                color="#DC2626"
                isVisible={isVisible}
                delay={index * 50}
              />
            ))}
          </div>
        </Card>
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
        <span 
          className="text-xs font-body font-medium"
          style={{ color }}
        >
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
