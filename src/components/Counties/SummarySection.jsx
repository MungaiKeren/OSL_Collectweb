import React, { useEffect, useState } from "react";
import Input from "../Util/Input";

const Item = (props) => {
  const [sumData, setSumData] = useState();
  const [activity, setActivity] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    const today = new Date();
    props.setStart(`${today.getFullYear() - 1}-10-01`);
    props.setEnd(`${today.getFullYear()}-09-30`);
    if (props.start !== "" && props.end !== "") {
      setLoading(true);
      getData();
    }
  }, [props.refresh]);

  function getData() {
    fetch(
      `/api/components/summary/stats/${props.county}/${props.start}/${props.end}`
    )
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setLoading(false);
        setSumData(data);
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (props.start !== "" && props.end !== "") {
      getData();
    }
  }, [props.start, props.end]);

  return (
    <div
      onClick={() => {
        window.location.href = "/dataentry/rmf-list/" + props.county;
      }}
      className="sumbody"
    >
      <p className="number">{props.number}</p>
      <p>{props.county}</p>
      <p>{sumData ? sumData["TAF"] : 0}</p>
      <p>{sumData ? sumData["ARF"] : 0}</p>
      <p>{sumData ? sumData["RMF"] : 0}</p>
    </div>
  );
};

export default function SummarySection(props) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="sect-card">
      <div className="head">
        <div className="title">
          <h3>{props.title}</h3>
          <p className="sub-title">{props.subtitle}</p>
        </div>
        <div className="filters">
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

      <div className="sumitems">
        <div className="sumbody">
          <h4>No.</h4>
          <h4>County</h4>
          <h4>Technical Assistance Forms</h4>
          <h4>Activity Reqistration Forms</h4>
          <h4>Results Monitoring Forms</h4>
        </div>
        <Item
          number="1"
          county="Busia"
          start={start}
          end={end}
          setEnd={setEnd}
          setStart={setStart}
          refresh={refresh}
        />
        <Item
          number="2"
          county="Bungoma"
          start={start}
          end={end}
          setEnd={setEnd}
          setStart={setStart}
          refresh={refresh}
        />
        <Item
          number="3"
          county="Kakamega"
          start={start}
          end={end}
          setEnd={setEnd}
          setStart={setStart}
          refresh={refresh}
        />
        <Item
          number="4"
          county="Siaya"
          start={start}
          end={end}
          setEnd={setEnd}
          setStart={setStart}
          refresh={refresh}
        />
        <Item
          number="5"
          county="Kisumu"
          start={start}
          end={end}
          setEnd={setEnd}
          setStart={setStart}
          refresh={refresh}
        />
        <Item
          number="6"
          county="Homabay"
          start={start}
          end={end}
          setEnd={setEnd}
          setStart={setStart}
          refresh={refresh}
        />
        <Item
          number="7"
          county="Migori"
          start={start}
          end={end}
          setEnd={setEnd}
          setStart={setStart}
          refresh={refresh}
        />
        <Item
          number="8"
          county="Kisii"
          start={start}
          end={end}
          setEnd={setEnd}
          setStart={setStart}
          refresh={refresh}
        />
      </div>
    </div>
  );
}
