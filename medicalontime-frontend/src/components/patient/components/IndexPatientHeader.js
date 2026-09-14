import React from "react";

class IndexPatientHeader extends React.Component {
  render() {
    return (
      <div
        className="headerP"
        style={{
          width: "15%",
          marginTop: "60px",
          color: "white",
          background: "#39ca74",
          textAlign: "center",
          borderRadius: "10px 10px 5px 5px",
          borderBottom: "none",
          border: "1px solid #39ca74",
          padding: "10px",
          marginLeft: "-4px"
        }}
      >
        <h2>My Information</h2>
      </div>
    );
  }
}

export default IndexPatientHeader;
