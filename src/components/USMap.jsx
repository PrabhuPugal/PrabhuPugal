import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { visitedStates, visitedCities } from "../data/travel";
import { useTheme } from "../context/useTheme";
import { MapPin, X } from "lucide-react";
import styles from "./USMap.module.css";

const GEO_URL   = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
const PIN_RED   = "#E53E3E";
const HOME_COLOR = "#FFC72C"; // USC gold

function Map({ isDark, size = "normal" }) {
  const [tooltip, setTooltip] = useState(null);

  const stateDefault = isDark ? "#2A2A2A" : "#E8E6E2";
  const stateVisited = isDark ? "#3E3E3E" : "#D0CCC7";
  const stateBorder  = isDark ? "#1A1A1A" : "#C8C5C1";
  const labelColor   = isDark ? "#C4C2BE" : "#3C3C3C";
  const isLarge      = size === "large";

  return (
    <div className={styles.mapWrap}>
      <ComposableMap
        projection="geoAlbersUsa"
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isVisited = visitedStates.includes(geo.properties.name);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isVisited ? stateVisited : stateDefault}
                  stroke={stateBorder}
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover:   { outline: "none", fill: isVisited ? (isDark ? "#484848" : "#C4C0BB") : stateDefault },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>

        {visitedCities.map(({ name, state, coordinates, isHome }) => (
          <Marker
            key={`${name}-${state}`}
            coordinates={coordinates}
            onMouseEnter={() => setTooltip(isHome ? `${name}, ${state} 🏠` : `${name}, ${state}`)}
            onMouseLeave={() => setTooltip(null)}
          >
            {isHome ? (
              <>
                <circle r={isLarge ? 8 : 6} fill={HOME_COLOR} opacity={0.25} />
                <circle r={isLarge ? 4 : 3} fill={HOME_COLOR} />
                <text textAnchor="middle" y={isLarge ? -13 : -10}
                  style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: isLarge ? "8px" : "6.5px", fontWeight: 600, fill: HOME_COLOR, pointerEvents: "none" }}>
                  ⌂ {name}
                </text>
              </>
            ) : (
              <>
                <circle r={isLarge ? 5 : 4} fill={PIN_RED} opacity={0.2} />
                <circle r={isLarge ? 2.5 : 2} fill={PIN_RED} />
                <text textAnchor="middle" y={isLarge ? -10 : -8}
                  style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: isLarge ? "7px" : "5.5px", fill: labelColor, pointerEvents: "none" }}>
                  {name}
                </text>
              </>
            )}
          </Marker>
        ))}
      </ComposableMap>

      {tooltip && <div className={styles.tooltip}>{tooltip}</div>}
    </div>
  );
}

export default function USMap() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Collapsed trigger */}
      <button className={styles.trigger} onClick={() => setOpen(true)}>
        <MapPin size={13} className={styles.triggerIcon} />
        <span className={styles.triggerText}>cities visited</span>
        <span className={styles.triggerCount}>
          {visitedStates.length} states · {visitedCities.length} cities
        </span>
        <span className={styles.triggerHint}>click to explore →</span>
      </button>

      {/* Overlay */}
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.label}>cities visited</span>
                <span className={styles.count}>{visitedStates.length} states · {visitedCities.length} cities</span>
              </div>
              <div className={styles.modalLegend}>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: HOME_COLOR }} /> home
                </span>
                <span className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: PIN_RED }} /> visited
                </span>
                <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close map">
                  <X size={16} />
                </button>
              </div>
            </div>
            <Map isDark={isDark} size="large" />
          </div>
        </div>
      )}
    </>
  );
}
