
export default function WRBoxItem(props) {
  function withCommas(x) {
    return x?.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");;
  }
  return (
    <div className="wrm_itmbox">
      <h3>{props.component}</h3>
      <h4 className="stat">{withCommas(props.amount)}</h4>
      <h6>{props.desc}</h6>
    </div>
  );
}
