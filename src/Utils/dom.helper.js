export const getHeaderCellWidth = th => {
  if (!th) return 0;
  if (!th.children.length) return th.offsetWidth;
  return getHeaderCellWidth(th.children[0]);
};
