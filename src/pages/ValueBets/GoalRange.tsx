import ValueBetsLayout from "./ValueBetsLayout";
import type { Prediction } from "./ValueBetsLayout";

const predictions: Prediction[] = [
  { id: 1, matchNum: 1, league: "EPL", date: "Sat 22 Mar", fixture: "Arsenal vs Chelsea", pick: "Over 2.5", odds: "1.85", confidence: 84, analysis: "These sides have combined for 3+ goals in 8 of last 10 head-to-heads. Both GKs are below their season average in saves." },
  { id: 2, matchNum: 2, league: "UCL", date: "Sat 22 Mar", fixture: "PSG vs Bayern", pick: "Over 3.5", odds: "2.40", confidence: 76, analysis: "PSG vs Bayern has averaged 4.2 goals over last 5 UCL meetings. Both teams press high and leave spaces in behind." },
  { id: 3, matchNum: 3, league: "La Liga", date: "Sat 22 Mar", fixture: "Atletico vs Villarreal", pick: "Under 2.5", odds: "1.95", confidence: 80, analysis: "Atletico are defensively the best team in La Liga. 7 of their last 10 home games ended with under 2.5 goals." },
  { id: 4, matchNum: 4, league: "Bundesliga", date: "Sun 23 Mar", fixture: "Leipzig vs Frankfurt", pick: "Over 2.5", odds: "1.75", confidence: 86, analysis: "Leipzig's high press leads to open games — 9 of their last 11 home Bundesliga games had 3+ goals." },
  { id: 5, matchNum: 5, league: "KPL", date: "Sun 23 Mar", fixture: "Tusker vs KCB", pick: "Under 2.5", odds: "1.90", confidence: 77, analysis: "KPL games are typically low scoring — 6 of Tusker's last 8 home games ended with 2 or fewer goals." },
];

const GoalRange = () => (
  <ValueBetsLayout
    eyebrow="Goal Range Predictions"
    title="Goal Range Tips"
    description="Over/Under goal predictions with in-depth statistical analysis. Subscription required."
    predictions={predictions}
  />
);

export default GoalRange;
