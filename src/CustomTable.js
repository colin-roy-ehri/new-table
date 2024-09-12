import React, { cloneElement, useMemo, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useTable, useBlockLayout, useFlexLayout, useResizeColumns, useSortBy } from "react-table";

import "bootstrap/dist/css/bootstrap.min.css";


// Function to generate CSS for column borders
const generateColumnBordersCSS = (columnBorders) => {
  if (!columnBorders) return "";

  const columns = columnBorders.split(",").map(Number);
  return columns.map(col => `
      thead th:nth-child(${col}),
      tbody td:nth-child(${col}) {
        border-right: 3px solid #ddd; /* Adjust the border style and color as needed */
      }
    `).join("\n");
};


// Function to generate CSS for row borders
const generateRowBordersCSS = (rowBorders, rowCount) => {
  if (!rowBorders) return "";

  const rows = rowBorders.split(",").map(Number);
  return rows.map(row => {
    const actualRow = row < 0 ? rowCount + row + 1 : row;
    return `
      tbody tr:nth-child(${actualRow}) {
        border-bottom: 3px solid #ddd; /* Adjust the border style and color as needed */
      }
    `;
  }).join("\n");
};



// Move the styled component definition outside of the Styles component
const StyledWrapper = styled.div`
  @import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;300;500;600;700&family=Open+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Roboto:wght@100;500;700&display=swap");
  @import url("https://kit-pro.fontawesome.com/releases/v5.15.1/css/pro.min.css");

  #vis-container {
    height: 100%;
    max-height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    font-family: "IBM Plex Sans";
    font-weight: 300;
  }
  #vis {
    min-height: 500px;
  }
  body {
    font-family: "IBM Plex Sans" !important;
  }
  .measure-header {
    text-align: center;
    pointer-events: none;
    cursor: default;
  }
  thead > tr > th {
    ${(props) => props.headerStyles}
    display: flex;
  }
  #vis > div > div > table > thead > tr > th:nth-child(1),
  #vis > div > div > table > thead > tr > th {
    ${(props) => props.headerStyles}
    display: flex;
  }
  .table > thead {
    ${(props) => props.headerStyles}
  }
  tbody > tr > td {
    ${(props) => props.rowStyles}
    vertical-align: middle;
  }

  ${(props) => props.columnBordersCSS}
  ${(props) => props.rowBordersCSS}
  ${(props) => props.generalCSS}
`;

const Styles = ({ children, config, rowCount }) => {
  const { headerStyles, rowStyles, generalCSS, borderBetweenColumns, borderBetweenRows } = config;

  const columnBordersCSS = useMemo(() => generateColumnBordersCSS(borderBetweenColumns), [borderBetweenColumns]);
  const rowBordersCSS = useMemo(() => generateRowBordersCSS(borderBetweenRows, rowCount), [borderBetweenRows, rowCount]);

  return (
    <StyledWrapper
      headerStyles={headerStyles}
      rowStyles={rowStyles}
      generalCSS={generalCSS}
      columnBordersCSS={columnBordersCSS}
      rowBordersCSS={rowBordersCSS}
    >
      {children}
    </StyledWrapper>
  );
};


function Table({ columns, data, config }) {

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 40,
      width: 200,
      maxWidth: 400,
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, resetResizing } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
        disableSortRemove: true,
        defaultCanSort: true,
      },
      useSortBy,
      useFlexLayout,
      useResizeColumns
    );




  return (
    <>
      <div>



        <table {...getTableProps()}
          className={`table ${config.tableBordered ? 'bordered' : config.unsetTable ? 'unsetTable' : config.fixedHeight ? 'fixedHeight' : ''}`}>

          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="tr">
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className={`th ${column.headerClassName || ''}`}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? "⇅" : " "}
                    </span>
                    <div
                      {...column.getResizerProps()}
                      className={`resizer ${column.isResizing ? "isResizing" : ""}`}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="tr">
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className="td">
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

