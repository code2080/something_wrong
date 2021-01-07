import React from 'react';

export const SpotlightMask = ({ spotlightPositionInfo }) => {
  if (!spotlightPositionInfo) return null;

  const { boundingRect: { x: left, y: top, width, height } } = spotlightPositionInfo;
  const [scrollLeft, scrollTop] = window.tePrefsScroll;
  const [offsetX, offsetY] = window.tePrefsOffset;
  return (
      <svg style={{
        width: '100%',
        height: `${window.tePrefsHeight}px`,
        top: 0,
        left: 0,
        position: 'absolute',
        zIndex: 6,
      }} >
        <defs>
          <filter id="blur" x={-width} y={-height} width={width * 2} height={height * 2} >
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <mask id="spotlightMask">
            <rect width="200%" height="200%" fill="white" />
            <ellipse
              cx={left + width / 2 - offsetX + scrollLeft}
              cy={top + height / 2 - offsetY + scrollTop}
              rx={width / 2 + width * 0.1}
              ry={height / 2 + height * 0.1}
              fill="black"
              filter="url(#blur)"
            />
          </mask>
        </defs>
        <rect fill="black" fillOpacity="0.8" width="100%" height="100%" mask="url(#spotlightMask)" />
      </svg>
  );
};

export default SpotlightMask;
