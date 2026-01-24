interface Props {
  title: string;
  value: string;
}

const StatsCard = ({ title, value }: Props) => {
  return (
    <div className="stats-card">
      <p className="stats-title">{title}</p>
      <h3 className="stats-value">{value}</h3>
    </div>
  );
};

export default StatsCard;
