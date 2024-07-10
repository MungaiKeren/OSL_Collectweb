import {
  faDatabase,
  faEdit,
  faLink,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "../../Styles/toolbuilder.scss";
import active from "../../assets/imgs/active.png";
import inactive from "../../assets/imgs/inactive.png";
import Loading from "../Util/Loading";
import Pagination from "../Util/Pagination";

export default function ToolBuilder(props) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/toolslist/paginated/${offset * 12}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setLoading(false);
        setData(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [refresh, offset]);

  function quickSearch(v) {
    setLoading(true);
    fetch(`/api/toolslist/quicksearch/ToolName/${v}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setLoading(false);
        setData(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  return (
    <div className="toolbuilder">
      <div className="title">
        <p
          onClick={() => {
            localStorage.removeItem("tsediting");
            window.location.href = "/buildtool/new";
          }}
          className="add"
        >
          <i className="fa fa-plus"></i> Create Tool
        </p>

        <div className="search">
          <input
            onChange={(e) => {
              const value = e.target.value;
              if (value.length > 2) {
                quickSearch(value);
              }
              if (value.length === 0) {
                setRefresh(!refresh);
              }
            }}
            type="text"
            name=""
            id=""
          />
          <FontAwesomeIcon icon={faSearch} className="fa-search" />
        </div>
      </div>

      <div className="new">
        <div className="topbar">
          <h4>Data Collection Tools</h4>
          <p></p>
        </div>
        <div className="list">
          {data &&
            data?.data?.length > 0 &&
            data?.data?.map((item, i) => {
              return <Item key={i} item={item} index={i + offset * 12} />;
            })}
        </div>
        <Pagination
          totalItems={data?.total}
          currentPage={offset}
          onPageChange={(e) => {
            setOffset(e);
          }}
        />
        <br />
      </div>
      {loading && <Loading />}
    </div>
  );
}

const Item = (props) => {
  const date = new Date(props.item.createdAt).toLocaleString("en-US");

  return (
    <div className="item">
      {props.item.Status === "Active" ? (
        <img className="fa" src={active} alt="" />
      ) : (
        <img className="fa" src={inactive} alt="" />
      )}
      <div className="ttitem">
        <h6>{props.index + 1}</h6>
        <div>
          <h4>{props.item.ToolName}</h4>
          <p>{props.item.Description}</p>
        </div>
        <div>
          <h5>Data table Name: {props.item.DataTableName}</h5>
          <h5>County: {props.item.County}</h5>
        </div>
        <h5 className="dt">{date}</h5>
        <div></div>
      </div>{" "}
      <FontAwesomeIcon
        onClick={() => {
          window.location.href = "/buildtool/data/" + props.item.DataTableName;
        }}
        className="ic-data"
        icon={faDatabase}
        title="Save"
      />
      <FontAwesomeIcon
        onClick={() => {
          window.location.href = "/buildtool/update/" + props.item.ID;
        }}
        className="ic-edit"
        icon={faEdit}
        title="Edit"
      />
      <FontAwesomeIcon
        onClick={() => {
          window.open(
            `/wkwp/questionnaire/${props.item.DataTableName}`,
            "_blank"
          );
        }}
        className="ic-link"
        icon={faLink}
        title="View"
      />
    </div>
  );
};
