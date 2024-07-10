import {
  faAngleDoubleDown,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleDoubleUp,
  faArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VectorLayer from "ol/layer/Vector";
import { useEffect, useRef, useState } from "react";
import Query from "./Query";

export default function RightPanel(props) {
  const [collapsed, setCollapsed] = useState(true);
  const [active, setActive] = useState("Layers");

  return (
    <div className="map_panel">
      <div className={"outer"}>
        {collapsed ? (
          <FontAwesomeIcon
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            icon={faAngleDoubleLeft}
            className="fa "
          />
        ) : (
          <FontAwesomeIcon
            className="fa right"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            icon={faAngleDoubleRight}
          />
        )}
        {!collapsed && (
          <div className="collapsible">
            <div className="bar">
              <Item txt="Layers" active={active} setActive={setActive} />
              <Item txt="Filter" active={active} setActive={setActive} />
            </div>
            {active === "Layers" && (
              <Layers
                setMapRefresh={props.setMapRefresh}
                mapRefresh={props.mapRefresh}
                map={props.map}
              />
            )}
            {active === "Filter" && (
              <Query
                map={props.map}
                data={props.data}
                setData={props.setData}
                setIsLoading={props.setIsLoading}
                setActive={setActive}
                setExtent={props.setExtent}
                setFilter={props.setFilter}
                filter={props.filter}
                resetMap={props.resetMap}
                removeByTitle={props.removeByTitle}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const Item = (props) => {
  return (
    <p
      onClick={() => {
        props.setActive(props.txt);
      }}
      className={props.txt === props.active ? "active" : ""}
    >
      {props.txt}
    </p>
  );
};

const Layers = (props) => {
  const [layrs, setLayrs] = useState([]);

  useEffect(() => {
    if (props?.map?.getAllLayers()?.length !== layrs.length) {
      let d = [];
      props.map?.getAllLayers().map((item, i) => {
        d.push({
          title: item.get("title"),
          index: i,
          checked: item.getVisible(),
        });
      });
      d = d.filter((item) => item.title !== "Draw");
      setLayrs(d);
    }
  }, [props.map]);

  function togglelayer(index, oldIndex) {
    if (props.map) {
      let d = array_move(props.map.getAllLayers(), index, oldIndex);
      setLayrs([]);

      props.map.getAllLayers().map((layer) => {
        props.map.removeLayer(layer);
      });
      d.map((layer) => {
        props.map.addLayer(layer);
      });
    }
  }

  function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      let k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }

  const Layer = (params) => {
    const [isChecked, setIsChecked] = useState(false);
    const rf = useRef();

    useEffect(() => {
      const layer = props.map.getAllLayers()[params.item.index];
      if (layer) {
        rf.current.checked = layer.getVisible();
      }
    }, [isChecked, params.item.index]);

    const handleCheckboxChange = (e) => {
      const checked = e.target.checked;

      const layer = props.map.getAllLayers()[params.item.index];
      if (layer) {
        layer.setVisible(checked);
        setIsChecked(checked);
      }
      props.setMapRefresh(checked);
    };

    return (
      <>
        <div className="item">
          <input
            ref={rf}
            type="checkbox"
            onChange={handleCheckboxChange}
          />
          <p>{params.item.title}</p>
          <FontAwesomeIcon
            onClick={() => {
              try {
                params?.map?.getAllLayers().map((layer) => {
                  if (layer instanceof VectorLayer) {
                    if (layer.get("title") === params.item.title) {
                      const d = layer?.getSource()?.getExtent();
                      if (d !== undefined) {
                        params.map
                          .getView()
                          .fit(d, { padding: [100, 100, 100, 100] });
                      } else {
                      }
                    }
                  }
                });
              } catch (error) {}
            }}
            className="fas extent"
            icon={faArrowsAlt}
          />
          <FontAwesomeIcon
            className="fas"
            onClick={() => {
              if (params.item.index !== 0) {
                params.togglelayer(params.item.index, params.item.index - 1);
              }
            }}
            icon={faAngleDoubleUp}
          />
          <FontAwesomeIcon
            className="fas"
            onClick={() => {
              if (params.item.index + 1 < params?.map?.getAllLayers()?.length) {
                params.togglelayer(params.item.index, params.item.index + 1);
              }
            }}
            icon={faAngleDoubleDown}
          />
        </div>
      </>
    );
  };

  return (
    <div className="r_layers">
      <h4>Map Layers</h4>
      <hr />
      {layrs.length > 0 &&
        layrs.map((item) => {
          return (
            <Layer
              key={item.index}
              togglelayer={togglelayer}
              item={item}
              map={props.map}
            />
          );
        })}
    </div>
  );
};
