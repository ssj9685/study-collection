export default function Input() {
  return (
    <input
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "calc(100% - 40px)",
        height: "50px",
        padding: "0px 16px",
        marginLeft: "20px",
        borderRadius: "8px",
        background: "rgb(242, 244, 245)",
        transition: "width 0.25s ease 0s",
      }}
      placeholder="검색"
    />
  );
}
