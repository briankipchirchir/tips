import ValueBetsLayout from "./ValueBetsLayout";

const Betika = () => (
  <ValueBetsLayout
    eyebrow="Betika Midweek Jackpot"
    title="Betika Jackpot Predictions"
    description="Expert picks for this week's Betika Midweek Jackpot. Subscription required to view all matches."
    category="BETIKA"
    jackpotInfo={[
      { label: "Jackpot Prize", value: "KSH 15,000,000", highlight: true },
      { label: "Total Matches", value: "13 Games" },
      { label: "Entry Cost",    value: "KSH 49" },
    ]}
  />
);
export default Betika;
