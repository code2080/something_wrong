import { Col, Modal, Row, Spin } from 'antd';
import { useSelector } from 'react-redux';
import { useState } from 'react';

// HOOKS
import { useFetchLabelsFromExtIdsWithTransformation } from 'Hooks/TECoreApiHooks';
import useSSP from '../../../SSP/Utils/hooks';

// SELECTORS
import { activityFilterLookupMapSelector } from 'Redux/ActivitiesSlice';

// HELPERS
import { getTECorePayload } from '../../helpers';

// COMPONENTS
import MatchType from '../MatchType';
import IncludeSubmission from '../IncludeSubmission';
import IncludeJointTeaching from '../IncludeJointTeaching';
import FilterProperties from '../FilterProperties';
import FilterItems from '../FilterItems';
import FilterSummary from '../FilterSummary';

// STYLES
import './index.scss';


type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const FilterModal = ({ isVisible, onClose }: Props) => {
  /**
   * SELECTORS
   */
  const filterLookupMap = useSelector(activityFilterLookupMapSelector);

  /**
   * CUSTOM HOOKS
   */
  const { loading } = useSSP();
  useFetchLabelsFromExtIdsWithTransformation(filterLookupMap, getTECorePayload);

  /**
   * STATE
   */
  const [selectedProperty, setSelectedProperty] = useState('');

  const getOptionLabel = (_args?: any) => 'heh';

  return (
    <Modal
      title='Activity filters'
      visible={isVisible}
      onOk={() => onClose()}
      onCancel={() => onClose()}
      width={1000}
      getContainer={false}
    >
      <Spin spinning={!!loading}>
        <Row>
          <Col span={8}>
            <MatchType />  
          </Col>
          <Col span={8}>
            <IncludeSubmission />  
          </Col>
          <Col span={8}>
            <IncludeJointTeaching />  
          </Col>
        </Row>
        <Row gutter={16} className='filter-modal__content'>
          <Col span={7}>
            <FilterProperties
              selectedProperty={selectedProperty}
              onSelect={setSelectedProperty}
              getOptionLabel={getOptionLabel}
            />
          </Col>
          <Col span={7}>
            <FilterItems selectedProperty={selectedProperty} getOptionLabel={getOptionLabel} />
          </Col>
          <Col span={10}>
            <FilterSummary
              values={{}}
              onClear={() => console.log('clear')}
              onDeselect={() => console.log('deselect')}
              getOptionLabel={getOptionLabel}
            />
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
};

export default FilterModal;
