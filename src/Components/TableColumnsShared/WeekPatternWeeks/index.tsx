import moment from "moment";
import { useSelector } from "react-redux";

// REDUX
import { weekPatternGroupSelector } from "Redux/Activities/weekPatternGroups";

type Props = {
  wpgId: string;
};

const WeekPatternWeeks = ({ wpgId }: Props) => {
  const weekPatternGroup = useSelector(weekPatternGroupSelector(wpgId));
  if (!weekPatternGroup) return <span>N/A</span>;
  const startWeeks = weekPatternGroup.weeks.map((el) => el[0]);
  const endWeeks = weekPatternGroup.weeks.map((el) => el[1]);

  const minDate = startWeeks.reduce((a, b) => a < b ? a : b); 
  const maxDate = endWeeks.reduce((a, b) => a > b ? a : b);

  return <span>{`${moment.utc(minDate).format('[Week ]WW')} - ${moment.utc(maxDate).format('[Week ]WW')}`}</span>;
};

export default WeekPatternWeeks;