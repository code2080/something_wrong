import { useLayoutEffect, useState } from 'react';

export function useAMSize() {
  const [size, setSize] = useState(0);
  useLayoutEffect(() => {
    function updateSize() {
      const el = document.getElementById('te-prefs-lib');
      const height = el.clientHeight;
      console.log('height is ' + height);
      setSize(height - 110);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}
