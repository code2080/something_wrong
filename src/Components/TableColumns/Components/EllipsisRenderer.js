import PropTypes from 'prop-types';

const EllipsisRenderer = ({ text, title, width }) => {
  return (
    <div
      alt={text}
      title={title || text}
      style={{
        width: `${width}px`,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        background: 'transparent',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <span style={{ background: 'rgba(255, 255, 255, 0.75)' }}>{text}</span>
    </div>
  );
};

EllipsisRenderer.propTypes = {
  text: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.number,
};

EllipsisRenderer.defaultProps = {
  text: '',
  title: '',
  width: 150,
};

export default EllipsisRenderer;
