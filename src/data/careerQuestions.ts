export interface CareerQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    weights: {
      stem: number;
      arts: number;
      social: number;
      tvet: number;
    }
  }[];
}

export const CAREER_QUESTIONS: CareerQuestion[] = [
  {
    id: 1,
    text: "How do you like to spend your free time?",
    options: [
      { text: "Fixing broken things or building models", weights: { stem: 1, arts: 0, social: 0, tvet: 2 } },
      { text: "Drawing, painting, or making music", weights: { stem: 0, arts: 2, social: 0, tvet: 0 } },
      { text: "Solving puzzles or coding", weights: { stem: 2, arts: 0, social: 0, tvet: 1 } },
      { text: "Helping friends or community work", weights: { stem: 0, arts: 0, social: 2, tvet: 0 } }
    ]
  },
  {
    id: 2,
    text: "Which school subject do you enjoy most?",
    options: [
      { text: "Mathematics or Science", weights: { stem: 2, arts: 0, social: 0, tvet: 1 } },
      { text: "English, Literature, or Music", weights: { stem: 0, arts: 2, social: 1, tvet: 0 } },
      { text: "Social Studies or Religion", weights: { stem: 0, arts: 0, social: 2, tvet: 0 } },
      { text: "Agriculture, Home Science, or Woodwork", weights: { stem: 0, arts: 0, social: 0, tvet: 2 } }
    ]
  },
  {
    id: 3,
    text: "If you were to start a small business, it would be:",
    options: [
      { text: "Repairing electronics or mobile phones", weights: { stem: 1, arts: 0, social: 0, tvet: 2 } },
      { text: "Graphic design or fashion brand", weights: { stem: 0, arts: 2, social: 0, tvet: 0 } },
      { text: "A community center or counseling service", weights: { stem: 0, arts: 0, social: 2, tvet: 0 } },
      { text: "Developing an app or software", weights: { stem: 2, arts: 0, social: 0, tvet: 1 } }
    ]
  },
  {
    id: 4,
    text: "When you see a problem in your neighborhood, you want to:",
    options: [
      { text: "Understand the science behind it", weights: { stem: 2, arts: 0, social: 1, tvet: 0 } },
      { text: "Organize people to talk about it", weights: { stem: 0, arts: 0, social: 2, tvet: 0 } },
      { text: "Create an artistic awareness campaign", weights: { stem: 0, arts: 2, social: 0, tvet: 0 } },
      { text: "Physically build or fix the infrastructure", weights: { stem: 1, arts: 0, social: 0, tvet: 2 } }
    ]
  },
  {
    id: 5,
    text: "Which of these activities sounds most exciting?",
    options: [
      { text: "Experimenting in a laboratory", weights: { stem: 2, arts: 0, social: 0, tvet: 0 } },
      { text: "Performing on a stage", weights: { stem: 0, arts: 2, social: 1, tvet: 0 } },
      { text: "Leading a club or debating team", weights: { stem: 0, arts: 0, social: 2, tvet: 0 } },
      { text: "Working with high-tech machinery", weights: { stem: 1, arts: 0, social: 0, tvet: 2 } }
    ]
  },
  {
    id: 6,
    text: "How do you prefer to learn new things?",
    options: [
      { text: "By doing it with my hands", weights: { stem: 0, arts: 0, social: 0, tvet: 2 } },
      { text: "By following a logical process", weights: { stem: 2, arts: 0, social: 0, tvet: 1 } },
      { text: "Through creative expression", weights: { stem: 0, arts: 2, social: 0, tvet: 0 } },
      { text: "By discussing it with others", weights: { stem: 0, arts: 0, social: 2, tvet: 0 } }
    ]
  },
  {
    id: 7,
    text: "What kind of projects do you like most?",
    options: [
      { text: "Coding or data analysis", weights: { stem: 2, arts: 0, social: 0, tvet: 0 } },
      { text: "Crafting or designing something beautiful", weights: { stem: 0, arts: 2, social: 0, tvet: 1 } },
      { text: "Helping someone overcome a challenge", weights: { stem: 0, arts: 0, social: 2, tvet: 0 } },
      { text: "Building something sturdy and useful", weights: { stem: 1, arts: 0, social: 0, tvet: 2 } }
    ]
  },
  {
    id: 8,
    text: "When you grow up, you want to be known for:",
    options: [
      { text: "Your inventions or discoveries", weights: { stem: 2, arts: 0, social: 0, tvet: 0 } },
      { text: "Your art, music, or performance", weights: { stem: 0, arts: 2, social: 0, tvet: 0 } },
      { text: "Your leadership and impact on people", weights: { stem: 0, arts: 0, social: 2, tvet: 0 } },
      { text: "Your skill and craftsmanship", weights: { stem: 0, arts: 0, social: 0, tvet: 2 } }
    ]
  },
  {
    id: 9,
    text: "Which of these environments do you prefer?",
    options: [
      { text: "A quiet office or a lab", weights: { stem: 2, arts: 0, social: 0, tvet: 0 } },
      { text: "A creative studio or a theater", weights: { stem: 0, arts: 2, social: 0, tvet: 0 } },
      { text: "A busy classroom or an office", weights: { stem: 0, arts: 0, social: 2, tvet: 0 } },
      { text: "A workshop or an outdoor site", weights: { stem: 1, arts: 0, social: 0, tvet: 2 } }
    ]
  },
  {
    id: 10,
    text: "What is your favorite way to solve a puzzle?",
    options: [
      { text: "Step-by-step logic", weights: { stem: 2, arts: 0, social: 0, tvet: 0 } },
      { text: "Creative 'out-of-the-box' thinking", weights: { stem: 0, arts: 2, social: 1, tvet: 0 } },
      { text: "Asking others for their perspective", weights: { stem: 0, arts: 0, social: 2, tvet: 0 } },
      { text: "Testing things physically until it works", weights: { stem: 1, arts: 0, social: 0, tvet: 2 } }
    ]
  }
];
