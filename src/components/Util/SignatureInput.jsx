import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { forwardRef, useEffect, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const SignatureInput = forwardRef((props, ref) => {
  const signatureRef = ref || React.createRef();
  const [signatureData, setSignatureData] = useState(null);

  const clearSignature = () => {
    signatureRef.current.clear();
    setSignatureData(null);
  };

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64Data = reader.result;
        resolve(base64Data);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  useEffect(() => {
    if (props.value != undefined) {
      fetch(`/api/uploads/${props.value}`)
        .then((res) => {
          if (res.ok) return res.blob();
          else throw Error("");
        })
        .then(async (data) => {
          const imgData = await blobToBase64(data);
          console.log(imgData);
          setSignatureData(imgData);
          signatureRef.current.fromDataURL(imgData);
        })
        .catch((e) => {});
    }
  }, [props?.value]);

  return (
    <div className="signature_pad">
      <label htmlFor="">{props.label}</label>
      <SignatureCanvas
        ref={signatureRef}
        penColor={props.readOnly == true ? "rgba(0,0,0,0)" : "#0039a6"}
        velocityFilterWeight={0.1}
        canvasProps={{
          className: "signature-canvas",
        }}
      />
      {props.readOnly != true && (
        <FontAwesomeIcon
          className="clear"
          icon={faTrash}
          onClick={clearSignature}
        />
      )}
    </div>
  );
});

export default SignatureInput;
