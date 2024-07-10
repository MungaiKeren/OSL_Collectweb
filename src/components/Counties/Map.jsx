import Map from "ol/Map";
import View from "ol/View";
import {
  ScaleLine,
  ZoomToExtent,
  defaults as defaultControls,
} from "ol/control";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";
import React, { useEffect, useRef, useState } from "react";


export default function CountyMap() {
    const [map, setMap] = useState(null);
    const [popup, setPopup] = useState(null);
    const [basemap, setBasemap] = useState(new TileLayer({ title: "Basemap" }));

    const { myData } = require("../../assets/data/data.js");

    const mapElement = useRef();

    useEffect(( )=> {
        basemap.setSource(
          new XYZ({
            url: myData[0].url,
            crossOrigin: "anonymous",
          })
        );

        const initialMap = new Map({
          target: mapElement.current,
          layers: [basemap],
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

        initialMap.forEachFeatureAtPixel((e) => {});

        initialMap.on("click", function(ev) {
            initialMap.forEachFeatureAtPixel(ev.pixel, function (feature) {
                setPopup(feature.values_);
                return true
            });
        });

        setMap(initialMap);
    },[])

    return (
      <div
        className="map-element"
        style={{
          height: "90%",
          width: "100%",
        }}
        ref={mapElement}
      ></div>
    );
}
