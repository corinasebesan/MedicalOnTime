import React from "react";

/** Presentational only. The search form above owns the data. */
export default function SearchPatientTreatmentHistoryTable({ descriptions, loading, error, searched }) {
  return (
    <table className="table2">
      <caption
        style={{
          marginLeft: "34px",
          padding: "10px",
          fontWeight: "bold",
          fontSize: "30px"
        }}
        className="asd"
      >
        Treatment History
      </caption>
      <thead>
        <tr>
          <th>PatientName</th>
          <th>Treatment</th>
          <th>Doctor's Note</th>
          <th>Written by (doctor id)</th>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td colSpan="4">Loading…</td>
          </tr>
        )}
        {error && (
          <tr>
            <td colSpan="4" style={{ color: "#c0392b" }}>
              {error}
            </td>
          </tr>
        )}
        {!loading && !error && searched && descriptions.length === 0 && (
          <tr>
            <td colSpan="4">No treatment notes for that patient.</td>
          </tr>
        )}
        {descriptions.map((description) => (
          <tr key={description.id}>
            <td> {description.patientName}</td>
            <td> {description.treatment}</td>
            <td> {description.note}</td>
            <td> {description.idDoctor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
