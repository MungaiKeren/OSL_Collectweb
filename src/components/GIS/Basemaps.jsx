import XYZ from "ol/source/XYZ";
import { useEffect } from "react";
import osmPic from "../../assets/imgs/osm.png";
import sat from "../../assets/imgs/satellite.png";
import streetmap from "../../assets/imgs/street.png";
import topomap from "../../assets/imgs/topo.png";

export default function Basemaps(props) {
  const { myData } = require("../../assets/data/data.js");
  const images = [osmPic, topomap, streetmap, sat];
  const Basemap = (params) => {
    useEffect(() => {
      if (params.selected === params.index) {
        params.layer.setSource(
          new XYZ({
            url: params.url,
            crossOrigin: "anonymous",
          })
        );
      }
    }, [params.selected]);

    return (
      <div
        onClick={() => {
          params.setSelected(params.index);
        }}
        className={params.selected === params.index ? "active" : "item "}
      >
        <img src={params.image} alt="" />
        <p>{params.label}</p>
      </div>
    );
  };

  return (
    <div className="basemap_layers">
      <div className="cont">
        <i
          onClick={() => {
            props.setBaseSelector(null);
          }}
          className="fa fa-close"
        >
          &#xf00d;
        </i>
        <div className="basemaps">
          {myData.map((item, index) => {
            return (
              <Basemap
                key={index}
                index={index}
                label={item.name}
                image={images[index]}
                layer={props.basemap}
                setLayer={props.setBasemap}
                url={item.url}
                selected={props.selected}
                setSelected={props.setSelected}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
