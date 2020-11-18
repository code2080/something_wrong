import React, { useEffect, useRef, useState } from 'react';
import { Resizable } from 'react-resizable';
import PropTypes from 'prop-types';
import ColumnHeader from './ColumnHeader';

let start = 0;
let changedWidth = 0;

const BasicHeaderCell = props => <th {...props}><ColumnHeader {...props} /></th>;

const ResizableCell = props => {
  const { width, children, index, onResized, expandable, ...restProps } = props;

  const onResize = (e, { node, size }) => {
    const table = node.closest('table');
    const col = table.childNodes[0].childNodes[index + (expandable ? 1 : 0)];
    if (!col) return;
    changedWidth = e.pageX - start;
    col.style.width = `${Number(width + changedWidth)}px`;
    col.style.minWidth = `${Number(width + changedWidth)}px`;
  };

  const onResizeStart = (e) => {    
    start = e.pageX;
  }

  const onResizeStop = (e) => {
    if (typeof onResized === 'function') {
      onResized(width + changedWidth);
    }
    start = 0;
    changedWidth = 0;
  }

  useEffect(() => {
    // Ignore all resizable-handle click
    document.querySelectorAll('.react-resizable-handle').forEach(el => el.addEventListener('click', e => e.stopPropagation()));
  }, []);

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
    >
      <th {...restProps}>
        <ColumnHeader {...restProps} children={children} />
      </th>
    </Resizable>
  );
};

ResizableCell.propTypes = {
  onResize: PropTypes.func.isRequired,
  width: PropTypes.number,
};
ResizableCell.defaultProps = {
  width: null,
};

const ResizableHeaderCell = ({ resizable, ...restProps }) => {
  if (!resizable) return <BasicHeaderCell {...restProps} />;
  return <ResizableCell {...restProps} />;
};
ResizableHeaderCell.propTypes = {
  resizable: PropTypes.bool,
  index: PropTypes.number,
};
ResizableHeaderCell.defaultProps = {
  resizable: false,
  index: 0,
};

export default ResizableHeaderCell;
