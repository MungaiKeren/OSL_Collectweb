import { faAdd, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import Input from "../Util/Input";
import Select from "../Util/Select";

export default function Query(props) {
  const tables = ["RMFs", "ARFs", "TAFs"];
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState("RMFs");
  const [cols, setCols] = useState([]);
  const [filters, setFilters] = useState([]);
  const col = useRef();
  const op = useRef();
  const vl = useRef();

  useEffect(() => {
    fetch(`/api/myreports/tablecolumns/${selected}/public`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        const tts = data.map((obj) => obj.column_name);
        setCols(tts);
      })
      .catch(() => {});
  }, [selected]);

  function addFilter() {
    const cl = col.current.value;
    const o = op.current.value;
    const v = vl.current.value;
    if (cl !== "" && o !== "" && v !== "") {
      let d = {
        column: cl,
        operator: o,
        value: v,
      };
      setFilters([...filters, d]);
    }
  }

  useEffect(() => {}, [filters]);

  return (
    <div className="query">
      <div>
        <h4>Filters</h4>
        <hr />
        <Select
          setChanged={(e) => {
            setSelected(e);
          }}
          label="Select Table"
          data={tables}
          value={selected}
        />
      </div>
      <div className="list">
        {filters.map((item, i) => {
          return (
            <Item
              key={i}
              index={i}
              item={item}
              setFilters={setFilters}
              filters={filters}
            />
          );
        })}
      </div>
      <hr />
      <div className="add">
        <Select ref={col} label="Column" data={cols} />
        <Select
          ref={op}
          label="Operator"
          data={["=", ">", ">=", "<", "<=", "ILIKE"]}
        />
        <Input ref={vl} label="Value" />
        <FontAwesomeIcon
          onClick={() => {
            addFilter();
          }}
          className="btn"
          icon={faAdd}
        />
      </div>
      <hr />
      <div className="run">
        <button
          onClick={() => {
            props.setFilter(filters);
          }}
        >
          Run Query
        </button>
        <h6
          onClick={() => {
            props.setFilter([]);
          }}
        >
          Clear Filters
        </h6>
      </div>
    </div>
  );
}

const Item = (props) => {
  function removeItem() {
    const newArray = [...props.filters];
    newArray.splice(props.index, 1);
    props.setFilters(newArray);
  }
  return (
    <div className="item">
      <p>{props.item.column}</p>
      <p>{props.item.operator}</p>
      <p>{props.item.value}</p>
      <FontAwesomeIcon
        onClick={() => {
          removeItem();
        }}
        icon={faTimes}
        className="fas"
      />
    </div>
  );
};
