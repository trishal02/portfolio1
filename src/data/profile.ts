export interface Experience {
  company: string;
  role: string;
  period: string;
  points: string[];
}

export interface Project {
  title: string;
  period: string;
  description: string;
  tech: string;
  points: string[];
  github?: string;
  demo?: string;
  paper?: string;
  impact?: string;
}

export interface Education {
  institution: string;
  degree: string;
  gpa: string;
  courses?: string[];
}

export interface Extracurricular {
  title: string;
  role?: string;
  points: string[];
}

export const profileData = {
  name: {
    first: "TRISHAL",
    last: "REDDY",
  },
  tagline: "Software Developer | C++ & Python | Distributed Systems",
  about: `Software Developer with expertise in C++ and Python, specializing in backend development and distributed computing. Experienced in designing scalable, data-driven applications. Certified in AWS Cloud, with a passion for leveraging technical skills to enhance backend engineering projects.`,
  quote: "Code. Create. Innovate.",
  contact: {
    email: "tindireddy@binghamton.edu",
    phone: "+1-607-232-1218",
    location: "Binghamton, NY",
    linkedin: "https://www.linkedin.com/in/thrishalreddy-i-4089a8207/",
    github: "https://github.com/trishal02",
    resume: "/resume.pdf",
  },
  experience: [
    {
      company: "BINGHAMTON UNIVERSITY",
      role: "Research Intern",
      period: "Jan 2025 - Oct 2025",
      points: [
        "Developed a scalable PySpark pipeline to preprocess large-scale social media datasets and applied transformer-based models (DistilBERT, RoBERTa, ViT) to classify AI-generated versus authentic content.",
        "Implemented clustering and visualization workflows with LDA and Plotly to identify misinformation patterns and trends.",
      ],
    },
    {
      company: "Bright Curve IT Solutions",
      role: "Software Developer",
      period: "Aug 2021 - Jun 2023",
      points: [
        "Designed and constructed an orchestrated pipeline to process Outlook emails, extracting log paths and parsing log content with Python, while fine-tuning an LLaMA model for test case generation.",
        "Deployed a Jenkins-based automation system using TF-IDF matching to detect duplicate issues, reducing manual effort by 60%.",
        "Refactored legacy codebase into microservices using Spring Boot, Docker, and Kubernetes, improving deployment frequency by 18%.",
        "Implemented RESTful APIs to exclude high-propensity users, driving a 17% revenue boost.",
        "Developed real-time Grafana dashboards integrated with Slack and Splunk, cutting incident resolution time by 45%.",
      ],
    },
    {
      company: "Bright Curve IT Solutions",
      role: "Software Developer Intern",
      period: "Jan 2021 - Apr 2021",
      points: [
        "Built a RESTful microservice to optimize offer distribution, reducing response time by 40% for over 15,000 daily users.",
        "Improved reliability by achieving 80% unit test coverage through TDD, reducing production bugs by 25%.",
        "Resolved over 300+ real-time bugs during deployment, significantly enhancing system stability.",
      ],
    },
  ] as Experience[],
  projects: [
    {
      title: "Social Media Election Analysis Platform",
      period: "Sep 2024 - Dec 2024",
      description:
        "Developed a data pipeline to collect election discussions from Reddit and 4chan.",
      tech: "Python, PostgreSQL, OAuth, Data Pipeline",
      impact: "Designed scalable PostgreSQL architecture achieving 90%+ uptime with 127K+ Reddit posts daily.",
      points: [
        "Tackled API limitations and dynamic data filtering for continuous data flow.",
      ],
    },
    {
      title: "SQL Injection & XSS Cross-Site Scripting",
      period: "Sep 2023 - Dec 2023",
      description:
        "Conducted an in-depth analysis of SQL Injection and Cross-Site Scripting (XSS) vulnerabilities.",
      tech: "Linux, Virtual Machines, Machine Learning, Naive Bayes, Python",
      impact: "Implemented machine learning based detection for SQL Injection, achieving 91.6% accuracy using Naive Bayes classification.",
      points: [
        "Designed a virtualized attack environment using Linux-based Virtual Machines to demonstrate real-world exploitation.",
        "Developed and tested SQL Injection methods to bypass authentication and compromise web applications.",
        "Investigated XSS attacks, identifying security flaws that allow malicious script injection.",
        "Proposed and evaluated defensive strategies including input validation, output encoding, and Content Security Policies (CSP) to mitigate web security threats.",
      ],
    },
    {
      title: "Crime Analysis and Prediction System",
      period: "Oct 2022 - Mar 2023",
      description:
        "Predictive analytics system using PySpark to forecast crime patterns.",
      tech: "PySpark, LSTM, Prophet, Pandas",
      impact: "Forecasted crime patterns and identified high-risk areas using distributed Spark clusters.",
      points: [
        "Engineered a scalable data processing pipeline to generate crime hotspot visualizations for law enforcement.",
      ],
    },
    {
      title: "Expensometer",
      period: "Feb 2022 - Apr 2022",
      description:
        "Designed a web application to manage all transactions performed by a user to analyze spending patterns and manage expenditures.",
      tech: "HTML, CSS, JavaScript, Material-UI, React.js, Firebase",
      impact: "Implemented a special feature allowing users to log transactions using audio inputs.",
      points: [
        "Methodology: Powered by Speechly to capture and process input.",
      ],
    },
  ] as Project[],
  education: [
    {
      institution: "Binghamton University, SUNY",
      degree: "Master's, Computer Science",
      gpa: "GPA: 3.53/4",
      courses: [
        "Design Analysis and Algorithms",
        "Database Systems",
        "Science of Cybersecurity",
        "Operating Systems",
        "Computer Architecture and Organisation",
        "Design Patterns",
        "Programming Languages",
        "Intro to Computer Security",
        "Topics in Data Privacy",
        "Social Media Data Science Pipeline",
      ],
    },
    {
      institution: "Indian Institute of Information & Technology, Kottayam",
      degree: "Bachelor of Technology, CSE",
      gpa: "GPA: 3.6/4",
      courses: [
        "Discrete Mathematics",
        "IT Workshop I/II/III",
        "Computer Programming",
        "Digital Design and Electric Circuits",
        "Communication Skills",
        "French",
        "Calculus and Linear Algebra",
        "Electronic Circuits and Measurements",
        "Data Structures",
        "Computer Organization",
        "Personality Development",
        "German",
        "Differential Equations and Transforms",
        "Design and Analysis of Algorithms",
        "Operating Systems",
        "Database Management Systems",
        "Introduction to Bioinformatics",
        "Theory of Computation",
        "Object Oriented Analysis and Design",
        "Compiler Design",
        "Computer Networks",
        "Probability/Statistics/Random Process",
        "Fundamentals of Economics",
        "Principles of Management",
        "Business Communication Skills",
        "Artificial Intelligence",
        "Software Engineering and Project Management",
        "Digital Signal Processing",
        "Parallel and Distributed Computing",
        "Soft Computing",
        "Human Resource Management",
        "Financial Management and Accounting",
        "Operations and Supply Chain Management",
        "Microprocessors",
        "Cloud Computing",
        "Data Warehousing and Data Mining",
        "Machine Learning",
        "High Performance and Scientific Computing",
        "Software Design Patterns",
        "Computer Graphics",
        "Big Data Analytics",
        "Cryptography and Network Security",
        "Blockchain Technology",
        "B.Tech Project Phase I",
      ],
    },
  ] as Education[],
  skills: [
    "Python",
    "C++",
    "Java",
    "JavaScript",
    "AWS",
    "Docker",
    "Kubernetes",
    "React",
    "PostgreSQL",
    "MongoDB",
    "PySpark",
    "Git",
    "Linux",
    "RESTful APIs",
  ],
  extracurriculars: [
    {
      title: "Indian Institute of Information & Technology",
      role: "Captain",
      points: [
        "Captain of our college Cricket & Badminton team, representing at National-level Inter IIIT Sports Meet.",
      ],
    },
    {
      title: "National Level Wrestler",
      points: [
        "During my high school time, I represented my state in a national-level wrestling competition.",
      ],
    },
    {
      title: "Sodexo",
      role: "Student Manager",
      points: [
        "During my master's, I worked as a student manager in the place I worked, where I managed more than 20 students.",
      ],
    },
  ] as Extracurricular[],
};
