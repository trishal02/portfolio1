import Section from "../layout/Section";
import Card from "../ui/Card";
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
          <Card key={index} hover>
            <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-xl font-display font-bold text-white">
                {edu.institution}
              </h3>
              <Badge variant="soft">{edu.gpa}</Badge>
            </div>
            <p className="text-racing-red font-body font-semibold text-lg">
              {edu.degree}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
