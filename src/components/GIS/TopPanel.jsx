import { useEffect, useState } from "react";

export default function TopPanel(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const dt = props?.map?.getAllLayers()[3]?.getSource()?.getFeatures();
    if (dt && dt.length > 0 && data.length === 0) {

      let d = [];

      dt?.map((item) => {
        d.push({
          value: item.values_.Name,
          coordinates: item.values_.geometry.flatCoordinates,
        });
      });
      d.sort((a, b) => a.value.localeCompare(b.value));
      setData(d);
    }
  }, [props?.map, props?.map?.getAllLayers()]);

  return (
    <div className="top_panel">
      <select
        onChange={(e) => {
          if (data.length > 0) {
            if (e.target.selectedIndex !== 0) {
              props.map
                .getView()
                .setCenter(data[e.target.selectedIndex - 1].coordinates);
              props.map.getView().setZoom(15);
            } else {
              props.map.getView().setZoom(10);
            }
          }
        }}
        name=""
        id=""
      >
        <option value="Select Market">Select Market</option>
        {data.length > 0 &&
          data.map((item, index) => {
            return (
              <option key={index} value={item.value}>
                {item.value}
              </option>
            );
          })}
      </select>
    </div>
  );
}

const Item = (props) => {
  return (
    <div className="item">
      <p
        onClick={() => {
          props.openPopup();
          props.setSelected(props.txt);
        }}
        className={props.txt === props.selected ? "active" : ""}
      >
        <i className={"fa " + props.icon}></i> {props.txt}
      </p>
    </div>
  );
};
