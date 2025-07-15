import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { jwtDecode } from "jwt-decode";
import "../../Styles/components.scss";
import Input from "../Util/Input";
import Pagination from "../Util/Pagination";
import Select from "../Util/Select";
import WaveLoading from "../Util/WaveLoading";

export default function Components(props) {
  const [data, setData] = useState(null);
  const [head, setHead] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [isloading, setIsLoading] = useState(false);
  const [showing, setShowing] = useState(null);
  const [toggleAddMember, setToggleAddMember] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const component = useRef();
  const county = useRef();
  const query = useRef();

  const token = localStorage.getItem("gdfhgfhtkn");
  let decoded = jwtDecode(token);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/rmf`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
     
        setIsLoading(false);
        if (data?.length > 0) {
          const cols = Object.keys(data[0]);
          let d = [];
          cols.forEach((item) => {
            if (
              item.toLowerCase() !== "nationalid" &&
              item.toLowerCase() !== "createdat" &&
              item.toLowerCase() !== "updatedat" &&
              item.toLowerCase() !== "id"
            ) {
              d.push(item);
            }
          });
          if (isMobile) {
            setCount(2);
          } else {
            let c = d.length > 5 ? 5 : d.length;
            setCount(c);
          }
          setHead(d);
          setData(data);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }, [currentPage, refresh]);

  return (
    <div className="components">
      <div className="list">
        <div className="dtitle">
          <h3>{props.title}</h3>
          <div className="search">
            {showSearch && (
              <div className="inputs">
                <Select
                  ref={component}
                  value={"Component"}
                
                  data={[
                    "Urban",
                    "Rural",
                    "Water Resource",
                  ]}
                />
                <Select
                  ref={county}
                  value={"County"}
              
                  data={[
                    "Bungoma",
                    "Busia",
                    "Kakamega",
                  ]}
                />
                <Input
                  type="text"
                  placeholder="Search"
             
                  ref={query}
                />
              </div>
            )}
            <FontAwesomeIcon icon={faSearch} className="filter"
              onClick={() => {
                value ? setRefresh(!refresh) : setShowSearch(!showSearch);
              }}
            />
          </div>
        </div>
        <hr />
        <div
          style={{
            gridTemplateColumns: `4em repeat(${head ? count : 0},1fr)`,
          }}
          className="head"
        >
          <h4>No.</h4>
          {head &&
            head.length > 0 &&
            head.map((item, i) => {
              if (i < count) {
                return <h4 key={i}>{item}</h4>;
              }
            })}
        </div>
        {data &&
          data?.length > 0 &&
          data?.map((item, i) => {
            return (
              <Item
                setShowing={setShowing}
                key={i}
                index={i}
                data={item}
                head={head}
                count={count}
                page={currentPage}
              />
            );
          })}

        <div className="btns">
          {/* {props.title.includes("Members") && (
            <i
              className="fa fa-plus newMember"
              title="Add new member"
              onClick={() => {
                setToggleAddMember(!toggleAddMember);
                setShowing(null);
              }}
            ></i>
          )} */}

          {data?.total && (
            <Pagination
              totalItems={data?.total}
              onPageChange={(v) => {
                setCurrentPage(v);
              }}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>
      {isloading && <WaveLoading />}
    </div>
  );
};

const Item = (props) => {
  const cl = props.index % 2 === 0 ? "white" : "#60606010";

  return (
    <div
      style={{
        gridTemplateColumns: `4em repeat(${props.head ? props.count : 0}, 1fr)`,
        backgroundColor: cl,
      }}
      className="row"
      onClick={() => {
        props.setShowing(props.index);
      }}
    >
      <p>{(props.page - 1) * 12 + props.index + 1}</p>
      {props.head.map((item, i) => {
        if (i < props.count) { /*Capitalize each word*/
          return <p key={i}>{props.data[item]?.replace(/\b\w/g, match => match.toUpperCase())}</p>;
        }
      })}
    </div>
  );
};