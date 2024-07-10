import { useEffect, useRef } from "react";

export default function BoxItem(props) {
  const vl = useRef();
  const v2 = useRef();
  const v3 = useRef();

  useEffect(() => {
    animateValue(vl.current, 0, props.amount, 1000);
    props.current && animateValue(v2.current, 0, props.current, 1000);
    props.baseline && animateValue(v3.current, 0, props.baseline, 1000);
  }, [props.amount]);

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;

    // Check if the end value has decimals
    const hasDecimals = Number.isInteger(end) === false;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      let interpolatedValue;
      if (hasDecimals) {
        interpolatedValue = start + progress * (end - start);
      } else {
        interpolatedValue = Math.floor(start + progress * (end - start));
      }
      const formattedValue = parseFloat(interpolatedValue.toFixed(2));
      obj.innerHTML = `${props.unit} ${withCommas(formattedValue)} ${props.percent}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }

  function withCommas(x) {
    return x?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");;
  }

  return (
    <div className={props.active ? "section section-active": "section"}
      onClick={props.onClick}
    >
      <div className="single">
        {props.current ? <div className="values">
          <p>Baseline:  <span ref={v3}>{props.baseline}</span></p>
          <p>Current: <span ref={v2}>{props.current}</span></p>
        </div> : <div className="img">
          <img src={props.img} alt="" />
        </div>}
        <div>
          <h4 ref={vl}></h4>
          <p className="target">{props.description}</p>
        </div>
      </div>


    </div>
  );
}
