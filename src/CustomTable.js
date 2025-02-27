import React, { cloneElement, useMemo, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useTable, useBlockLayout, useFlexLayout, useResizeColumns } from "react-table";
import { Sparklines, SparklinesLine } from 'react-sparklines';

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
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  #vis-container {
    height: 100%;
    max-height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    font-family: "Inter", sans-serif;
    font-weight: 400;
  }
  #vis {
    min-height: 500px;
  }
  body {
    font-family: "Inter", sans-serif !important;
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
    display: flex;
    align-items: center;
    min-height: 40px;
  }

  .td {
    display: flex;
    align-items: center;
  }

  ${(props) => props.columnBordersCSS}
  ${(props) => props.rowBordersCSS}
  ${(props) => props.generalCSS}
`;

const TableTitle = styled.h2`
  font-family: "Inter", sans-serif;
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

const PercentageBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
`;

const PercentageBar = styled.div`
  width: 100px;
  height: 12px;
  background-color: ${props => props.backgroundColor};
  border-radius: 6px;
  overflow: hidden;
`;

const PercentageFill = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background-color: ${props => props.barColor};
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
        // Remove sorting options
      },
      // Remove useSortBy,
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
                  <th {...column.getHeaderProps()} className={`th ${column.headerClassName || ''}`}>
                    {column.render("Header")}
                    {/* Remove sort indicator */}
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
                  {row.cells.map((cell,i) => {
                   
                    const cellProps = cell.getCellProps();
                    const customProps = cell.column?.getCellProps ? cell.column?.getCellProps(cell) : null;
                  
                    if (customProps ) {
                      const mergedStyles = { ...cellProps.style, ...customProps.style };
                      cellProps.style = mergedStyles;
                      return (
                        <td {...cellProps}  className="td">
                          {cell.render("Cell")}
                        </td>
                      );
                    } else 
                    return (
                      <td {...cellProps} className="td">
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
    getCellProps: (cellInfo) => {
      const row = cellInfo.row.original;
      let style = {};
      measureKeys.forEach((measureKey) => {
        const conditionalKey = `conditional_styles_${measureKey}`;
        const isThisMeasureConditional = config[conditionalKey] === key;
        if (isThisMeasureConditional) {
          const conditionalValue = row[measureKey]?.value;
          if (['Yes', 'true', '1'].includes(conditionalValue)) {
            const conditionalHighlightStyle = parseCSSString(config.conditionalHighlightStyle);
            style = { ...style, ...conditionalHighlightStyle };
          }
        }
      });
      return { style };
    },
    Cell: ({ cell }) => {
      const row = cell.row.original;     
      return row[key]?.html ? (
            <span dangerouslySetInnerHTML={{ __html: row[key].html }} />
          ) : (
            row[key]?.rendered || row[key]?.value
          )
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

const getMonthData = (data, dimensionKeys) => {
  const serviceKey = dimensionKeys[0];
  const dateKey = dimensionKeys[1];
  const revenueKey = Object.keys(data[0]).find(key => !dimensionKeys.includes(key));

  // Group by service and date
  const groupedData = data.reduce((acc, row) => {
    const service = row[serviceKey].value;
    const date = row[dateKey].value;
    const revenue = row[revenueKey].value || 0;

    if (!acc[service]) {
      acc[service] = {};
    }
    acc[service][date] = revenue;
    return acc;
  }, {});

  return { groupedData, revenueKey };
};

const getLatestMonth = (dates) => {
  return dates.sort((a, b) => new Date(b) - new Date(a))[0];
};

const getLast12Months = (data, service, dates, latestMonth) => {
  const sortedDates = dates.sort((a, b) => new Date(b) - new Date(a));
  const last12Dates = sortedDates.slice(0, 12).reverse();
  return last12Dates.map(date => data[service]?.[date] || 0);
};

const processUniqueServices = (data, dimensionKeys, groupedData, latestMonth) => {
  const serviceKey = dimensionKeys[0];
  // Get unique services and their latest revenue
  const servicesWithRevenue = [...new Set(data.map(row => row[serviceKey].value))]
    .map(service => ({
      service,
      revenue: groupedData[service]?.[latestMonth] || 0
    }));
  
  // Sort by revenue descending
  servicesWithRevenue.sort((a, b) => b.revenue - a.revenue);
  
  // Create one row per service, maintaining the sorted order
  return servicesWithRevenue.map(({ service }) => ({
    [serviceKey]: { value: service }
  }));
};

const getTrend = (data) => {
  if (data.length < 2) return 'up';
  const last = data[data.length - 1];
  const secondLast = data[data.length - 2];
  return last >= secondLast ? 'up' : 'down';
};

export const CustomTable = ({ data, config, queryResponse, details, done }) => {
  const dimensionKeys = queryResponse.fields.dimension_like ? queryResponse.fields.dimension_like.map((dim) => dim.name) : [];
  
  const { groupedData, revenueKey } = useMemo(() => 
    getMonthData(data, dimensionKeys), 
    [data, dimensionKeys]
  );

  const allDates = useMemo(() => {
    return [...new Set(data.map(row => row[dimensionKeys[1]].value))];
  }, [data, dimensionKeys]);

  const latestMonth = useMemo(() => getLatestMonth(allDates), [allDates]);

  // Move processedData after groupedData and latestMonth are calculated
  const processedData = useMemo(() => 
    processUniqueServices(data, dimensionKeys, groupedData, latestMonth),
    [data, dimensionKeys, groupedData, latestMonth]
  );

  const currentMonthTotal = useMemo(() => {
    return Object.values(groupedData).reduce((sum, serviceData) => {
      return sum + (serviceData[latestMonth] || 0);
    }, 0);
  }, [groupedData, latestMonth]);

  const highestPercentage = useMemo(() => {
    const firstService = processedData[0]?.[dimensionKeys[0]]?.value;
    if (!firstService) return 0;
    const highestRevenue = groupedData[firstService]?.[latestMonth] || 0;
    return (highestRevenue / currentMonthTotal) * 100;
  }, [processedData, dimensionKeys, groupedData, latestMonth, currentMonthTotal]);

  const columns = useMemo(
    () => [
      {
        Header: 'Service',
        accessor: row => row[dimensionKeys[0]].value,
        width: 200,
      },
      {
        Header: 'Current Month Revenue',
        accessor: row => row[dimensionKeys[0]].value,
        Cell: ({ value }) => {
          const revenue = groupedData[value]?.[latestMonth] || 0;
          return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(revenue);
        },
        width: 200,
      },
      {
        Header: 'Growth',
        accessor: row => row[dimensionKeys[0]].value,
        Cell: ({ value }) => {
          const sparklineData = getLast12Months(groupedData, value, allDates, latestMonth);
          const trend = getTrend(sparklineData);
          const sparklineColor = trend === 'up' 
            ? (config.upSparklineColor || '#34D058')
            : (config.downSparklineColor || '#FF4B4B');
          
          return (
            <Sparklines data={sparklineData} width={100} height={20}>
              <SparklinesLine color={sparklineColor} />
            </Sparklines>
          );
        },
        width: 150,
      },
      {
        Header: '% of Total',
        accessor: row => row[dimensionKeys[0]].value,
        Cell: ({ value }) => {
          const revenue = groupedData[value]?.[latestMonth] || 0;
          const percentage = (revenue / currentMonthTotal) * 100;
          const scaledWidth = (percentage / highestPercentage) * 100;
          
          return (
            <PercentageBarContainer>
              <span>{`${percentage.toFixed(1)}%`}</span>
              <PercentageBar backgroundColor={config.chartBackgroundColor || '#eee'}>
                <PercentageFill 
                  width={scaledWidth}
                  barColor={config.chartBarColor || '#4A90E2'} // Use config color or default to blue
                />
              </PercentageBar>
            </PercentageBarContainer>
          );
        },
        width: 200,
      }
    ],
    [groupedData, latestMonth, currentMonthTotal, dimensionKeys, allDates, processedData, highestPercentage, config.chartBarColor, config.chartBackgroundColor, config.upSparklineColor, config.downSparklineColor]
  );

  console.log("columns", columns)

  return (
    <Styles config={config} rowCount={processedData.length}>
      {config.chartTitle && <TableTitle>{config.chartTitle}</TableTitle>}
      <Table
        config={config}
        columns={columns}
        data={processedData}
      />
    </Styles>
  );
  done();
}
