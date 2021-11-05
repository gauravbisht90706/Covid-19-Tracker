import React from 'react'
import numeral from 'numeral';

function Table({countries}) {
    return (
        <div className = "tableContainer">
        <div className="table">
            {countries.map(({ country, cases, i }) => (
                <tr key = {i}>
                    <td>{country}</td>
                    <td><strong>{numeral(cases).format("0,0")}</strong></td>
                </tr>
                
            ))}
            
        </div></div>
    )
}

export default Table;
