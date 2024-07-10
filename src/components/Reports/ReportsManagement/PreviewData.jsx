import { useEffect, useState } from "react";

export default function PreviewData(props) {
  const [cols, setCols] = useState(null);
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (props.data) {
      const cols = Object.keys(props.data);
      let d = [];
      cols.forEach((item) => {
        if (item.toLowerCase() !== "geom") {
          d.push(item);
        }
      });
      setCols(d);
    }
  }, [props.data]);

  function getPublication(url) {
    fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.blob();
        } else throw Error("");
      })
      .then((blob) => {
        let file = window.URL.createObjectURL(blob);
        window.open(file, "_blank");
      })
      .catch((e) => { });
  }

  return (
    <div className="editdata">
      <div className="cont">
        <div className="dets">
          <h3>Item Details</h3>
          <i
            onClick={() => {
              props.close(null);
            }}
            className="fa fa-times"
          ></i>
        </div>
        <hr />
        <div className="content">
          {cols &&
            cols.map((item, i) => {
              if (
                item !== "ID" &&
                item !== "UserID" &&
                item !== "File" &&
                item !== "Image"
              ) {
                return (
                  <p key={i}>
                    <b>{item}</b> {props.data[item]}
                  </p>
                );
              } else if (item === "File") {
                return (
                  <h4
                    onClick={() => {
                      getPublication("/api/uploads/" + props.item.File);
                    }}
                  ><i className="fa fa-pdf"></i>
                    Open Document
                  </h4>
                );
              } else if (item === "Image") {
                return (
                  <h4
                    onClick={() => {
                      setSrc(`/api/uploads/${props.data.Image}`);
                    }}
                  > <i className="fa fa-image"></i>
                    View Image
                  </h4>
                );
              }
            })}
        </div>
      </div>
      {src && <ImageModal src={src} setSrc={setSrc} />}
    </div>
  );
}
const ImageModal = (props) => {
  return (
    <div
      style={{ display: props.src ? "block" : "none" }}
      className="image_modal"
    >
      <span
        onClick={() => {
          props.setSrc(null);
        }}
        className="close"
      >
        &times;
      </span>
      <img src={props.src} className="modal-content"></img>
    </div>
  );
};
