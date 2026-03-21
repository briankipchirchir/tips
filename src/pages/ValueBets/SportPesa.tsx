import ValueBetsLayout from "./ValueBetsLayout";
import type { Prediction } from "./ValueBetsLayout";

const predictions: Prediction[] = [
  { id: 1, matchNum: 1, league: "EPL", date: "Sat 22 Mar", fixture: "Arsenal vs Chelsea", pick: "1", odds: "2.10", confidence: 82, analysis: "Arsenal strong at home — unbeaten in last 9 at Emirates. Chelsea struggling defensively, conceding in 7 of last 8 away fixtures." },
  { id: 2, matchNum: 2, league: "La Liga", date: "Sat 22 Mar", fixture: "Barcelona vs Sevilla", pick: "1", odds: "1.75", confidence: 88, analysis: "Barcelona on a 6-game winning streak at Camp Nou. Sevilla have the worst away record in La Liga this season." },
  { id: 3, matchNum: 3, league: "Bundesliga", date: "Sat 22 Mar", fixture: "Bayern vs Dortmund", pick: "1", odds: "1.90", confidence: 79, analysis: "Bayern dominant at home this season, 8W-1D-0L. Dortmund's attack is inconsistent away from home." },
  { id: 4, matchNum: 4, league: "Serie A", date: "Sat 22 Mar", fixture: "Inter vs Napoli", pick: "X", odds: "3.40", confidence: 65, analysis: "These sides have drawn 3 of last 5 head-to-heads. Both teams in similar form — expect a tightly contested match." },
  { id: 5, matchNum: 5, league: "UCL", date: "Sat 22 Mar", fixture: "PSG vs Bayern", pick: "2", odds: "2.60", confidence: 71, analysis: "Bayern have a strong UCL away record. PSG's defensive frailties on the counter will be exploited." },
  { id: 6, matchNum: 6, league: "Ligue 1", date: "Sun 23 Mar", fixture: "Monaco vs Lyon", pick: "1", odds: "2.20", confidence: 74, analysis: "Monaco unbeaten at Stade Louis II in last 7 games. Lyon have conceded in every away game this month." },
];

const SportPesa = () => (
  <ValueBetsLayout
    eyebrow="SportPesa Mega Jackpot"
    title="SportPesa Jackpot Predictions"
    description="Expert picks for this week's SportPesa Mega Jackpot. Subscription required to view all matches."
    jackpotInfo={[
      { label: "Jackpot Prize", value: "KSH 100,000,000", highlight: true },
      { label: "Total Matches", value: "17 Games" },
      { label: "Deadline", value: "Sat 22 Mar, 14:00" },
      { label: "Entry Cost", value: "KSH 99" },
    ]}
    predictions={predictions}
  />
);

export default SportPesa;
