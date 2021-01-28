import React, { useEffect, useRef, useState } from 'react';
import { Resizable } from 'react-resizable';
import PropTypes from 'prop-types';
import ColumnHeader from './ColumnHeader';
import _ from 'lodash';
import { getHeaderCellWidth } from '../../Utils/dom.helper';

let start = 0;
let changedWidth = 0;

const BasicHeaderCell = props => <th {...props}><ColumnHeader {...props} /></th>;

const ResizableCell = props => {
  const { width, children, index, onResized, expandable, ...restProps } = props;
  const [minCellWidth, setMinCellWidth] = useState(0);

  const ref = useRef(null);
  const onResize = (e, { node, size }) => {
    e.preventDefault();
    e.stopPropagation();
    const table = node.closest('table');
    const col = table.childNodes[0].childNodes[index + (expandable ? 1 : 0)];
    if (!col) return;
    changedWidth = e.pageX - start;
    col.style.width = `${_.max([Number(width + changedWidth), minCellWidth])}px`;
    col.style.minWidth = `${_.max([Number(width + changedWidth), minCellWidth])}px`;
  };

  const onResizeStart = (e) => {
    ref.current.addEventListener('click', terminateClickEvent);
    start = e.pageX;
  }

  const onResizeStop = (e) => {
    if (typeof onResized === 'function') {
      onResized(_.max([width + changedWidth, minCellWidth]));
    }
    start = 0;
    changedWidth = 0;
    ref.current.removeEventListener('click', terminateClickEvent);
  }

  const terminateClickEvent = e => {
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    document.querySelectorAll('.react-resizable-handle').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();
      });
    });
    if (ref && ref.current) {
      setMinCellWidth(50 + getHeaderCellWidth(ref.current));
    }
  }, [ref]);

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
    >
      <th {...restProps} ref={ref}>
        <ColumnHeader {...restProps} children={children} />
      </th>
    </Resizable>
  );
};

ResizableCell.propTypes = {
  width: PropTypes.number,
};
ResizableCell.defaultProps = {
  width: null,
};

const ResizableHeaderCell = ({ resizable, onResized, expandable,  ...restProps }) => {
  if (!resizable) return <BasicHeaderCell {...restProps} />;
  return <ResizableCell {...restProps} onResized={onResized} expandable={expandable} />;
};
ResizableHeaderCell.propTypes = {
  resizable: PropTypes.bool,
  index: PropTypes.number,
  expandable: PropTypes.bool,
};
ResizableHeaderCell.defaultProps = {
  resizable: false,
  index: 0,
  expandable: false,
};

export default ResizableHeaderCell;
