import Section from "../layout/Section";
import PortraitFluidReveal from "../about/PortraitFluidReveal";

interface AboutProps {
  content: string;
}

export default function About({ content }: AboutProps) {
  // Keywords to highlight (technical terms, skills, etc.)
  const keywords = [
    "software developer",
    "systems",
    "reliable under load",
    "backend engineering",
    "distributed-systems fundamentals",
    "cloud deployments",
    "clean, maintainable products",
    "national-level wrestling athlete",
    "disciplined execution",
    "consistent iteration",
    "calm under pressure",
    "AI + infrastructure",
    "ship impactful software",
    "improve reliability at scale",
  ];

  // Function to highlight keywords in text
  const highlightKeywords = (text: string) => {
    let highlightedText = text;

    // Sort keywords by length (longest first) to avoid partial matches
    const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);

    sortedKeywords.forEach((keyword) => {
      const regex = new RegExp(
        `(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi"
      );
      highlightedText = highlightedText.replace(
        regex,
        (match) =>
          `<span class="font-semibold" style="color: #DC2626;">${match}</span>`
      );
    });

    return highlightedText;
  };

  // Split content by double newline to create paragraphs
  const paragraphs = content.split("\n\n").filter((p) => p.trim());

  return (
    <Section id="about" title="About Me" className="max-w-6xl mx-auto">
      <div
        className="carbon-fiber border rounded-lg p-6 md:p-8 hover:glow-red transition-all duration-300 backdrop-blur-md"
        style={{
          borderColor: "rgba(220, 38, 38, 0.2)",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
        }}
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Photo with fluid hover reveal */}
          <div className="flex-shrink-0 w-full md:w-80 lg:w-96 relative z-0">
            <PortraitFluidReveal />
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-4 min-w-0 relative z-10">
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="text-xl md:text-3xl font-body font-light leading-relaxed"
                style={{ color: "#FFFFFF" }}
                dangerouslySetInnerHTML={{
                  __html: highlightKeywords(paragraph.trim()),
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
