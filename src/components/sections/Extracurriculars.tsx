import Section from "../layout/Section";
import Card from "../ui/Card";
import type { Extracurricular } from "../../data/profile";

interface ExtracurricularsProps {
  extracurriculars: Extracurricular[];
}

export default function Extracurriculars({
  extracurriculars,
}: ExtracurricularsProps) {
  return (
    <Section
      id="extracurriculars"
      title="Extracurriculars"
      className="max-w-6xl mx-auto"
    >
      <div className="space-y-8">
        {extracurriculars.map((activity, index) => (
          <Card key={index} hover>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <h3 className="text-xl font-display font-bold text-white mb-1">
                  {activity.title}
                </h3>
                {activity.role && (
                  <p className="text-racing-red font-body font-semibold">
                    {activity.role}
                  </p>
                )}
              </div>
              <div className="md:col-span-3">
                <ul className="space-y-3">
                  {activity.points.map((point, i) => (
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
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
