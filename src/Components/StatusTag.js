import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';

// CONSTANTS
import {
  themeColors,
  themeColorTextColor,
} from '../Constants/themeColors.constants';

const StatusTag = ({ children, color }) => {
  const resolvedColor = useMemo(() => {
    if (themeColors[color]) return color;
    return themeColors.swedishSkies;
  }, [color]);
  return (
    <Tag color={themeColors[resolvedColor]}>
      <span style={{ color: themeColorTextColor[resolvedColor] }}>
        {children}
      </span>
    </Tag>
  );
};

StatusTag.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
};

StatusTag.defaultProps = {
  color: null,
};

export default StatusTag;
