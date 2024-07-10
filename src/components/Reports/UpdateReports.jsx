import { useEffect, useRef, useState } from "react";
import "../../Styles/documents.scss";
import Input from "../components/Users/UsrInput";
import Select from "../components/Users/UsrSelect";
import Header2 from "../components/Util/Header2";
import Loading from "../components/Util/Loading";
import Navigation from "../components/Util/Navigation";

export default function UpdateReports(props) {
  const [isErr, setIsErr] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const types = ["Document", "Manual"];
  const rfTitle = useRef();
  const rfType = useRef();
  const rfDescription = useRef();
  const rfKeywords = useRef();
  const rfDate = useRef();
  const rfFile = useRef();
  const [body, updateBody] = useState({
    Title: null,
    Type: null,
    Description: null,
    Keywords: null,
    Date: null,
    File: null,
  });
  const [showing, setShowing] = useState(true);
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setShowing(false);
    } else {
      setShowing(true);
    }
  };

  useEffect(() => {
    handleResize();
  }, []);

  const validateForm = () => {
    let result = true;
    let d = body;
    d.Title = rfTitle.current.value;
    d.Type = rfType.current.value;
    d.Description = rfDescription.current.value;
    d.Keywords = rfKeywords.current.value;
    d.Date = rfDate.current.value;
    d.File = rfFile.current.files[0];

    updateBody(d);
    setIsErr("");

    if (!body.Title || !body.Type) {
      result = false;
      setIsErr("Title and Type Fields cannot be empty!");
      return result;
    }

    if (!body.Description || body.Description.length < 20) {
      result = false;
      setIsErr("Enter a sufficient description!");
      return result;
    }
    if (!body.File) {
      result = false;
      setIsErr("Upload a file to documents!");
      return result;
    }
    if (!body.Date) {
      result = false;
      setIsErr("Enter a valid date of the document!");
      return result;
    }

    return result;
  };

  const createDocument = (e) => {
    if (validateForm()) {
      setIsLoading(true);
      const formData = new FormData();

      for (const i in body) {
        formData.append(i, body[i]);
      }

      fetch("/api/documents/create", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else throw Error("");
        })
        .then((data) => {
          setIsLoading(false);
          if (data.success) {
            setIsErr(data.success);
            setTimeout(() => {
              window.location.href = "/portal/documents";
            }, 2000);
          } else {
            setIsErr(data.error);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          setIsErr("Oops! Something went wrong!");
        });
    }
  };

  return (
    <div className="wrapper">
      <Navigation
        showing={showing}
        setShowing={setShowing}
        active="Add a Document"
      />
      <div className="MainContent">
        <Header2
          showing={showing}
          setShowing={setShowing}
          active="Create Document"
        />
        <div className="documents">
          <div className="list">
            <h3>New Document</h3>
            <hr />
            <div className="new">
              <form
                autoComplete="none"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <span className="err">{isErr}</span>
                <div className="div2equal">
                  <Input ref={rfTitle} type="text" label="Title *" />
                  <Select ref={rfType} label="Select Type" data={types} />
                </div>

                <div className="usrinput">
                  <h4>Description *</h4>
                  <textarea
                    id="w3review"
                    name="w3review"
                    rows="10"
                    cols="80"
                    ref={rfDescription}
                    label="Description *"
                    type="textarea"
                  />
                </div>

                <div className="div2equal">
                  <Input ref={rfKeywords} type="text" label="Keywords *" />
                  <Input ref={rfDate} type="date" label="Date *" />
                </div>
                <div className="usrinput">
                  <h4>Document file *</h4>
                  <input
                    ref={rfFile}
                    type="file"
                    label="Upload file *"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    accept=".pdf"
                  />
                </div>

                <button
                  onClick={() => {
                    createDocument();
                  }}
                >
                  Submit
                </button>
              </form>
              {isLoading && <Loading />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
