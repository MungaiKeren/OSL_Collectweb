const Activity = (props) => {

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });

        const formattedDay = day < 10 ? `0${day}` : day;

        return `${formattedDay} ${month}`;
    }

    return (
        <div
        className="activity active"
        onClick={() => {
            props.setActID(props?.item?.ID);
        }}
        >
        <p className="date">{formatDate(props?.item?.Date)}</p>
        <div className="desc">
            <p>
            {props?.item?.ActivityType}: {props?.item?.ActivityName}
            </p>
            <p>
            {props?.item?.ActivitySector} {props?.item?.ActivityDescription}
            </p>
        </div>
        <div className="badge">
            <p>{props?.item?.ActivityType}</p>
        </div>
        </div>
    );
};

export default Activity;