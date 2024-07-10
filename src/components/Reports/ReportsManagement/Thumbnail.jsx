import { useState } from "react";
import PreviewData from "../ReportsManagement/PreviewData";
import EditData from "./EditData";

export default function Thumbnail(props) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const showMore = () => {
    setShow(!show);
  };

  const deleteMap = () => {
    fetch(`/api/data/${props.item.ID}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        if (data.message) {
          window.location.href = "/portal/maps";
        }
      })
      .catch((e) => {});
  };

  return (
    <div
      onClick={() => {
        showMore();
      }}
      className="thumbnail"
    >
      <img
        src={"/api/uploads/" + props.item.Image?.replaceAll("\\", "/")}
        alt=""
      />

      <div className="desc">
        <h4>{props.item.Title}</h4>
        <p>{props.item.updatedAt.split("T")[0]}</p>
      </div>
      {show && (
        <div className="options">
          <p
            onClick={() => {
              setEditing(true);
            }}
          >
            Update
          </p>
          <p
            onClick={() => {
              setPreviewing(true);
            }}
          >
            Preview
          </p>
          <p
            onClick={() => {
              deleteMap();
            }}
          >
            Delete
          </p>
        </div>
      )}
      {editing && (
        <EditData close={setEditing} url={props.url} data={props.item} />
      )}
      {previewing && <PreviewData close={setPreviewing} data={props.item} />}
    </div>
  );
}
