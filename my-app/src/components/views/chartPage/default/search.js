import React from "react";

function Search({ onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event.target.elements.filter.value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", justifyContent: "flex-end" }}>
      <input
        name="filter"
        style={{
          padding: "8px",
          borderRadius: "5px 0 0 5px",
          border: "2px solid #e9e91d",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          outline: "none",
          width: "200px",
        }}
      />
      <button
        style={{
          backgroundColor: "#e9e91d",
          color: "black",
          padding: "8px 16px",
          borderRadius: "0 5px 5px 0",
          border: "2px solid #e9e91d",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          cursor: "pointer",
          outline: "none",
          marginRight: "30px",
        }}
      >
        Search
      </button>
    </form>
  );
}

export default Search;
