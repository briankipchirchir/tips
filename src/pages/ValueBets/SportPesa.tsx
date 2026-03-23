import ValueBetsLayout from "./ValueBetsLayout";

const SportPesa = () => (
  <ValueBetsLayout
    eyebrow="SportPesa Mega Jackpot"
    title="SportPesa Jackpot Predictions"
    description="Expert picks for this week's SportPesa Mega Jackpot. Subscription required to view all matches."
    category="SPORTPESA"
    jackpotInfo={[
      { label: "Jackpot Prize", value: "KSH 100,000,000", highlight: true },
      { label: "Total Matches", value: "17 Games" },
      { label: "Entry Cost",    value: "KSH 99" },
    ]}
  />
);
export default SportPesa;
