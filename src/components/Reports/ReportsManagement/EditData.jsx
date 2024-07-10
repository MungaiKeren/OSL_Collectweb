import { useEffect, useState } from "react";
import Input from "../../Util/Input";
import WaveLoading from "../../Util/WaveLoading";

export default function EditData(props) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [body, setBody] = useState(props.data);
  const [loading, setLoading] = useState(false);

  function isNumeric(str) {
    if (typeof str !== "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
  }

  useEffect(() => {
    const d = Object.entries(props.data);
    setData(d);
  }, [props.data]);

  function updateData() {
    let d = body;
    delete d.geom;
    const chck = Object.values(d);
    let rr = true;
    chck.map((item) => {
      if (item === "" || item === null) {
        rr = false;
        setError("All fields are required!");
      }
    });
    if (!rr) return;
    if (!isNumeric(d.Longitude)) return setError("Invalid Longitude!");
    if (!isNumeric(d.Latitude)) return setError("Invalid Latitude!");

    fetch(`/api/${props.url}/${props.data.ID}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(d),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else throw Error("");
      })
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setError(data.success);
          setTimeout(() => {
            window.location.href = `/portal/${props.url}`;
          }, 2000);
        } else {
          setError(data.error);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  }

  return (
    <div className="editdata">
      <div className="cont">
        <div className="dets">
          <h3>Update Data</h3>
          <i
            onClick={() => {
              props.close(null);
            }}
            className="fa fa-times"
          ></i>
        </div>
        <hr />
        <div className="div2equal">
          {data &&
            data.map((item, i) => {
              if (
                item[0] !== "ID" &&
                item[0] !== "UserID" &&
                item[0] !== "Image" &&
                item[0] !== "File" &&
                item[0] !== "createdAt" &&
                item[0] !== "updatedAt"
              ) {
                return (
                  <Input
                    body={body}
                    setBody={setBody}
                    key={i}
                    label={item[0]}
                    value={item[1]}
                  />
                );
              }
            })}
        </div>
        <br />
        <h6>{error}</h6>
        <br />
        <button
          onClick={() => {
            updateData();
          }}
        >
          Update
        </button>

        {loading && <WaveLoading />}
      </div>
    </div>
  );
}
