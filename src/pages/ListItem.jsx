
const ListItem = ({ item, isSelected, onClick }) => {
  return (
    <li
      onClick={() => onClick(item)}
      style={{
        cursor: "pointer",
        padding: "10px",
        backgroundColor: isSelected ? "#007bff" : "transparent",
        color: isSelected ? "#fff" : "#000",
        borderRadius: "5px",
        transition: "background-color 0.3s"
      }}
    >
      {item}
    </li>
  );
};

export default ListItem;
