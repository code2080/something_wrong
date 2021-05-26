export const getHeaderCellWidth = (th) => {
  if (!th) return 0;
  if (!th.children.length) return th.offsetWidth;
  return getHeaderCellWidth(th.children[0]);
};

export const closeAllDropdown = () => {
  const dropdowns = document.querySelectorAll('.ant-dropdown');
  for (let i = 0; i < dropdowns.length; i += 1) {
    const dropdown = dropdowns[i];
    if (dropdown && !dropdown.classList.contains('ant-dropdown-hidden')) {
      dropdown.classList.add('ant-dropdown-hidden');
    }
  }
};
