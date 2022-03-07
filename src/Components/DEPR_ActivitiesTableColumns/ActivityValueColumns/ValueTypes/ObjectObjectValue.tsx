import _, { Dictionary } from 'lodash';
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

type ObjectObjectValueProps = {
  value: string | string[];
  formId?: string;
  sectionId?: string;
  elementId?: string;
};

const standardizeValue = (value: string | string[]): string[] =>
  (Array.isArray(value) ? value : [value]).filter((val) => !isNil(val));

const ObjectObjectValue = ({
  value,
  formId,
  sectionId,
  elementId,
}: ObjectObjectValueProps): JSX.Element => {
  const objectRequests = useSelector(selectFormObjectRequest(formId ?? ''));

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
    return (
      <>
        {stdValue.map((extId, itemIndex) => {
          const request = _.find(objectRequests, ['_id', extId]);
          return request ? (
            <ObjectRequestDropdown key={request._id} request={request} />
          ) : (
            <DatasourceReadonly key={itemIndex} value={labels[extId]} />
          );
        })}
      </>
    );
  }

  const [requests, values] = _.partition(stdValue, (value) =>
    _.find(objectRequests, ['_id', value]),
  );

  // Will try to replace the values with labels
  const replaceWithLabels = (values: string[], labels: Dictionary<string>) =>
    values.map((val) => labels[val]);

  const valueDisplay = element
    ? values.map((val, valIndex) => (
        <>
          <span key={valIndex}>{renderElementValue(val, element)}</span>
          {valIndex < values.length - 1 && `, `}
        </>
      ))
    : replaceWithLabels(values, labels);

  const requestComponents = requests
    .map((reqId) => _.find(objectRequests, ['_id', reqId]))
    .filter(Boolean)
    .map((request) => (
      <ObjectRequestDropdown request={request} key={request?._id || ''} />
    ));
  return (
    <>
      {requestComponents}
      {!_.isEmpty(valueDisplay) && valueDisplay}
    </>
  );
};

ObjectObjectValue.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  formId: PropTypes.string,
  sectionId: PropTypes.string,
  elementId: PropTypes.string,
};

export default ObjectObjectValue;
