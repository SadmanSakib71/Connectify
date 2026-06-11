export const scrollToTop = () => {
  const feedColumn = document.querySelector('._layout_middle_wrap');
  if (feedColumn) {
    feedColumn.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};
