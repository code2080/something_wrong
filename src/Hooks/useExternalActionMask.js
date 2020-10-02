import React from 'react';

export const useExternalActionMask = () => {
  const mask = (boundingRect) => {
    if (!boundingRect) return null;
    
    const { x: left, y: top, width, height } = boundingRect;
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
            ${left}px ${top - height}px,
            transparent 0px,
            transparent ${width / 2}px,
            rgba(0, 0, 0, 0.5) ${width / 2 + 15}px)`
        }}
      />
    );
  };

  return mask;
}
