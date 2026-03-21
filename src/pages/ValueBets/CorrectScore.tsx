import ValueBetsLayout from "./ValueBetsLayout";
import type { Prediction } from "./ValueBetsLayout";

const predictions: Prediction[] = [
  { id: 1, matchNum: 1, league: "EPL", date: "Sat 22 Mar", fixture: "Arsenal vs Chelsea", pick: "2-1", odds: "8.50", confidence: 68, analysis: "Arsenal tend to concede early before pushing. 2-1 has been the most common scoreline in their last 10 home wins." },
  { id: 2, matchNum: 2, league: "La Liga", date: "Sat 22 Mar", fixture: "Barcelona vs Sevilla", pick: "3-0", odds: "7.20", confidence: 72, analysis: "Barcelona have won 3-0 three times at home this season. Sevilla have kept 0 clean sheets away in 2025." },
  { id: 3, matchNum: 3, league: "Bundesliga", date: "Sat 22 Mar", fixture: "Bayern vs Dortmund", pick: "3-1", odds: "9.00", confidence: 65, analysis: "The Klassiker has averaged 4+ goals in last 5 meetings. Bayern's attacking depth makes 3-1 the most likely multi-goal scoreline." },
  { id: 4, matchNum: 4, league: "Serie A", date: "Sun 23 Mar", fixture: "Inter vs Roma", pick: "2-0", odds: "6.50", confidence: 70, analysis: "Inter have kept 4 clean sheets in last 6 home games. Roma have scored in just 2 of last 6 away Serie A fixtures." },
];

const CorrectScore = () => (
  <ValueBetsLayout
    eyebrow="Correct Score Predictions"
    title="Correct Score Tips"
    description="High-value correct score predictions with detailed analysis. All require an active subscription."
    predictions={predictions}
  />
);

export default CorrectScore;
