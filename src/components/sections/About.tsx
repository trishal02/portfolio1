import { Fragment } from "react";
import Section from "../layout/Section";

interface AboutProps {
  content: string;
}

export default function About({ content }: AboutProps) {
  return (
    <Section id="about" title="About Me" className="max-w-4xl mx-auto">
      <div 
        className="carbon-fiber border rounded-lg p-8 hover:glow-red transition-all duration-300"
        style={{ borderColor: "rgba(220, 38, 38, 0.2)", backgroundColor: "rgba(10, 10, 10, 0.6)" }}
      >
        <p className="text-xl md:text-3xl font-body font-light leading-relaxed" style={{ color: "#FFFFFF" }}>
          {content.split("C++ and Python").map((part, i) => (
            <Fragment key={i}>
              {part}
              {i === 0 && (
                <span className="font-semibold" style={{ color: "#DC2626" }}>
                  C++ and Python
                </span>
              )}
            </Fragment>
          ))}
        </p>
      </div>
    </Section>
  );
}
