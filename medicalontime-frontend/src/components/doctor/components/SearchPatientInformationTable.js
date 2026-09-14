import React from "react";

/** Presentational only. The search form above owns the data. */
export default function SearchPatientInformationTable({ patients, loading, error, searched }) {
  return (
    <table className="table3">
      <caption
        style={{
          marginLeft: "34px",
          padding: "10px",
          fontWeight: "bold",
          fontSize: "30px"
        }}
        className="asd"
      >
        Patient Information
      </caption>
      <thead>
        <tr>
          <th>PatientID</th>
          <th>Name</th>
          <th>Address</th>
          <th>Contact Number</th>
          <th>Email</th>
          <th>BloodGroup</th>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td colSpan="6">Loading…</td>
          </tr>
        )}
        {error && (
          <tr>
            <td colSpan="6" style={{ color: "#c0392b" }}>
              {error}
            </td>
          </tr>
        )}
        {!loading && !error && searched && patients.length === 0 && (
          <tr>
            <td colSpan="6">No patient matched that search.</td>
          </tr>
        )}
        {patients.map((patient) => (
          <tr key={patient.id}>
            <td> {patient.id}</td>
            <td> {patient.name}</td>
            <td> {patient.address}</td>
            <td> {patient.contactNumber}</td>
            <td> {patient.email}</td>
            <td> {patient.bloodType}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
