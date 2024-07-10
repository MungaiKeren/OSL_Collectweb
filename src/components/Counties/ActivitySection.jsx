import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";


const Item = (props) => {
    return (
      <div className="actbody"
      
      >
        <div className="date">
          <div className="d">
            <p className="day">{props.date}</p>
            <p className="month">Sep</p>
          </div>
        </div>

        <div className="left">
          <div>
            <p className="act-name">{props.name}</p>
            <p className="act-desc">{props.activityDescription}</p>
          </div>
        </div>

        <div className="right">
          <div className="badge"><p>{props.county}</p></div>
        </div>
      </div>
    );
};


export default function ActivitySection (props) {

  const [loading, setLoading] = useState();
  const [offset, setOffset] = useState(0);
  const [activity, setActivity] = useState();

  useEffect(() => {
    fetch(`/api/arf/paginated/${offset}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setLoading(false);
        setActivity(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [])

  return (
    <div className="sect-card">
      <div className="head">
        <div className="title">
          <h3>{props.title}</h3>
          <p className="sub-title">{props.subtitle}</p>
        </div>
        <div className="filter">
          <FontAwesomeIcon className="fa" icon={faFilter} />
          <p className="p">Search/Filter</p>
        </div>
      </div>
      <hr />

      <div className="sumitems">
        {activity?.data?.map((item) => {
          return (
            <Item
              date={2}
              name={`${item.ActivityType}: ${item.ActivityName}`}
              county={item.County}
              activityDescription={item.ActivityDescription}
            />
          );
        })}
      </div>
    </div>
  );
};
