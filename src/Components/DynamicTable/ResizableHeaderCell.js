import { useEffect, useRef, useState } from 'react';
import { Resizable } from 'react-resizable';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { getHeaderCellWidth } from '../../Utils/dom.helper';
import ColumnHeader from './ColumnHeader';

let start = 0;
let changedWidth = 0;

const terminateClickEvent = (e) => {
  e.stopPropagation();
  e.preventDefault();
};

const BasicHeaderCell = (props) => (
  <th {...props}>
    <ColumnHeader {...props} />
  </th>
);

const ResizableCell = (props) => {
  const { width, children, index, onResized, expandable, ...restProps } = props;
  const [minCellWidth, setMinCellWidth] = useState(0);

  const ref = useRef(null);
  const onResize = (e, { node, _size }) => {
    e.preventDefault();
    e.stopPropagation();
    const tableHeader = node.closest('table');
    const tableHeaderWrapper = tableHeader.closest('.ant-table-header');
    if (!tableHeader || !tableHeaderWrapper) return;

    const tableContent =
      tableHeaderWrapper.nextElementSibling?.querySelector('table');
    if (!tableContent) return;

    const col =
      tableHeader.childNodes[0].childNodes[index + (expandable ? 1 : 0)];
    const contentCol =
      tableContent.childNodes[0].childNodes[index + (expandable ? 1 : 0)];
    if (!col) return;

    changedWidth = e.pageX - start;
    col.style.width = `${_.max([
      Number(width + changedWidth),
      minCellWidth,
    ])}px`;
    contentCol.style.width = `${_.max([
      Number(width + changedWidth),
      minCellWidth,
    ])}px`;
  };

  const onResizeStart = (e) => {
    ref.current.addEventListener('click', terminateClickEvent);
    start = e.pageX;
  };

  const onResizeStop = () => {
    if (typeof onResized === 'function') {
      onResized(_.max([width + changedWidth, minCellWidth]));
    }
    start = 0;
    changedWidth = 0;
    setTimeout(() => {
      if (ref.current) {
        ref.current.removeEventListener('click', terminateClickEvent);
      }
    }, 300);
  };

  useEffect(() => {
    document.querySelectorAll('.react-resizable-handle').forEach((el) => {
      el.addEventListener('click', terminateClickEvent);
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
        <ColumnHeader {...restProps}>{children}</ColumnHeader>
      </th>
    </Resizable>
  );
};

ResizableCell.propTypes = {
  width: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  onResized: PropTypes.func,
  expandable: PropTypes.bool,
  index: PropTypes.number,
};

ResizableCell.defaultProps = {
  width: null,
};

const ResizableHeaderCell = ({
  resizable,
  onResized,
  expandable,
  ...restProps
}) => {
  if (!resizable) return <BasicHeaderCell {...restProps} />;
  return (
    <ResizableCell
      {...restProps}
      onResized={onResized}
      expandable={expandable}
    />
  );
};

ResizableHeaderCell.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.array]),
  resizable: PropTypes.bool,
  index: PropTypes.number,
  onResized: PropTypes.func,
  expandable: PropTypes.bool,
};
ResizableHeaderCell.defaultProps = {
  resizable: false,
  index: 0,
  expandable: false,
};

export default ResizableHeaderCell;
