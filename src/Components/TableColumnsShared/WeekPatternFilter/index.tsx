import { Button } from "antd";
import { FilterOutlined } from '@ant-design/icons';

import useSSP from '../../SSP/Utils/hooks';

// STYLES
import './index.scss';

// TYPES
import { EActivityGroupings } from "Types/Activity/ActivityGroupings.enum";

type Props = {
  wpgId: string;
};

const WeekPatternFilter = ({ wpgId }: Props) => {
  const { applyMultipleSSPChanges } = useSSP();

  const onClickHandler = () => {
    applyMultipleSSPChanges({ groupBy: EActivityGroupings.FLAT, filters: { weekPatternUID: [wpgId] }});
  };

  return <Button className="wp-filter--btn" size="small" icon={<FilterOutlined />} onClick={onClickHandler} />
};

export default WeekPatternFilter;