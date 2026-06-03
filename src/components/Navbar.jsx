import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar({ sections, onSelectSection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navSections = sections;

  const handleLogoClick = () => {
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <button type="button" className={styles.logo} onClick={handleLogoClick}>
          pb
        </button>

        <ul className={styles.links}>
          {navSections.map((section) => (
            <li key={section.id}>
              <NavLink
                to={section.path}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
              >
                {section.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.drawer}>
          {navSections.map((section) => (
            <NavLink
              key={section.id}
              to={section.path}
              className={({ isActive }) =>
                `${styles.drawerLink} ${isActive ? styles.drawerActive : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {section.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
