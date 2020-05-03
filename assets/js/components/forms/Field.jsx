import React from "react";

const Field = ({
  name,
  label,
  value,
  onChange,
  placeholder ="",
  type = "text",
  error = "",
}) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input
      type="text"
      className={"form-control" + (error && " is-invalid")}
      type={type}
      id={name}
      name={name}
      placeholder={placeholder || label}
      value={value}
      onChange={onChange}
    />
    {error && <p className="invalid-feedback">{error}</p>}
  </div>
);

export default Field;