const keyHeaderMapFunction = (key, config, measureKeys) => {
  const configKey = `rename_${key}`;
  const headerName = config[configKey] || key;


  return {
    Header: headerName,
    accessor: (d) => d[key]?.value,
    sortable: true,
    sortType: "basic",
    Cell: ({ cell }) => {
      const row = cell.row.original;
      let style = {}
      measureKeys.forEach((otherMeasureKey) => {
        if (otherMeasureKey === key) return;
        const conditionalKey = `conditional_styles_${otherMeasureKey}`;
        const isThisMeasureConditional = config[conditionalKey] === key;
        if (isThisMeasureConditional) {
          const conditionalValue = row[otherMeasureKey]?.value;
          console.log("conditionalValue", conditionalValue)
          if (['Yes', 'true', '1'].includes(conditionalValue)) {
            const conditionalHighlightStyle = parseCSSString(config.conditionalHighlightStyle);
            style = { ...style, ...conditionalHighlightStyle };
            console.log("applied style", style)
          }
        }
      });
      return (
        <div style={style}>
          {row[key]?.html ? (
        <span dangerouslySetInnerHTML={{ __html: row[key].html }} />
      ) : (
        row[key]?.rendered || row[key]?.value
      )}</div>);
    },
  };
}

  // Function to parse CSS string into an object
  const parseCSSString = (cssString) => {
    return cssString.split(';').reduce((acc, style) => {
      if (style.trim()) {
        const [key, value] = style.split(':');
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});
  };

export const CustomTable = ({ data, config, queryResponse, details, done }) => {

  const [firstData = {}] = data;
  const dimensionKeys = queryResponse.fields.dimension_like ? queryResponse.fields.dimension_like.map((dim) => dim.name) : [];
  const measureKeys = queryResponse.fields.measure_like ? queryResponse.fields.measure_like.map((measure) => measure.name) : [];
  const pivotKeys = queryResponse.pivots ? queryResponse.pivots.map((pivot) => pivot.key) : [];
  const validFieldKeys = [...dimensionKeys, ...measureKeys]
  // Filter out the keys that have are conditional configuration indicator booleans
  .filter((key) => {
    const conditionalKey = `conditional_styles_${key}`;
    const isAConditionalKey = config[conditionalKey] && config[conditionalKey] != 'none' && config[conditionalKey] != '' 
    return !isAConditionalKey;
  })
  console.log(data)
  console.log("Object.keys(firstData)", Object.keys(firstData));

  const columns = useMemo(
    () =>
    // begin handling the pivot use case, which is contained in queryResponse.pivots
    // If there are pivots, teh accessors for fields in measures need a pivot after the vield name. 
    // And we need to make a column for each pivot/measure combination. 
    // The pivots should each have multiple columns (one for each measure) 
    {
      if (pivotKeys.length > 0) {
        const dimensionHeaders = dimensionKeys.map((key) => {
          return keyHeaderMapFunction(key, config, measureKeys)
        })
        if (config.groupByMeasure) {
          // Group pivot values by measure
          // filtering out the ones with a conditionalKey
          const pivotColumnHeaders = measureKeys.filter((measureKey) => {
            const conditionalKey = `conditional_styles_${measureKey}`;
            const conditionalColumn = config[conditionalKey];
            const hasConditionalStyle = conditionalColumn && conditionalColumn !== 'none';
            return !hasConditionalStyle;
          }).map((measureKey) => {
            const measure = queryResponse.fields.measure_like.find(
              (measure) => measure.name === measureKey
            );

            const measureLabel = config[`rename_${measureKey}`] || measure.label;
            const subColumns = pivotKeys.map((pivotKey) => {
              const isTotal = pivotKey === "$$$_row_total_$$$";
              const pivotValue = pivotKeys.length > 1 ? pivotKey : "";
              const accessor = (d) => d[measureKey]?.[pivotValue]?.value;
              const pivotName = config[`rename_${pivotKey}`] || pivotKey;
              const header = isTotal ? 'Total' : `${pivotName}`;
              const id = `${measureKey}_${pivotKey}`; // Ensure unique ID

              return {
                Header: header,
                accessor,
                id,
                sortable: true,
                sortType: "basic",
                Cell: ({ cell }) => {
                  const row = cell.row.original;
                  const cellValue = row[measureKey]?.[pivotValue]?.rendered ?? row[measureKey]?.[pivotValue]?.value;
                  let style = {};
                  measureKeys.forEach((otherMeasureKey) => {
                    if (otherMeasureKey === measureKey) return;
                    const conditionalKey = `conditional_styles_${otherMeasureKey}`;
                    const isThisMeasureConditional = config[conditionalKey] === measureKey;
                    if (isThisMeasureConditional) {
                      const conditionalValue = row[otherMeasureKey]?.[pivotValue]?.value;
                      console.log("conditionalValue", conditionalValue)
                      if (['Yes', 'true', '1'].includes(conditionalValue)) {
                        const conditionalHighlightStyle = parseCSSString(config.conditionalHighlightStyle);
                        style = { ...style, ...conditionalHighlightStyle };
                        console.log("applied style", style)
                      }
                    }
                  });
                  return (
                    <div style={style}>
                      {row[measureKey]?.[pivotValue]?.html ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: row[measureKey][pivotValue].html,
                          }}
                        />
                      ) : (cellValue)}
                    </div>
                  )
                },
              };
            });

            return {
              Header: measureLabel,
              columns: subColumns,
              sortable: false,
              headerClassName: "measure-header",
              className: "measure-header",
            };
          });

          return [...dimensionHeaders, ...pivotColumnHeaders];
        } else {
          // Flat structure without grouping
          //  apply similar filter logic here
          const pivotColumnHeaders = pivotKeys
          .map((pivotKey) => {
            return measureKeys.filter((measureKey) => {
              const conditionalKey = `conditional_styles_${measureKey}`;
              const conditionalColumn = config[conditionalKey];
              const hasConditionalStyle = conditionalColumn && conditionalColumn !== 'none';
              console.log('conditionalKey', conditionalKey, 'conditionalColumn', conditionalColumn, 'hasConditionalStyle', hasConditionalStyle)
              return !hasConditionalStyle;
            }).map((measureKey) => {
              const measure = queryResponse.fields.measure_like.find(
                (measure) => measure.name === measureKey
              );
              const measureLabel = config[`rename_${measureKey}`] || measure.label;
              const pivotValue = pivotKeys.length > 1 ? pivotKey : "";
              const pivotName = config[`rename_${pivotKey}`] || pivotKey;

              const accessor = (d) => d[measureKey]?.[pivotValue]?.value;
              const header = `${measureLabel} (${pivotName})`;
              const id = `${measureKey}_${pivotKey}`; // Ensure unique ID

              
              return {
                Header: header,
                accessor,
                id,
                sortable: true,
                sortType: "basic",
                Cell: ({ cell }) => {
                  const row = cell.row.original;

                  const cellValue = row[measureKey]?.[pivotValue]?.rendered ?? row[measureKey]?.[pivotValue]?.value;
                  // Apply conditional highlight style if the condition is met
                  let style = {};
                  measureKeys.forEach((otherMeasureKey) => {
                    if (otherMeasureKey === measureKey) return;
                    const conditionalKey = `conditional_styles_${otherMeasureKey}`;
                    const isThisMeasureConditional = config[conditionalKey] === measureKey;
                    if (isThisMeasureConditional) {
                      const conditionalValue = row[otherMeasureKey]?.[pivotValue]?.value;
                      console.log("conditionalValue", conditionalValue)
                      if (['Yes', 'true', '1'].includes(conditionalValue)) {
                        const conditionalHighlightStyle = parseCSSString(config.conditionalHighlightStyle);
                        style = { ...style, ...conditionalHighlightStyle };
                        console.log("applied style", style)
                      }
                    }
                  });

                  return (
                    <div style={style}>
                      {row[measureKey]?.[pivotValue]?.html ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: row[measureKey][pivotValue].html,
                          }}
                        />
                      ) : (cellValue)}
                    </div>);
                },
              };
            });
          });
          return [...dimensionHeaders, ...pivotColumnHeaders.flat()];
        }
      } else {
        return validFieldKeys.map((key) => {
          return keyHeaderMapFunction(key, config, measureKeys)
        })
      }
    },
    [firstData, config]
  );

  console.log("columns", columns)

  return (
    <Styles config={config} rowCount={data.length}>

      <Table
        config={config}
        columns={columns}
        data={data}

      />


    </Styles>
  );

}
