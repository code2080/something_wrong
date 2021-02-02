import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';

let currentDraggingIndex = -1;

const BodyRow = ({
  isOver,
  connectDragSource,
  connectDropTarget,
  moveRow,
  ...restProps
}) => {
  const style = { ...restProps.style, cursor: 'move' };

  let { className } = restProps;
  if (isOver) {
    if (restProps.index > currentDraggingIndex) {
      className += ' drop-over-downward';
    }
    if (restProps.index < currentDraggingIndex) {
      className += ' drop-over-upward';
    }
  }

  return connectDragSource(
    connectDropTarget(<tr {...restProps} className={className} style={style} />),
  );
};

BodyRow.propTypes = {
  isOver: PropTypes.bool,
  connectDragSource: PropTypes.object,
  connectDropTarget: PropTypes.object,
  moveRow: PropTypes.func,
  currentDraggingIndex: PropTypes.number,
};

const rowSource = {
  beginDrag(props) {
    currentDraggingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

export const DraggableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);
