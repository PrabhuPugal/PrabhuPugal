// States visited — must match the state name in the US atlas GeoJSON
export const visitedStates = [
  "California",
  "Arizona",
  "Georgia",
  "Illinois",
  "Florida",
  "Missouri",
  "Tennessee",
];

// Cities visited — coordinates: [longitude, latitude]
// labelDx/labelAnchor: optional label nudge to avoid overlaps
export const visitedCities = [
  // California
  { name: "Los Angeles",  state: "CA", coordinates: [-118.2437, 34.0522], isHome: true },

  // Arizona
  { name: "Phoenix",      state: "AZ", coordinates: [-112.0740, 33.4484] },
  { name: "Sedona",       state: "AZ", coordinates: [-111.7650, 34.8697] },

  // Florida
  { name: "Jacksonville", state: "FL", coordinates: [ -81.6557, 30.3322] },
  { name: "Daytona",      state: "FL", coordinates: [ -81.0228, 29.2108], labelDx:  7, labelAnchor: "start" },
  { name: "Orlando",      state: "FL", coordinates: [ -81.3792, 28.5383], labelDx: -7, labelAnchor: "end"   },

  // Georgia
  { name: "Atlanta",      state: "GA", coordinates: [ -84.3880, 33.7490] },

  // Illinois
  { name: "Chicago",      state: "IL", coordinates: [ -87.6298, 41.8781] },
  { name: "Champaign",    state: "IL", coordinates: [ -88.2434, 40.1164] },

  // Missouri
  { name: "Kansas City",  state: "MO", coordinates: [ -94.5786, 39.0997] },

  // Tennessee
  { name: "Nashville",    state: "TN", coordinates: [ -86.7816, 36.1627] },
];
