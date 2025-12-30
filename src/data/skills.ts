export type SkillTier = "high" | "intermediate" | "beginner";

export interface SkillGroup {
  title: string;
  items: string[];
  tier: SkillTier;
}

export const skillGroups: SkillGroup[] = [
  // High Performance Tier
  {
    title: "Languages",
    tier: "high",
    items: ["Python", "Java", "TypeScript", "JavaScript", "SQL", "C++"],
  },
  {
    title: "Frontend",
    tier: "high",
    items: ["React", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    title: "Backend",
    tier: "high",
    items: ["Node.js", "REST APIs"],
  },
  {
    title: "Databases",
    tier: "high",
    items: ["PostgreSQL"],
  },
  {
    title: "DevOps/Cloud",
    tier: "high",
    items: ["Docker", "Git", "GitHub", "Linux", "CI/CD"],
  },
  {
    title: "Concepts",
    tier: "high",
    items: ["Data Structures & Algorithms", "OOP", "System Design"],
  },

  // Intermediate Tier
  {
    title: "Frontend",
    tier: "intermediate",
    items: ["Vite", "Responsive UI", "Accessibility (a11y)"],
  },
  {
    title: "Backend",
    tier: "intermediate",
    items: ["Express.js", "Auth (JWT)", "API Integration"],
  },
  {
    title: "Databases",
    tier: "intermediate",
    items: ["MongoDB"],
  },
  {
    title: "Cloud",
    tier: "intermediate",
    items: ["AWS (EC2/S3/IAM)", "Vercel"],
  },
  {
    title: "Testing",
    tier: "intermediate",
    items: ["Jest", "React Testing Library"],
  },
  {
    title: "Tools",
    tier: "intermediate",
    items: ["Postman", "Swagger/OpenAPI"],
  },
  {
    title: "Data/ML",
    tier: "intermediate",
    items: ["PySpark"],
  },

  // Beginner Tier
  {
    title: "DevOps",
    tier: "beginner",
    items: ["Kubernetes", "Terraform"],
  },
  {
    title: "Backend",
    tier: "beginner",
    items: ["GraphQL", "Kafka"],
  },
  {
    title: "Monitoring",
    tier: "beginner",
    items: ["Prometheus", "Grafana"],
  },
  {
    title: "Security",
    tier: "beginner",
    items: ["OWASP Awareness"],
  },
];

