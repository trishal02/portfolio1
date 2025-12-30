import Section from "../layout/Section";

interface AboutProps {
  content: string;
}

export default function About({ content }: AboutProps) {
  // Split content by double newline to create paragraphs
  const paragraphs = content.split("\n\n").filter((p) => p.trim());

  return (
    <Section id="about" title="About Me" className="max-w-4xl mx-auto">
      <div
        className="carbon-fiber border rounded-lg p-8 hover:glow-red transition-all duration-300 backdrop-blur-md"
        style={{
          borderColor: "rgba(220, 38, 38, 0.2)",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
        }}
      >
        <div className="space-y-4">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="text-xl md:text-3xl font-body font-light leading-relaxed"
              style={{ color: "#FFFFFF" }}
            >
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
