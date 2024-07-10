/* eslint-disable jsx-a11y/anchor-is-valid */
import { faDownload, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import html2canvas from "html2canvas";
import Map from "ol/Map";
import View from "ol/View";
import {
  ScaleLine,
  Zoom,
  ZoomToExtent,
  defaults as defaultControls,
} from "ol/control";
import GeoJSON from "ol/format/GeoJSON";
import Draw, { createBox } from "ol/interaction/Draw";
import Graticule from "ol/layer/Graticule";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { Vector as VectorSource } from "ol/source";
import XYZ from "ol/source/XYZ";
import {
  Circle as CircleStyle,
  Fill,
  Icon,
  Stroke,
  Style,
  Text,
} from "ol/style";
import { useEffect, useRef, useState } from "react";
import "../../Styles/gis.scss";
import bn from "../../assets/imgs/bn.png";
import Input from "../Util/Input";
import Loading from "../Util/Loading";
import RippleLoading from "../Util/RippleLoading";
import Basemaps from "./Basemaps";
import Popup from "./Popup.jsx";
import RightPanel from "./RightPanel";
import MapTemplate from "./MapTemplate.jsx";

export default function CountyAll(props) {
  const { myData } = require("../../assets/data/data.js");
  const { colors } = require("../../assets/data/data.js");
  const [active, setActive] = useState("Results");
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapRefresh, setMapRefresh] = useState(false);
  const [mapSize, setMapSize] = useState({});
  const [dataUrl, setDataUrl] = useState(null);
  const [activeVis, setActiveVis] = useState("Normal");
  const [visualization, setVisualization] = useState([]);
  const [arf, setArf] = useState(new VectorLayer({ title: "Activities" }));
  const [rmf, setRmf] = useState(new VectorLayer({ title: "Results" }));
  const [taf, setTaf] = useState(new VectorLayer({ title: "TAs" }));
  const [beneficiaries, setBeneficiaries] = useState(
    new VectorLayer({ title: "Beneficiaries" })
  );
  const [county, setCounty] = useState(new VectorLayer({ title: "Counties" }));
  const [subcounty, setSubCounty] = useState(
    new VectorLayer({ title: "Sub Counties" })
  );
  let source1 = new VectorSource();
  const [drawlayer, setDrawLayer] = useState(
    new VectorLayer({ title: "Draw", source: source1 })
  );
  const [selected, setSelected] = useState(0);
  const [ward, setWard] = useState(new VectorLayer({ title: "Wards" }));
  const [data, setData] = useState([]);
  const [basemap, setBasemap] = useState(new TileLayer({ title: "Basemap" }));
  const [graticule, setGraticule] = useState(
    new Graticule({
      strokeStyle: new Stroke({
        color: "rgba(0,0,0,0.5)",
        width: 2,
        lineDash: [0.5, 8],
      }),
      showLabels: true,
      wrapX: false,
      className: "graticule",
      title: "Grid",
      latLabelStyle: new Text({
        font: "12px Calibri,sans-serif",
        padding: "8px",
        textAlign: "end",
        fill: new Fill({
          color: "rgba(0,0,0,1)",
        }),
        stroke: new Stroke({
          color: "rgba(255,255,255,1)",
          width: 3,
        }),
      }),
    })
  );
  const [scale, setScale] = useState("");
  const [controls, setControls] = useState([]);
  const [year, setYear] = useState("2023");
  const [activeF, setActiveF] = useState(year);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [popup, setPopup] = useState(null);
  const [dowloading, setDownloading] = useState(false);
  const [unique, setUnique] = useState(["Results", "TAs", "Activities"]);
  let uniquex = ["Results", "TAs", "Activities"];
  const [isLoading, setIsLoading] = useState(false);
  const [mapExport, setMapExport] = useState(false);
  const [baseSelector, setBaseSelector] = useState(null);
  const [extent, setExtent] = useState([
    4185121.788385366, -342263.56009544665, 4348867.3136286605,
    -6199.27329767576,
  ]);
  //set initial state
  const [map, setMap] = useState(null);
  const mapElement = useRef();
  const exportmap = useRef();
  const mapRef = useRef();
  mapRef.current = map;
  let draw = new Draw({
    source: source1,
    type: "Circle",
    geometryFunction: createBox(),
  });

  const types = {
    Results: ["Normal", "StakeholderType", "TA_Provided", "TAThrough"],
    TAs: ["Normal", "BeneficiaryType", "TA_Provided", "TAThrough"],
    Activities: ["Normal", "ActivityType"],
  };

  useEffect(() => {
    basemap.setSource(
      new XYZ({
        url: myData[0].url,
        crossOrigin: "anonymous",
      })
    );
    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        basemap,
        beneficiaries,
        arf,
        rmf,
        taf,
        ward,
        subcounty,
        county,
        graticule,
        drawlayer,
      ],
      view: new View({
        projection: "EPSG:4326",
        center: [36.45, -0.1],
        zoom: 12,
        maxZoom: 20,
      }),
      controls: defaultControls().extend([
        new ZoomToExtent({
          extent: [34.36168, 0.41839, 35.06887, 1.14702],
        }),
        new ScaleLine({
          units: "metric",
          bar: false,
          text: "Scale",
        }),
      ]),
    });

    subcounty.setVisible(false);
    ward.setVisible(false);

    initialMap.on("dblclick", function (evt) {
      let features = [];
      initialMap.forEachFeatureAtPixel(
        evt.pixel,
        function (clickedFeature, layer) {
          const attributes = clickedFeature?.getProperties();
          const layerTitle = layer?.get("title");

          features.push({ Name: layerTitle, data: attributes });
        }
      );
      if (features.length > 0) {
        setPopup(features);
      }
    });

    setMap(initialMap);
    return () => {
      initialMap.setTarget(null);
    };
  }, []);

  useEffect(() => {
    if (map) {
      map.updateSize();
    }
  }, [props.fullscreen]);

  useEffect(() => {
    if (map) {
      const today = new Date();
      setYear(today.getFullYear());
      const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      setStart(`${today.getFullYear()}-01-01`);
      setEnd(lastDate.toISOString().split("T")[0]);
      if (start !== "" && end !== "") {
        fetchAll(rmf, "rmf", colors[0]);
        fetchAll(taf, "taf", colors[1]);
        fetchAll(arf, "arf", colors[2]);
      }

      fetchBeneficiaries();
    }
  }, [map]);

  useEffect(() => {
    switch (activeF) {
      case "Q1":
        setStart(`${year}-01-01`);
        setEnd(`${year}-03-31`);
        break;
      case "Q2":
        setStart(`${year}-04-01`);
        setEnd(`${year}-06-30`);
        break;
      case "Q3":
        setStart(`${year}-07-01`);
        setEnd(`${year}-09-30`);
        break;
      case "Q4":
        setStart(`${year}-10-01`);
        setEnd(`${year}-12-31`);
        break;
      case year:
        const today = new Date();
        const lDate = new Date(year, today.getMonth() + 1, 1);
        setStart(`${year}-01-01`);
        setEnd(lDate.toISOString().split("T")[0]);
        break;
      case "All Time":
        const td = new Date();
        const lastDate = new Date(year, td.getMonth() + 1, 1);
        setStart(`2022-09-01`);
        setEnd(lastDate.toISOString().split("T")[0]);
        break;
      default:
        break;
    }
  }, [activeF, year]);

  useEffect(() => {
    if (start !== "" && end !== "") {
      fetchAll(rmf, "rmf", colors[0]);
      fetchAll(taf, "taf", colors[1]);
      fetchAll(arf, "arf", colors[2]);
    }
  }, [start, end]);

  useEffect(() => {
    if (map && filter.length > 0) {
      switch (active) {
        case "Activities":
          fetchAll(arf, "arf", colors[0]);
          break;
        case "Results":
          fetchAll(rmf, "rmf", colors[1]);
          break;
        case "TAs":
          fetchAll(taf, "taf", colors[2]);
          break;
        default:
          break;
      }
    }
  }, [filter]);

  function fetchAll(datalayer, url, color) {
    datalayer.setSource(new VectorSource());
    if (filter.length === 0) {
      setLoading(true);
      fetch(`/api/${url}/geojson/${start}/${end}`)
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("");
        })
        .then((data) => {
          if (data && data.length > 0) {
            setData(data);
            let points = [];
            data.map((e) => {
              let prp = e;
              delete prp.geom;
              let d = {
                type: "Feature",
                geometry: e.point,
                properties: prp,
              };
              points.push(d);
            });
            let geojsonData = {
              type: "FeatureCollection",
              features: points,
            };

            let geojsonSource = new VectorSource({
              features: new GeoJSON().readFeatures(geojsonData),
            });

            datalayer.setSource(geojsonSource);
            datalayer.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 6,
                  fill: new Fill({
                    color: color,
                  }),
                  stroke: new Stroke({
                    color: "black",
                    width: 1,
                  }),
                }),
              })
            );
            let extent = geojsonSource.getExtent();

            map?.getView().fit(extent, { padding: [100, 100, 100, 100] });
          }
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      fetch(`/api/${url}/geojson/filters`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ filters: filter }),
      })
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("");
        })
        .then((data) => {
          if (data && data.length > 0) {
            setData(data);
            let points = [];
            data.map((e) => {
              let prp = e;
              delete prp.geom;
              let d = {
                type: "Feature",
                geometry: e.point,
                properties: prp,
              };
              points.push(d);
            });
            let geojsonData = {
              type: "FeatureCollection",
              features: points,
            };

            let geojsonSource = new VectorSource({
              features: new GeoJSON().readFeatures(geojsonData),
            });

            datalayer.setSource(geojsonSource);
            datalayer.setStyle(
              new Style({
                image: new CircleStyle({
                  radius: 6,
                  fill: new Fill({
                    color: color,
                  }),
                  stroke: new Stroke({
                    color: "black",
                    width: 1,
                  }),
                }),
              })
            );
            let extent = geojsonSource.getExtent();

            map?.getView().fit(extent, { padding: [100, 100, 100, 100] });
          }
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }

  function fetchBeneficiaries() {
    setLoading(true);
    fetch(`/api/waterproviders`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        if (data && data.length > 0) {
          let points = [];
          data.map((e) => {
            let d = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  parseFloat(e?.Longitude),
                  parseFloat(e?.Latitude),
                ],
              },
              properties: e,
            };
            points.push(d);
          });

          let geojsonData = {
            type: "FeatureCollection",
            features: points,
          };

          let geojsonSource = new VectorSource({
            features: new GeoJSON().readFeatures(geojsonData),
          });

          beneficiaries.setSource(geojsonSource);
          beneficiaries.setStyle(
            new Style({
              image: new Icon({
                img: triangleIcon(),
                imgSize: [15, 15],
              }),
            })
          );
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  function triangleIcon() {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");

    let width = 20; // Change the width as needed
    let height = 20; // Change the height as needed
    canvas.width = width;
    canvas.height = height;

    context.beginPath();
    context.moveTo(width / 2, 0);
    context.lineTo(width, height);
    context.lineTo(0, height);
    context.closePath();

    // Define the color of the triangle
    context.fillStyle = "rgb(63,72,204)"; // Change the color as needed

    // Fill the triangle with the defined color
    context.fill();
    return canvas;
  }

  useEffect(() => {
    if (map) {
      setLoading(true);
      fetch(`/api/counties/gis/boundaries`)
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("");
        })
        .then((data) => {
          if (data?.county?.length > 0) {
            let points = [];
            data.county.map((e) => {
              let prp = e;

              const x = JSON.parse(e.feature);

              delete prp.feature;

              let d = {
                type: "Feature",
                geometry: x,
                properties: prp,
              };
              points.push(d);
            });
            let geojsonData = {
              type: "FeatureCollection",
              features: points,
            };

            let geojsonSource = new VectorSource({
              features: new GeoJSON().readFeatures(geojsonData),
            });

            county.setSource(geojsonSource);
            county.setStyle(
              new Style({
                fill: new Fill({
                  color: "transparent",
                }),
                stroke: new Stroke({
                  color: "red",
                  width: 2,
                }),
              })
            );
            let extent = geojsonSource.getExtent();
            map?.getView().fit(extent, { padding: [100, 100, 100, 100] });
            setLoading(false);
          }
          if (data?.subcounty?.length > 0) {
            let points = [];
            data.subcounty.map((e) => {
              let prp = e;

              const x = JSON.parse(e.feature);

              delete prp.feature;

              let d = {
                type: "Feature",
                geometry: x,
                properties: prp,
              };
              points.push(d);
            });
            let geojsonData = {
              type: "FeatureCollection",
              features: points,
            };

            let geojsonSource = new VectorSource({
              features: new GeoJSON().readFeatures(geojsonData),
            });

            subcounty.setSource(geojsonSource);
            subcounty.setStyle(
              new Style({
                fill: new Fill({
                  color: "transparent",
                }),
                stroke: new Stroke({
                  color: "purple",
                  width: 2,
                }),
              })
            );
            let extent = geojsonSource.getExtent();
            map?.getView().fit(extent, { padding: [100, 100, 100, 100] });
            setLoading(false);
          }
          if (data?.wards?.length > 0) {
            let points = [];
            data.wards.map((e) => {
              let prp = e;

              const x = JSON.parse(e.feature);

              delete prp.feature;

              let d = {
                type: "Feature",
                geometry: x,
                properties: prp,
              };
              points.push(d);
            });
            let geojsonData = {
              type: "FeatureCollection",
              features: points,
            };

            let geojsonSource = new VectorSource({
              features: new GeoJSON().readFeatures(geojsonData),
            });

            ward.setSource(geojsonSource);
            ward.setStyle(
              new Style({
                fill: new Fill({
                  color: "transparent",
                }),
                stroke: new Stroke({
                  color: "blue",
                  width: 2,
                }),
              })
            );
            let extent = geojsonSource.getExtent();
            map?.getView().fit(extent, { padding: [100, 100, 100, 100] });
            setLoading(false);
          }
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }, [map]);

  useEffect(() => {
    if (data) {
      setVisualization(types[active]);
      setActiveVis(visualization[0]);
    }
  }, [data, active]);

  useEffect(() => {
    if (activeVis !== "Normal") {
      const x = [...new Set(data.map((item) => item[activeVis]))];
      let arr = [...uniquex, ...x];
      arr = arr.filter((item) => item !== active);
      uniquex = arr;
      setUnique(arr);
    } else {
      uniquex = ["Results", "TAs", "Activities"];
      setUnique(["Results", "TAs", "Activities"]);
    }
    switch (active) {
      case "ARF":
        arf.setStyle(visStyling);
        break;
      case "RMF":
        rmf.setStyle(visStyling);
        break;
      case "TAF":
        taf.setStyle(visStyling);
        break;
      default:
        break;
    }
  }, [activeVis]);

  function getColor() {
    let color = "#";
    let letters = "0123456789ABCDEF";
    // Split the color code into three parts (for each RGB component)
    for (let i = 0; i < 3; i++) {
      let part = "";
      for (let j = 0; j < 2; j++) {
        // Randomly choose a digit from the letters string
        let randomDigit = letters[Math.floor(Math.random() * letters.length)];
        part += randomDigit;
      }
      color += part;
    }
  }

  function visStyling(feature) {
    const index = uniquex
      .map((e) => {
        return e;
      })
      .indexOf(feature.values_[activeVis]);
    if (index !== -1) {
      return new Style({
        image: new CircleStyle({
          radius: 6,
          stroke: new Stroke({
            color: "red",
            width: 2,
          }),
          fill: new Fill({
            color: colors[colors.length <= index ? getColor() : colors[index]],
          }),
        }),
      });
    } else {
      return new Style({
        image: new CircleStyle({
          radius: 6,
          stroke: new Stroke({
            color: "red",
            width: 2,
          }),
          fill: new Fill({
            color: "gray",
          }),
        }),
      });
    }
  }

  function removeByTitle(title) {
    map
      .getLayers()
      .getArray()
      .filter((layer) => layer.get("title") === title)
      .forEach((layer) => map.removeLayer(layer));
  }

  function resetMap() {
    if (map) {
      map.getView().fit(county.getSource().getExtent());
    }
  }

  async function exportMap() {
    if (map === null || draw === null) return;
    const controls = map.getControls().getArray();
    let c = [];
    controls.forEach((control) => {
      if (
        control instanceof Zoom ||
        // control instanceof ScaleLine ||
        control instanceof ZoomToExtent
      ) {
        c.push(control);
        control.setMap(null);
      }
    });
    setControls(c);
    map.addInteraction(draw);
    draw.on("drawend", (event) => {
      setMapSize({ width: "1024px", height: "1024px" });
      const extent = event.feature.getGeometry().getExtent();
      console.log(extent);
      map.getView().fit(extent);
      setDownloading(true);
      drawlayer.setSource(new VectorSource());
      const sc = document.getElementsByClassName("ol-scale-line");
      setScale(sc[0]?.textContent);
      setTimeout(() => {
        setDownloading(false);
        html2canvas(mapElement.current).then(function (canvas) {
          const dataUrl = canvas.toDataURL("image/png");
          setDataUrl(dataUrl);
          map.removeInteraction(draw);
          localStorage.setItem("mapimage", dataUrl);
          localStorage.setItem("scale", sc[0]?.textContent);

          setMapSize({ width: "100%", height: "100%" });
          resetMap();
          setDataUrl(null);
          setMapExport(false);
          window.open("/gis/export", "target:_blank");
        });
      }, 3000);
    });
  }

  useEffect(() => {
    if (dataUrl === null) {
      controls.forEach((control) => {
        map.addControl(control);
      });
    }
  }, [dataUrl]);

  return (
    <div ref={mapRef} className="gis">
      <div className="container">
        <div className="top">
          <h3>MEL Map</h3>
          <div className="data"></div>
          <div className="filter">
            <button
              onClick={() => {
                setActiveF("Q1");
              }}
              className={activeF === "Q1" ? "active" : ""}
            >
              Q1
            </button>
            <button
              onClick={() => {
                setActiveF("Q2");
              }}
              className={activeF === "Q2" ? "active" : ""}
            >
              Q2
            </button>
            <button
              onClick={() => {
                setActiveF("Q3");
              }}
              className={activeF === "Q3" ? "active" : ""}
            >
              Q3
            </button>
            <button
              onClick={() => {
                setActiveF("Q4");
              }}
              className={activeF === "Q4" ? "active" : ""}
            >
              Q4
            </button>
            <button
              onClick={() => {
                setActiveF(year);
              }}
              className={activeF === year ? "active" : ""}
            >
              {year}
            </button>
            <button
              onClick={() => {
                setActiveF("All Time");
              }}
              className={activeF === "All Time" ? "active" : ""}
            >
              All Time
            </button>
            <Input
              handleChange={(e) => {
                setStart(e);
              }}
              type="date"
              value={start}
              label="Start Date"
            />
            <Input
              handleChange={(e) => {
                setEnd(e);
              }}
              type="date"
              value={end}
              label="End Date"
            />
          </div>
        </div>
        <hr />
        <div className="map">
          <div ref={exportmap}></div>

          <div className="map-element" style={mapSize} ref={mapElement}></div>
          {popup && <Popup setPopup={setPopup} data={popup} />}
          <div className="download">
            <div></div>
            <div>
              <a
                onClick={() => {
                  if (mapExport) {
                    setMapExport(false);
                    map.removeInteraction(draw);
                  } else {
                    setMapExport(true);
                    exportMap();
                  }
                }}
                role="button"
              >
                <FontAwesomeIcon icon={faDownload} /> Map
              </a>
            </div>
          </div>

          <div className="visualization">
            <Visualization
              data={visualization}
              active={activeVis}
              setActiveVis={setActiveVis}
            />
          </div>

          {loading && <RippleLoading />}
          {dowloading && <Loading />}

          <div
            onClick={() => {
              setBaseSelector(true);
            }}
            className="base_selector"
          >
            <i className="fa fa-map"></i>
          </div>

          {map && (
            <LegendItem
              map={map}
              setMapRefresh={setMapRefresh}
              mapRefresh={mapRefresh}
              unique={unique}
              activeVis={activeVis}
              colors={colors}
            />
          )}

          {baseSelector && (
            <Basemaps
              setBaseSelector={setBaseSelector}
              basemap={basemap}
              selected={selected}
              setSelected={setSelected}
            />
          )}
          <RightPanel
            map={map}
            data={data}
            setData={setData}
            setMapRefresh={setMapRefresh}
            mapRefresh={mapRefresh}
            setIsLoading={setIsLoading}
            setExtent={setExtent}
            setFilter={setFilter}
            filter={filter}
            resetMap={resetMap}
            showing={props.showing}
            removeByTitle={removeByTitle}
          />

          {dataUrl && (
            <MapTemplate
              dataUrl={dataUrl}
              setDataUrl={setDataUrl}
              unique={unique}
              activeVis={activeVis}
              colors={colors}
              scale={scale}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const LegendItem = (props) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems([]);

    const layers = props.map.getLayers();
    let list = [];
    layers.forEach(function (layer) {
      // Check if the layer has a title property
      if (layer.get("title")) {
        // Get the title of the layer
        const title = layer.get("title");
        if (
          title != "Basemap" &&
          title != "Grid" &&
          title != "Draw" &&
          layer.getVisible()
        ) {
          list.push(title);
        }
      }
    });
    setItems(list);
    localStorage.setItem("legend", JSON.stringify(list));
  }, [props.mapRefresh]);

  const Legend = (params) => {
    return (
      <div className="legnd">
        {params.img ? (
          <img src={params.img} />
        ) : (
          <div
            style={{
              borderRadius: params.shape === "circle" ? "16px" : "5px",
              backgroundColor: params.color,
              height: params.shape === "line" ? "5px" : "16px",
            }}
          ></div>
        )}
        <p>{params.txt}</p>
      </div>
    );
  };

  function getLayerColor(title) {
    switch (title) {
      case "Counties":
        return "red";
      case "Sub Counties":
        return "purple";
      case "Wards":
        return "blue";
      case "Beneficiaries":
        return "rgb(63,72,204)";
      case "Results":
        return props.colors[1];
      case "TAs":
        return props.colors[2];
      case "Activities":
        return props.colors[0];
      default:
        return "white";
    }
  }

  function getLayerShape(title) {
    switch (title) {
      case "Counties":
        return "line";
      case "Sub Counties":
        return "line";
      case "Wards":
        return "line";
      case "Beneficiaries":
        return "circle";
      case "Results":
        return "circle";
      case "TAs":
        return "circle";
      case "Activities":
        return "circle";
      default:
        return "white";
    }
  }

  return (
    <div className="legend">
      <h4>Legend</h4>
      <hr />
      <div className="list">
        {items.map((item, i) => {
          return (
            <Legend
              key={i}
              txt={item}
              shape={getLayerShape(item)}
              color={getLayerColor(item)}
            />
          );
        })}
      </div>
    </div>
  );
};

const Visualization = (props) => {
  return (
    <select
      onChange={(e) => {
        props.setActiveVis(e.target.value);
      }}
    >
      {props?.data &&
        props?.data?.length > 0 &&
        props.data.map((item, index) => {
          return (
            <option value={item} key={index}>
              {item}
            </option>
          );
        })}
    </select>
  );
};
