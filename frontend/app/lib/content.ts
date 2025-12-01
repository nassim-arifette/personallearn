export type FeatureCard = {
  title: string;
  description: string;
  icon: string;
};

export type CourseUnit = {
  title: string;
  description: string;
  objective: string;
};

export const features: FeatureCard[] = [
  {
    title: "Focus",
    description: "Pinpoint attention patterns and keep your sessions sharp.",
    icon: "🧠"
  },
  {
    title: "Adapt",
    description: "Content that flexes with your rhythm and energy.",
    icon: "⏱️"
  },
  {
    title: "Dynamic Content",
    description: "Micro-units surface at the right moment for retention.",
    icon: "⚙️"
  }
];

export const profileTraits: FeatureCard[] = [
  { title: "Intermediate Level", description: "Tailored rigor", icon: "🎯" },
  { title: "7 Units", description: "Balanced cadence", icon: "🧱" },
  { title: "Balanced Complexity", description: "Concept first", icon: "🧭" }
];

export const courseUnits: CourseUnit[] = [
  {
    title: "Unit 1: Fundamentals of Attention",
    description:
      "Attention is a cognitive process that redirects awareness to prioritize sensory input, memory, and reasoning.",
    objective: "Define key attention mechanisms."
  },
  {
    title: "Unit 2: Memory Systems",
    description:
      "Human memory blends short-term buffers with long-term stores that retain concepts, patterns, and schemas.",
    objective: "Differentiate between short-term and long-term memory."
  },
  {
    title: "Unit 3: Decision Making Models",
    description:
      "Normative and descriptive models explore how we choose under uncertainty, incentives, and cognitive limits.",
    objective: "Apply basic decision-making frameworks."
  },
  {
    title: "Unit 4: Cognitive Biases",
    description:
      "Biases shift perception and choices, but surfacing them early improves strategy, negotiation, and empathy.",
    objective: "Spot and neutralize common biases."
  }
];

export const quizOptions = ["18", "24", "30", "32"];
