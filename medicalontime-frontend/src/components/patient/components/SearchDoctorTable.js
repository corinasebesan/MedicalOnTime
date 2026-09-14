import React from "react";

/**
 * Presentational only. It holds no state and fetches nothing, so the search
 * form above it owns the results and this just draws them.
 */
export default function SearchDoctorTable({ doctors, loading, error, searched }) {
  return (
    <table className="table2">
      <thead>
        <tr>
          <th>Doctor ID</th>
          <th>Doctor Name</th>
          <th>Address</th>
          <th>Contact Number</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {loading && (
          <tr>
            <td colSpan="5">Loading…</td>
          </tr>
        )}
        {error && (
          <tr>
            <td colSpan="5" style={{ color: "#c0392b" }}>
              {error}
            </td>
          </tr>
        )}
        {!loading && !error && searched && doctors.length === 0 && (
          <tr>
            <td colSpan="5">No doctor matched that search.</td>
          </tr>
        )}
        {doctors.map((doctor) => (
          <tr key={doctor.id}>
            <td> {doctor.id}</td>
            <td> {doctor.doctorName}</td>
            <td> {doctor.address}</td>
            <td> {doctor.contactNumber}</td>
            <td> {doctor.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
