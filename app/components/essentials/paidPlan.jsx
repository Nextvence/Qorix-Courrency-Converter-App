export default function paidPlan(status) {
    return (
       <div style={{ display: "inline-flex", alignItems: "center" }}>
  <span
    style={{
      position: status ? "absolute" : "static",
      top: status ? "1px" : "auto",
      left: status ? "-1px" : "auto",
      backgroundColor: "#f0f1a1",
      fontSize: "13px",
      width: "23px",
      height: "23px",
      display: status ? "flex" : "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      lineHeight: 1,
      boxSizing: "border-box",
      verticalAlign: "middle",
    }}
  >
    <span style={{ transform: "translateY(-1px)" }}>
      &#128081;
    </span>
  </span>
</div>
    )
}
