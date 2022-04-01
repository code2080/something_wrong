import { Button } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

import useSSP from '../../SSP/Utils/hooks';

// STYLES
import './index.scss';

// TYPES
import { EActivityGroupings } from 'Types/Activity/ActivityGroupings.enum';
import { TActivityFilterMapObject } from 'Types/Activity/ActivityFilterLookupMap.type';

type Props = {
  filters: TActivityFilterMapObject;
};

const SspColumnFilter = ({ filters }: Props) => {
  const { applyMultipleSSPChanges } = useSSP();

  const onClickHandler = () => {
    applyMultipleSSPChanges({
      groupBy: EActivityGroupings.FLAT,
      filters: filters,
    });
  };

  return (
    <Button
      className='ssp-filter--btn'
      size='small'
      icon={<FilterOutlined />}
      onClick={onClickHandler}
    />
  );
};

export default SspColumnFilter;
