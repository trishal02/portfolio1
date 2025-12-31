import { profileData } from "./profile";

export type SkillTier = "high" | "intermediate" | "beginner";

export interface SkillGroup {
  title: string;
  items: string[];
  tier: SkillTier;
}

// Base skill groups (defined first to avoid reference issues)
const baseSkillGroups: SkillGroup[] = [
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

// Extract and normalize tech skills from projects and startups
function extractTechFromProjects(): Set<string> {
  const allTech = new Set<string>();
  
  // Extract from startups
  profileData.startups.forEach((startup) => {
    startup.tech.split(",").forEach((tech) => {
      const normalized = tech.trim();
      if (normalized && !normalized.includes("(planned)")) {
        allTech.add(normalized);
      }
    });
  });
  
  // Extract from projects
  profileData.projects.forEach((project) => {
    project.tech.split(",").forEach((tech) => {
      const normalized = tech.trim();
      if (normalized) {
        allTech.add(normalized);
      }
    });
  });
  
  return allTech;
}

// Normalize skill names (handle variations and standardize capitalization)
function normalizeSkillName(skill: string): string {
  // Map common variations to standardized names (only if mapping exists in base groups)
  const mappings: Record<string, string> = {
    "REST API": "REST APIs",
    "React.js": "React",
    "Material-UI": "Material UI",
    // Don't normalize Google Cloud to GCP since GCP doesn't exist in base
    // "Google Cloud": "GCP",
    "Virtual Machines": "VMs",
    "Machine Learning": "ML",
  };
  
  if (mappings[skill]) {
    return mappings[skill];
  }
  
  return skill;
}

// Get existing skills from base groups to avoid duplicates
function getExistingSkills(): Set<string> {
  const existing = new Set<string>();
  baseSkillGroups.forEach((group) => {
    group.items.forEach((item) => {
      existing.add(item);
      // Also add base name without parenthetical details for matching
      const baseName = item.split("(")[0].trim();
      if (baseName !== item) {
        existing.add(baseName);
      }
    });
  });
  return existing;
}

  // Categorize a skill into a category and tier
function categorizeSkill(skill: string): { category: string; tier: SkillTier } {
  const normalized = skill.toLowerCase();
  
  // Language mappings
  if (["rust", "python", "typescript", "javascript", "java", "c++", "sql"].includes(normalized)) {
    return { category: "Languages", tier: normalized === "rust" ? "intermediate" : "high" };
  }
  
  // Frontend
  if (["react", "html", "css", "html5", "css3", "material ui", "tailwind css"].includes(normalized)) {
    return { category: "Frontend", tier: "high" };
  }
  
  // Backend
  if (["rest apis", "kafka", "express.js", "node.js", "event-driven", "idempotency"].includes(normalized)) {
    if (normalized === "kafka" || normalized === "event-driven" || normalized === "idempotency") {
      return { category: "Backend", tier: "beginner" };
    }
    return { category: "Backend", tier: "intermediate" };
  }
  
  // Databases
  if (["postgresql", "mongodb", "firebase"].includes(normalized)) {
    return { category: "Databases", tier: normalized === "postgresql" ? "high" : "intermediate" };
  }
  
  // Cloud/DevOps
  if (["aws", "docker", "kubernetes", "git", "github", "linux", "vercel", "gcp", "google cloud"].includes(normalized)) {
    if (["aws", "docker", "git", "github", "linux"].includes(normalized)) {
      return { category: "DevOps/Cloud", tier: "high" };
    }
    return { category: "Cloud", tier: "intermediate" };
  }
  
  // Security
  if (["security", "aes-256-gcm", "zero-trust", "oauth", "crypto-shredding", "encryption"].includes(normalized)) {
    return { category: "Security", tier: "intermediate" };
  }
  
  // AI/ML
  if (["openai", "anthropic", "federated learning", "differential privacy", "machine learning", "ml", "lstm", "prophet", "pandas", "pyspark", "naive bayes"].includes(normalized)) {
    if (normalized === "pyspark" || normalized === "pandas" || normalized === "lstm" || normalized === "prophet" || normalized === "naive bayes") {
      return { category: "Data/ML", tier: "intermediate" };
    }
    return { category: "AI/ML", tier: "intermediate" };
  }
  
  // Testing
  if (["testing", "jest", "react testing library"].includes(normalized)) {
    return { category: "Testing", tier: "intermediate" };
  }
  
  // Payment/APIs
  if (["stripe"].includes(normalized)) {
    return { category: "Tools", tier: "intermediate" };
  }
  
  // Data Pipeline
  if (["data pipeline"].includes(normalized)) {
    return { category: "Data/ML", tier: "intermediate" };
  }
  
  // Default: put in appropriate category with intermediate tier
  return { category: "Tools", tier: "intermediate" };
}

// Merge project/startup tech into skill groups
function mergeProjectTechIntoSkills(): SkillGroup[] {
  const projectTech = extractTechFromProjects();
  const existingSkills = getExistingSkills();
  const newSkillsByCategory: Record<string, Record<string, SkillTier>> = {};
  
  // Process each tech from projects/startups
  projectTech.forEach((tech) => {
    const normalized = normalizeSkillName(tech);
    
    // Skip if already exists
    if (existingSkills.has(normalized)) {
      return;
    }
    
    // Categorize
    const { category, tier } = categorizeSkill(normalized);
    
    if (!newSkillsByCategory[category]) {
      newSkillsByCategory[category] = {};
    }
    newSkillsByCategory[category][normalized] = tier;
  });
  
  // Add new skills to existing groups or create new groups
  const updatedGroups = [...baseSkillGroups];
  
  Object.entries(newSkillsByCategory).forEach(([category, skills]) => {
    const tierEntries = Object.entries(skills);
    const tierMap = new Map<SkillTier, string[]>();
    
    tierEntries.forEach(([skill, tier]) => {
      if (!tierMap.has(tier)) {
        tierMap.set(tier, []);
      }
      tierMap.get(tier)!.push(skill);
    });
    
    // Add to existing group or create new
    tierMap.forEach((skillList, tier) => {
      const existingGroupIndex = updatedGroups.findIndex(
        (g) => g.title === category && g.tier === tier
      );
      
      if (existingGroupIndex >= 0) {
        // Merge into existing group (avoid duplicates)
        const existing = new Set(updatedGroups[existingGroupIndex].items);
        skillList.forEach((skill) => existing.add(skill));
        updatedGroups[existingGroupIndex].items = Array.from(existing).sort();
      } else {
        // Create new group
        updatedGroups.push({
          title: category,
          items: skillList.sort(),
          tier,
        });
      }
    });
  });
  
  return updatedGroups;
}

// Merge project/startup tech into skills (this is the exported groups used by the component)
export const skillGroups = mergeProjectTechIntoSkills();
