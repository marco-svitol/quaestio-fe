import React, { useState } from "react";
import "./App.css";
import PageSelector from "./PageSelector";

function ReactGrid({ data, error }) {
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 12;
const totalPages = Math.ceil(data.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const currentData = data.slice(startIndex, startIndex + itemsPerPage);

const handlePageChange = (newPage) => {
setCurrentPage(newPage);
};

return (
<div className="results-table-grid-container">
<table className="main-table">
<thead className="header-cell">
<tr>
<th>Titolo</th>
<th>Numero</th>
<th>Autore</th>
<th>Data</th>
<th>LinkOPS</th>
</tr>
</thead>
<tbody>
{error ? (
<tr>
<td colSpan={5}>Error: {error}</td>
</tr>
) : (
currentData.map((item, index) => (
<tr className="table-cell" key={index}>
<td style={{wordWrap:"break-word"}} >{item.invention_title}</td>
<td style={{wordWrap:"break-word"}} >{item.doc_num}</td>
<td style={{wordWrap:"break-word"}} >{item.inventor_name}</td>
<td style={{wordWrap:"break-word"}} >{item.date}</td>
<td>
   <a style={{wordWrap:"break-word"}} href={item.ops_link} target="_blank" rel="noopener noreferrer">
     {item.ops_link}
   </a>
</td>
</tr>
))
)}
</tbody>
</table>
<div>
<PageSelector
       currentPage={currentPage}
       totalPages={totalPages}
       handlePageChange={handlePageChange}
       itemsPerPage={20}
     />
</div>
</div>
);
}

export default ReactGrid;