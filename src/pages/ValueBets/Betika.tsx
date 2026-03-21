import ValueBetsLayout from "./ValueBetsLayout";
import type { Prediction } from "./ValueBetsLayout";

const predictions: Prediction[] = [
  { id: 1, matchNum: 1, league: "EPL", date: "Wed 19 Mar", fixture: "Man City vs Wolves", pick: "1", odds: "1.55", confidence: 91, analysis: "Man City in superb form — 9 consecutive home wins. Wolves have the worst away goal difference in the EPL this season." },
  { id: 2, matchNum: 2, league: "EPL", date: "Wed 19 Mar", fixture: "Liverpool vs Everton", pick: "1", odds: "1.65", confidence: 87, analysis: "Liverpool dominant in the Merseyside derby, winning 7 of last 8. Everton without 3 key starters." },
  { id: 3, matchNum: 3, league: "La Liga", date: "Wed 19 Mar", fixture: "Real Madrid vs Getafe", pick: "1", odds: "1.45", confidence: 93, analysis: "Real Madrid have won all 9 home La Liga games this season. Getafe have scored just 1 goal in last 5 away." },
  { id: 4, matchNum: 4, league: "Serie A", date: "Thu 20 Mar", fixture: "AC Milan vs Fiorentina", pick: "1", odds: "2.00", confidence: 76, analysis: "Milan's San Siro form has been strong. Fiorentina tend to sit deep away from home — expect a Milan winner late." },
  { id: 5, matchNum: 5, league: "KPL", date: "Thu 20 Mar", fixture: "Gor Mahia vs AFC Leopards", pick: "1", odds: "2.30", confidence: 72, analysis: "Gor Mahia have won 5 of last 6 home KPL matches. The Mashemeji Derby typically favors the home side." },
];

const Betika = () => (
  <ValueBetsLayout
    eyebrow="Betika Midweek Jackpot"
    title="Betika Jackpot Predictions"
    description="Expert picks for this week's Betika Midweek Jackpot. Subscription required to view all matches."
    jackpotInfo={[
      { label: "Jackpot Prize", value: "KSH 15,000,000", highlight: true },
      { label: "Total Matches", value: "13 Games" },
      { label: "Deadline", value: "Wed 19 Mar, 18:00" },
      { label: "Entry Cost", value: "KSH 49" },
    ]}
    predictions={predictions}
  />
);

export default Betika;
