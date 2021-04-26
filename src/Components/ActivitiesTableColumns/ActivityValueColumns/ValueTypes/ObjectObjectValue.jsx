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

const standardizeValue = (value) =>
  (Array.isArray(value) ? value : [value]).filter((val) => !isNil(val));

const ObjectObjectValue = ({ value, formId, sectionId, elementId }) => {
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
        return (
          <DatasourceReadonly key={`${itemIndex}_${valIndex}`} value={val} />
        );
      }),
    );
  }

  const formattedValue = stdValue.map((val) => labels[val] || val).join(', ');
  return <EllipsisRenderer text={formattedValue} />;
};

ObjectObjectValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  formId: PropTypes.string,
  sectionId: PropTypes.string,
  elementId: PropTypes.string,
};

export default ObjectObjectValue;
