import PropTypes from 'prop-types';

// STYLES
import './ExpandedPane.scss';

const getValueDisplay = (row, col) => {
  if (!row || !col) return null;
  const { render, dataIndex } = col;
  if (typeof render !== 'function') return row[dataIndex];
  if (col.dataIndex) return render(row[col.dataIndex], row);
  return render(row, row);
};

const ExpandedPane = ({ columns, row }) => (
  <div className='dynamic-table--expanded__wrapper'>
    {(columns || [])
      .filter((col) => !col.hideInList && col.title && col.title !== '')
      .map((col) => {
        const valueDisplay = getValueDisplay(row, col);
        return (
          <div
            className='dynamic-table--expanded--item'
            key={col.key || col.dataIndex}
          >
            <div className='title'>{col.title}:</div>
            <div className='value'>{valueDisplay}</div>
          </div>
        );
      })}
  </div>
);

ExpandedPane.propTypes = {
  columns: PropTypes.array.isRequired,
  row: PropTypes.object.isRequired,
};

export default ExpandedPane;
