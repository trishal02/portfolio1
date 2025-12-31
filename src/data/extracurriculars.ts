export interface ExtraItem {
  name: string;
  image: string;
  href?: string;
  caption?: string;
}

export const extracurricularItems: ExtraItem[] = [
  {
    name: "Cricket",
    image: "/extras/cricket.jpeg",
    caption: "College Cricket Team",
  },
  {
    name: "Badminton",
    image: "/extras/badminton.jpeg",
    caption: "National Inter IIIT Sports Meet",
  },
  {
    name: "Fitness",
    image: "/extras/gym.jpeg",
  },
  {
    name: "Camping",
    image: "/extras/camping.jpeg",
  },
  {
    name: "Problem Solving",
    image: "/extras/problem-solving.png",
  },
  {
    name: "Coding",
    image: "/extras/coding.png",
  },
  {
    name: "Cloud & Infrastructure",
    image: "/extras/cloud-infra.png",
  },
  {
    name: "Tech Talks",
    image: "/extras/tech-talks.png",
  },
  {
    name: "F1 Racing",
    image: "/extras/watching-f1.png",
    caption: "Formula 1 Enthusiast",
  },
];

