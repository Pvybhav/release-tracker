import moment from "moment";

function Header({ sprintDetails }) {
  return (
    <header className="flex items-center justify-between py-1">
      <div>
        <span className="text-lg font-bold">Sprint Name</span>&nbsp;-&nbsp;
        <span>{sprintDetails.sprintName}</span>
      </div>
      <div className="flex flex-col gap-1">
        <div>
          <span className="text-lg font-bold">Start date : </span>
          {sprintDetails.startDate
            ? moment(sprintDetails.startDate).format("MMMM Do YYYY")
            : "-"}
        </div>
        <div>
          <span className="text-lg font-bold">End date : </span>
          {sprintDetails.endDate
            ? moment(sprintDetails.endDate).format("MMMM Do YYYY")
            : "-"}
        </div>
      </div>
    </header>
  );
}

export default Header;
