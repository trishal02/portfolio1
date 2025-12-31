export interface WhatsUpItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href?: string;
  size: "lg" | "md" | "sm";
}

export const whatsUpItems: WhatsUpItem[] = [
  {
    id: "wrestling",
    title: "ON THE MAT",
    subtitle: "National Level Wrestling",
    image: "/extras/gym.jpeg",
    size: "lg",
  },
  {
    id: "leadership",
    title: "TEAM LEADERSHIP",
    subtitle: "Cricket & Badminton Captain",
    image: "/extras/cricket.jpeg",
    size: "md",
  },
  {
    id: "thrill-ai",
    title: "THRILL AI",
    subtitle: "Voice Intelligence Infrastructure",
    image: "/extras/coding.png",
    href: "https://thrill.vision",
    size: "md",
  },
  {
    id: "f1",
    title: "WATCHING F1",
    subtitle: "Race weekends & highlights",
    image: "/extras/watching-f1.png",
    size: "sm",
  },
  {
    id: "cloud-infra",
    title: "CLOUD / INFRA",
    subtitle: "Systems, scaling, reliability",
    image: "/extras/cloud-infra.png",
    size: "sm",
  },
  {
    id: "tech-talks",
    title: "TECH TALKS",
    subtitle: "Learning & sharing",
    image: "/extras/tech-talks.png",
    size: "sm",
  },
];

