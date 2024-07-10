export const myData = [
  {
    name: "OpenStreetMap",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  {
    name: "TopoMap",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
  },
  {
    name: "WorldStreetMap",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  },
  {
    name: "Satellite",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  },
];

export const getMonths = [
  { month: "January", code: "01", days: 31 },
  { month: "February", code: "02", days: 29 },
  { month: "March", code: "03", days: 31 },
  { month: "April", code: "04", days: 30 },
  { month: "May", code: "05", days: 31 },
  { month: "June", code: "06", days: 30 },
  { month: "July", code: "07", days: 31 },
  { month: "August", code: "08", days: 31 },
  { month: "September", code: "09", days: 30 },
  { month: "October", code: "10", days: 31 },
  { month: "November", code: "11", days: 30 },
  { month: "December", code: "12", days: 31 },
];

export const colors = [
  "#FFC436",
  "#FF8F8F",
  "#0C356A",
  "#B15EFF",
  "7752FE",
  "#363062",
  "#176B87",
  "#04364A",
  "#F1B4BB",
  "#FF6969",
  "#419197",
];

export const indicators = [
  {
    Code: "WKW-2.4",
    Description:
      "EG.5-3 Number of microenterprises supported by USG assistance",
  },
  {
    Code: "WKW-3",
    Description:
      "[HL.8.3-3] Number of water and sanitation sector institutions strengthened to manage water resources or improve water supply and sanitation services as a result of USG assistance",
  },

  {
    Code: "WKW-4.1",
    Description:
      "[Custom] Number of finance instruments set up to mobilize private/public sector investments in support of WRM and rural/urban water investments with USG assistance",
  },
  {
    Code: "WKW-4.2",
    Description:
      "[EG 4.2-1] Number of clients benefiting from financial services provided through USG-assisted financial intermediaries, including non-financial institutions or actors",
  },
  {
    Code: "WKW-4.4",
    Description:
      "PSE-1 Number of USG engagements jointly undertaken with private sector enterprises to support U.S. foreign assistance objectives",
  },
  {
    Code: "WKW-4.5",
    Description:
      "PSE-2 Number of private sector enterprises that engaged with the USG to support U.S. Foreign Assistance objectives",
  },

  {
    Code: "WKW-2.5",
    Description:
      "[EG.5-12] Number of small and medium-sized enterprises supported by USG assistance",
  },

  {
    Code: "WKW-5.1",
    Description:
      "[Custom] Percentage increase in county budget allocations to WASH as a result of USG assistance",
  },
];
