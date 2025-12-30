interface TimelineItemProps {
  title: string;
  subtitle?: string;
  period: string;
  points: string[];
  isLast?: boolean;
}

export default function TimelineItem({
  title,
  subtitle,
  period,
  points,
  isLast = false,
}: TimelineItemProps) {
  return (
    <div className="relative pl-8 pb-12">
      {/* Timeline Line */}
      {!isLast && (
        <div
          className="absolute left-3 top-8 bottom-0 w-0.5"
          style={{
            background:
              "linear-gradient(to bottom, #DC2626, rgba(220, 38, 38, 0.5), transparent)",
          }}
        />
      )}

      {/* Timeline Dot */}
      <div
        className="absolute left-0 top-2 w-6 h-6 rounded-full glow-red flex items-center justify-center"
        style={{ backgroundColor: "#DC2626" }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: "#FFFFFF" }}
        />
      </div>

      {/* Content */}
      <div
        className="carbon-fiber border rounded-lg p-6 hover:glow-red transition-all duration-300 backdrop-blur-md"
        style={{
          borderColor: "rgba(220, 38, 38, 0.2)",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-2">
          <div>
            <h3
              className="text-xl font-display font-bold mb-1"
              style={{ color: "#FFFFFF" }}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                className="font-body font-semibold text-lg"
                style={{ color: "#DC2626" }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <span
            className="font-display text-sm uppercase tracking-wider whitespace-nowrap"
            style={{ color: "#9CA3AF" }}
          >
            {period}
          </span>
        </div>

        <ul className="space-y-2">
          {points.map((point, i) => (
            <li
              key={i}
              className="flex items-start leading-relaxed"
              style={{ color: "#9CA3AF" }}
            >
              <span
                className="mr-3 mt-1.5 font-bold"
                style={{ color: "#DC2626" }}
              >
                ▸
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
