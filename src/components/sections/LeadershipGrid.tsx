import Section from "../layout/Section";
import { profileData } from "../../data/profile";

export default function LeadershipGrid() {
  const leadershipItems = profileData.extracurriculars;

  return (
    <Section id="leadership" title="Leadership" className="max-w-4xl mx-auto">
      <div className="space-y-6 md:space-y-8">
        {leadershipItems.map((item, index) => (
          <div
            key={index}
            className="relative rounded-xl border p-6 md:p-8 transition-all duration-300 hover:border-racing-red/50"
            style={{
              borderColor: "rgba(255, 255, 255, 0.1)",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {/* Title and Role */}
            <div className="mb-4">
              <h3
                className="text-xl md:text-2xl font-display font-bold mb-1"
                style={{ color: "#FFFFFF" }}
              >
                {item.title}
              </h3>
              {item.role && (
                <p
                  className="text-sm md:text-base font-body"
                  style={{ color: "#DC2626" }}
                >
                  {item.role}
                </p>
              )}
            </div>

            {/* Points */}
            <ul className="space-y-2">
              {item.points.map((point, pointIndex) => (
                <li
                  key={pointIndex}
                  className="flex items-start gap-3 text-sm md:text-base font-body"
                  style={{ color: "#D1D5DB" }}
                >
                  <span
                    className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: "#DC2626" }}
                  />
                  <span className="flex-1">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
