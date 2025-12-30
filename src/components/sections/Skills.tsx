import Section from "../layout/Section";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

interface SkillsProps {
  skills: string[];
}

export default function Skills({ skills }: SkillsProps) {
  // Group skills into "tyre compounds" - Soft (most proficient), Medium, Hard
  const softSkills = skills.slice(0, Math.ceil(skills.length / 3));
  const mediumSkills = skills.slice(
    Math.ceil(skills.length / 3),
    Math.ceil((skills.length * 2) / 3)
  );
  const hardSkills = skills.slice(Math.ceil((skills.length * 2) / 3));

  return (
    <Section id="skills" title="Technical Skills" className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Soft Compound - Most Proficient */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-display font-bold text-green mb-2 uppercase tracking-wider">
              Soft Compound
            </h3>
            <p className="text-xs text-metallic-gray-light font-body">
              Maximum Performance
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {softSkills.map((skill) => (
              <Badge key={skill} variant="soft">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Medium Compound */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-display font-bold text-yellow mb-2 uppercase tracking-wider">
              Medium Compound
            </h3>
            <p className="text-xs text-metallic-gray-light font-body">
              Balanced Performance
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {mediumSkills.map((skill) => (
              <Badge key={skill} variant="medium">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Hard Compound */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-display font-bold text-racing-red mb-2 uppercase tracking-wider">
              Hard Compound
            </h3>
            <p className="text-xs text-metallic-gray-light font-body">
              Durable & Reliable
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {hardSkills.map((skill) => (
              <Badge key={skill} variant="hard">
                {skill}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}
