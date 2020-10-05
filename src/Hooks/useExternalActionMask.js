import React from 'react';

export const useExternalActionMask = () => {
  const mask = (spotlightPositionInfo) => {
    if (!spotlightPositionInfo) return null;
    
    const { boundingRect: { x: left, y: top, width, height}, scroll: [scrollLeft, scrollTop] } = spotlightPositionInfo;
    return (
      <div
        className="mask"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: 99,
          top: 0,
          background: `radial-gradient(closest-side at 
            ${left + scrollLeft}px ${top + scrollTop - height * 1.25}px,
            transparent 0px,
            transparent ${width / 2 + 15}px,
            rgba(0, 0, 0, 0.5) ${width / 2 + 30}px)`
        }}
      />
    );
  };

  return mask;
}
