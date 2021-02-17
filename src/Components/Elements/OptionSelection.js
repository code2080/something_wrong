import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

// HELPERS
import { extractOptionFromValue } from '../../Utils/elements.helpers';

// STYLES
import './OptionSelection.scss';

const OptionSelection = ({ value, element }) => {
  // Can be either single or multiple values
  const options = useMemo(() => {
    if (!value) return [{ value: null, label: 'N/A' }];
    if (Array.isArray(value)) {
      return value.map(v => extractOptionFromValue(v, element.options));
    }
    return [extractOptionFromValue(value, element.options)];
  }, [value, element]);
  return (
    <div className='option-selection--wrapper'>
      {options.map((opt, idx) => (
        <React.Fragment key={`${opt.value}-fragment`}>
          {idx > 0 && (
            <span className='delimiter'>,</span>
          )}
          <Tooltip
            getPopupContainer={() => document.getElementById('te-prefs-lib')}
            title={`Label: ${opt.label}, value: ${opt.value}`}
            mouseEnterDelay={0.8}
          >
            <div key={opt.value} className='option--wrapper'>
              {opt.label}
            </div>
          </Tooltip>
        </React.Fragment>
      ))}
    </div>
  );
};

OptionSelection.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  element: PropTypes.object.isRequired,
};

OptionSelection.defaultProps = {
  value: null,
};

export default OptionSelection;
