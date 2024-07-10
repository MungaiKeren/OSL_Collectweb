import { faDownload, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import northArrow from "../../assets/imgs/north.png";
import bn from "../../assets/imgs/bn.png";
import "../../Styles/maptemplate.scss";

export default function MapTemplate(props) {
  const [title, setTitle] = useState("Map Title");
  const [dataUrl, setDataUrl] = useState(null);
  const [items, setItems] = useState([]);
  const [scale, setScale] = useState(1);
  const { colors } = require("../../assets/data/data.js");

  useEffect(() => {
    const data = localStorage.getItem("mapimage");
    if (data != null) setDataUrl(data);
    const sc = localStorage.getItem("scale");
    if (sc != null) {
      if (sc.split(" ")[1] === "m") setScale(sc.split(" ")[0]);
      else {
        setScale(sc.split(" ")[0] * 1000);
      }
    }
    const list = localStorage.getItem("legend");
    if (data != null) setItems(JSON.parse(list));
  }, []);

  function withCommas(x) {
    if (x === null) return 0;
    const p = x?.toString();
    if (p?.indexOf("$") !== -1 || p?.indexOf("%") !== -1) {
      return p?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      if (parseFloat(x) < 1) {
        let o = Math.round(parseFloat(x) * 10) / 10;
        return o?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        let o = Math.round(parseFloat(x));
        return o?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    }
  }

  const styles = StyleSheet.create({
    page: {
      padding: 24,
      backgroundColor: "#fff",
      display: "block",
    },
    header: {
      fontSize: "14px",
      padding: 8,
      fontWeight: "bold",
      textAlign: "center",
      display: "block",
    },
    border: {
      border: "1px solid #606060",
      display: "block",
    },
    imageborder: {
      display: "block",
      border: "1px solid #606060",
      boxSizing: "border-box",
      margin: "0 16px 16px 16px",
    },
    image: {
      display: "block",
      boxSizing: "border-box",
    },
    flex: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      flexDirection: "row",
    },
    grid: {
      display: "flex",
      gap: "16px",
      flexDirection: "row",
      margin: "0 16px 16px 16px",
    },
    grid2: {
      display: "flex",
      gap: "10px",
      flexDirection: "row",
    },
    column1: {
      display: "block",
      flex: 3,
      padding: 8,
      border: "1px solid #606060",
    },
    column2: {
      display: "block",
      flex: 1,
      padding: 8,
      border: "1px solid #606060",
    },
    text: {
      fontSize: "11px",
      padding: 4,
      color: "gray",
    },
    header2: {
      fontSize: "12px",
      fontWeight: "bold",
      display: "block",
      marginBottom: "10px",
    },
  });

  const Legend = (params) => {
    return (
      <View style={styles.grid2}>
        <View
          style={{
            borderRadius: params.shape === "circle" ? "12px" : "3px",
            backgroundColor: params.color,
            height: params.shape === "line" ? "5px" : "12px",
            width: "12px",
            display: "block",
            margin: "auto",
          }}
        ></View>
        <Text style={styles.text}>{params.txt}</Text>
      </View>
    );
  };

  function getLayerColor(title) {
    switch (title) {
      case "Counties":
        return "red";
      case "Sub Counties":
        return "purple";
      case "Wards":
        return "blue";
      case "Beneficiaries":
        return "rgb(63,72,204)";
      case "Results":
        return colors[1];
      case "TAs":
        return colors[2];
      case "Activities":
        return colors[0];
      default:
        return "white";
    }
  }

  function getLayerShape(title) {
    switch (title) {
      case "Counties":
        return "line";
      case "Sub Counties":
        return "line";
      case "Wards":
        return "line";
      case "Beneficiaries":
        return "circle";
      case "Results":
        return "circle";
      case "TAs":
        return "circle";
      case "Activities":
        return "circle";
      default:
        return "white";
    }
  }

  const MyDocument = () => {
    return (
      <PDFViewer showToolbar={false} className="viewer">
        <Document>
          <Page size="A4" orientation="potrait" style={styles.page}>
            <View style={styles.border}>
              <Text style={styles.header}>Map of Beneficiaries</Text>
              <View style={styles.imageborder}>
                <Image style={styles.image} source={dataUrl} />
              </View>
              <View style={styles.grid}>
                <View style={styles.column1}>
                  <Text style={styles.header2}>Legend</Text>
                  <View style={styles.flex}>
                    {items.map((item, i) => {
                      return (
                        <Legend
                          key={i}
                          txt={item}
                          shape={getLayerShape(item)}
                          color={getLayerColor(item)}
                        />
                      );
                    })}
                  </View>
                </View>
                <View style={styles.column2}>
                  <Text style={styles.header2}>Scale</Text>
                  <Text style={styles.text}>1:{withCommas(scale)}</Text>
                </View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    );
  };

  return (
    <div className="exportmap">
      <MyDocument />
    </div>
  );
}
