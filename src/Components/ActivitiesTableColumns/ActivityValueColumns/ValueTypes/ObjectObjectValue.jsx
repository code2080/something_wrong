import _ from 'lodash';
import PropTypes from 'prop-types';
import { selectMultipleExtIdLabels } from '../../../../Redux/TE/te.selectors';
import { useSelector } from 'react-redux';
import isNil from 'lodash/isNil';

// COMPONENTS
import EllipsisRenderer from '../../../TableColumns/Components/EllipsisRenderer';
import DatasourceReadonly from '../../../Elements/DatasourceReadonly';

// SELECTORS
import { selectElementType } from '../../../../Redux/Forms/forms.selectors';

// CONSTANTS
import { elementTypes } from '../../../../Constants/elementTypes.constants';
import { selectFormObjectRequest } from '../../../../Redux/ObjectRequests/ObjectRequestsNew.selectors';
import ObjectRequestDropdown from '../../../Elements/DatasourceInner/ObjectRequestDropdown';

const standardizeValue = (value) =>
  (Array.isArray(value) ? value : [value]).filter((val) => !isNil(val));

const ObjectObjectValue = ({ value, formId, sectionId, elementId }) => {
  const objectRequests = useSelector(selectFormObjectRequest(formId));

  const elementType = useSelector(
    selectElementType(formId, sectionId, elementId),
  );
  const stdValue = standardizeValue(value);
  const labels = useSelector(selectMultipleExtIdLabels)(
    stdValue.map((val) => ({ field: 'objects', extId: val })),
  );

  if (elementType === elementTypes.ELEMENT_TYPE_DATASOURCE) {
    return stdValue.map((item, itemIndex) =>
      item.split(',').map((val, valIndex) => {
        const request = _.find(objectRequests, ['_id', val]);
        return request ? (
          <ObjectRequestDropdown request={request} />
        ) : (
          <DatasourceReadonly
            key={`${itemIndex}_${valIndex}`}
            value={labels[val]}
          />
        );
      }),
    );
  }

  const [requests, values] = _.partition(stdValue, (value) =>
    _.find(objectRequests, ['_id', value]),
  );

  const formattedValue = values.map((val) => labels[val] || val).join(', ');

  const requestComponents = requests
    .map((reqId) => _.find(objectRequests, ['_id', reqId]))
    .map((request) => (
      <ObjectRequestDropdown request={request} key={request._id} />
    ));
  return (
    <>
      {requestComponents}
      {!_.isEmpty(formattedValue) && <EllipsisRenderer text={formattedValue} />}
    </>
  );
};

ObjectObjectValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  formId: PropTypes.string,
  sectionId: PropTypes.string,
  elementId: PropTypes.string,
};

export default ObjectObjectValue;
