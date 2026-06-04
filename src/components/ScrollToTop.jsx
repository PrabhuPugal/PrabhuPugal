import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets the .pageFlow scroll container to the top on every route change.
 * Must be rendered inside <Router> so useLocation is available.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const el = document.querySelector(".pageFlow");
    if (el) el.scrollTop = 0;
  }, [pathname]);

  return null;
}
