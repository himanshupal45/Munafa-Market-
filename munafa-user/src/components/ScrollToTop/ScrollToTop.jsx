import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Window ko top par scroll karein
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    // Custom scroll containers (agar hain toh unhe bhi top karein)
    const containers = document.querySelectorAll('.app-main, .app-layout, main');
    containers.forEach((el) => {
      el.scrollTop = 0;
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;