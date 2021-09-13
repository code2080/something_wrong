import _ from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import isNil from 'lodash/isNil';
import { renderElementValue } from '../../../../Utils/rendering.helpers';
import { selectMultipleExtIdLabels } from '../../../../Redux/TE/te.selectors';

// COMPONENTS
import DatasourceReadonly from '../../../Elements/DatasourceReadonly';

// SELECTORS
import {
  selectElementById,
  selectElementType,
} from '../../../../Redux/Forms/forms.selectors';

// CONSTANTS
import { elementTypes } from '../../../../Constants/elementTypes.constants';
import { selectFormObjectRequest } from '../../../../Redux/ObjectRequests/ObjectRequestsNew.selectors';
import ObjectRequestDropdown from '../../../Elements/DatasourceInner/ObjectRequestDropdown';

// HELPERS

const standardizeValue = (value) =>
  (Array.isArray(value) ? value : [value]).filter((val) => !isNil(val));

const ObjectObjectValue = ({ value, formId, sectionId, elementId }) => {
  const objectRequests = useSelector(selectFormObjectRequest(formId));

  const elementType = useSelector(
    selectElementType(formId, sectionId, elementId),
  );

  // ElementId could be scopedObject | groups | templates. In these cases we would not find any matching element from preferences, therefore element will be undefined.
  const element = useSelector(selectElementById(formId, sectionId, elementId));
  const stdValue = standardizeValue(value);
  const labels = useSelector(selectMultipleExtIdLabels)(
    stdValue.map((val) => ({ field: 'objects', extId: val })),
  );

  if (elementType === elementTypes.ELEMENT_TYPE_DATASOURCE) {
    return stdValue.map((item, itemIndex) =>
      item.split(',').map((val, valIndex) => {
        const request = _.find(objectRequests, ['_id', val]);
        return request ? (
          <ObjectRequestDropdown key={request._id} request={request} />
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

  // Will try to replace the values with labels
  const replaceWithLabels = (values, labels) =>
    Array.isArray(values) ? values.map((val) => labels[val]) : labels[values];

  const valueDisplay = element
    ? renderElementValue(values, element)
    : replaceWithLabels(values, labels);

  const requestComponents = requests
    .map((reqId) => _.find(objectRequests, ['_id', reqId]))
    .map((request) => (
      <ObjectRequestDropdown request={request} key={request._id} />
    ));
  return (
    <>
      {requestComponents}
      {!_.isEmpty(valueDisplay) && valueDisplay}
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
