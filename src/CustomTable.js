import React, { cloneElement, useMemo, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useTable, useBlockLayout, useResizeColumns, useSortBy } from "react-table";
import { columnSize } from "@looker/components/DataTable/Column/columnSize";

import "bootstrap/dist/css/bootstrap.min.css";
import { Sparklines, SparklinesLine,  SparklinesCurve, SparklinesReferenceLine, SparklinesNormalBand, SparklinesSpots, SparklinesBars  } from "react-sparklines";
import Pagination from "@mui/material/Pagination";
import {  ProgressBar } from 'react-bootstrap';



const Styles = ({children, config}) => {
var {thColor,thFontSize, tableBordered, fixedHeight, unsetTable } = config;

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

#spark1 svg,
#spark2 svg {
  overflow: visible;
  width:100%;
  max-width: 200px;
}

#spark1 circle{
  fill: transparent !important;
}

#spark2 circle{
stroke-width: 3px !important;
}

#spark1 svg path {
stroke-width: 2px !important;
}
#spark2 svg polyline {


  }

.redGradient{
  fill: rgb(199, 32, 10) !important;
}


body {
  font-family: "IBM Plex Sans" !important;
}
thead th {
  font-size: 12px !important;
  color:  ${thColor};
  font-weight: 300;
  font-family: "IBM Plex Sans";
  text-align: left;
}
tbody > tr > td {
  vertical-align: middle;
}



.table tbody > tr > td,
.table tbody > tr > th,
.table tfoot > tr > td,
.table tfoot > tr > th,
.table thead > tr > td,
.table thead > tr > th {
  border: none;
}

table img {
  width: 33px !important;
}

.moveRight {
  margin: 0em 0em 0em 0.5em !important;
  font-family: "IBM Plex Sans";
}

.d-flex{
  display: flex;
}
.align-items-center{
  align-items:center
}

.flex-column{
  flex-direction:column
}


.img-fluid {
  max-width: 100%;
  height: auto;
}

h3 {
  color: #1d1e20 !important;
  font-size: 13px !important;
  margin-bottom: 0 !important;
  color: #1d1e20 !important;
  font-weight: 400 !important;
  font-family: "IBM Plex Sans";
  margin-top: 0 !important;
  min-width:2rem
}
.var h3 {
  width: 2em;
}

p.small {
  color: #72777e !important;
  font-weight: 300 !important;
  font-size: 11px !important;
  font-family: "IBM Plex Sans";
}

p {
  margin: 0rem !important;
}

p.black {
  color: black !important;
}

span.type {

  font-size: 12px;
  border-radius: 0.25rem;
  padding: 0.25em 0.55em;
}

span.type.positive {
  background: #eef8e8;
  color: #39800b;
}

span.type.positive i {
  transform: rotate(45deg);
}
span.type.negative {
  background: #fbe7e5;
  color: #c7200a;
}

span.type.negative i {
  transform: rotate(135deg);
}

li.tag {
  font-size: 11px;
  padding: 0.25em 1.55em;
  border-radius: 1rem;
  color: #1d1e20;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
}

li.tag:first-child {

}

.neutral {
  background: #e8edf3;
  max-width: 5em;
}

.branded {
  background: #ccccff;
  max-width: 5em;
}

.critical {
  background: #fdb6b0;
  max-width: 5em;
}

.warning {
  background: #ffd87f;
  position: relative;
  padding: 0.25em 0.75em 0.25em 1.55em !important;
}
.warning::before {
  font-family: "Font Awesome 5 Pro";
  position: absolute;
  content: "\f06a";
  display: inline-block;
  left: 5px;
  top: 4px;
}

.success {
  background: #d1ecc0;
  max-width: 5em;
}
.informational {
  background: #b6dff7;
  position: relative;
  padding: 0.25em 0.75em 0.25em 1.55em !important;
}

.informational::before {
  font-family: "Font Awesome 5 Pro";
  position: absolute;
  content: "\f05a";
  display: inline-block;
  left: 5px;
  top: 4px;
}


#sentimentInfo,
#tagInfo{
  padding-left: 1em;
}

.neg{
  color:#C7200A;
  font-size:12px;
  position: relative;
}


.neg::before{
  font-family: "Font Awesome 5 Pro";
  position: absolute;
  content: "\f119";
  display: inline-block;
  left: -15px;
  top:2px
}

.pos{
  color:#008759;
  font-size:12px;
  position:relative;
}

.pos::before{
  font-family: "Font Awesome 5 Pro";
  position: absolute;
  content: "\f118";
  display: inline-block;
  left: -15px;
  top:2px
}

.neut{
  color:#FF9E00;
  font-size:12px;
  position:relative;
}


.neut::before{
  font-family: "Font Awesome 5 Pro";
  position: absolute;
  content: "\f11a";
  display: inline-block;
  left: -15px;
  top:2px
}

p.sentiment {
  font-size: 12px;
}
.mr-2{
  margin-right:.55rem
}

.pr-1{
  padding-right:.25rem

}

.progress {
  --bs-progress-height: 24px !important;
    --bs-progress-font-size: 0.1rem !important;
    --bs-progress-bg: transparent;
    --bs-progress-border-radius: 2px !important;
    --bs-progress-bar-color: #fff;
    --bs-progress-bar-bg: #6253DA !important;
     max-width: 180px !important;
}


.skinny .progress  {
  --bs-progress-height: 8px !important;
    --bs-progress-font-size: 0.1rem !important;
    --bs-progress-bg: #E5E5E5 !important;
    --bs-progress-border-radius: 100px !important;


     width:200px !important
}

.skinny  .progress-bar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    color: blue;
    text-align: center;
    white-space: nowrap;


}




.progress-label {

  color: #000000;
  font-size: 10px;

  font-weight: 300;
}

.positiveBlock {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #39800B;
  font-size: 14px;
  font-weight: 600;
  padding-left: 1em;
}

.positiveBlock:before {
  position: absolute;
  content: "";
  width: 5em;
  left: 0;
  z-index: 1;

  background-color: rgba(209, 236, 192, .5);
  height: 100%;

  min-height: 4em;


}

.negativeBlock:before {
  position: absolute;
  content: "";
  width: 5em;
  left: 0;
  z-index: 1;

  background-color: rgba(253, 182, 176, .5);
  height: 100%;

  min-height: 4em;

}

.negativeBlock {
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  color: #C7200A;
  font-size: 14px;
  font-weight: 600;
  padding-left: 1em;
}

.positiveBlock p,
.negativeBlock p {
  position: relative;
  z-index: 2;
}

#tagInfo ul{

  margin: 0;
  display: flex;
  justify-content: flex-start;
  margin-left: -3.5em;
  flex-wrap: wrap;
}

#tagInfo li {
  list-style:none;
  margin-bottom:.2rem;
  margin-right:.2rem
}

td div {
  position: relative;
}

.react-bootstrap-table table {
  table-layout: unset !important;
}

.avatar {
  width: 40px !important;
  height: 40px !important;
  border-radius: 50%;

  object-fit: cover;
  object-position: center right;
}



tr {
  border-bottom: 1px solid #d0d9e1;
}

td {
  display: flex !important;

  align-items: center;


}

.fixedHeight{
  height: 300px;
  overflow-y: scroll;
}

.bordered td{
   border-right: 1px solid #d0d9e1 !important;
}

.bordered td:first-child{
    border-left: 1px solid #d0d9e1 !important;
}


.bordered .positiveBlock:before,
.bordered .negativeBlock:before{
  width: 200px;
  left: -10px;
}

.unsetTable td{
  width:auto !important;
  min-width:300px !important
}
.unsetTable tr,
.unsetTable th{
    width: auto !important;
      min-width:300px !important
}
thead {
  position: sticky;
  top: 0;
  z-index: 100;

}



.table {
  font-family: "IBM Plex Sans";
  display: inline-block;
  border-spacing: 0;

  .th {
    font-size: 12px;
    text-transform: capitalize;
    font-family: "IBM Plex Sans";

    text-align: left;
    border-right: 1px solid white;
    font-weight: 200;
  }
  .td {
    font-size: 12px;
    text-align: left;
    font-family: "IBM Plex Sans";
  }

  .th,
  .td {
    margin: 0;
    padding: 0.5rem;
    font-family: "IBM Plex Sans";
    position: relative;
  }


  .td:last-child {
    border-right: 0;
  }

  .resizer {
    display: inline-block;
    width: 10px;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(50%);
    z-index: 1;

    touch-action:none;

    &.isResizing {
    }
  }
}

`;

return (
  <StyledWrapper>
    {children}
  </StyledWrapper>
  )
}

function Table({ columns, data, config }) {


  var {tableBordered, fixedHeight, unsetTable } = config;

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
      useBlockLayout,
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
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className="th">
                    {column.render("Header")}
                    <span>
                      {/* {column.isSorted ? (column.isSortedDesc ? "↓"  : "↑"  ) : " "}  */}
                      {column.isSorted ? "⇅" : " "}
                    </span>
                    {/* Use column.getResizerProps to hook up the events correctly */}
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
const createLabel = (label) => {
  const splitByDot = label.split(".").join(" ");
  const splitByDash = splitByDot.split("_").join(" ");
  return splitByDash;
};


// const PaginationComponent = () => {
//
//   const [page, setMyPage] = useState([]);
//   const setPage = () => {
//     setMyPage();
//   };
//   return (
//     <Pagination numOfLinks={6} page={page} setPage={setPage} total={100} />
//   );
// }



export const CustomTable = ({ data, config, queryResponse, details, done }) => {

  // const [tableData, setTableData] = useState([]);
  //
  //  useEffect(() => {
  //
  //      setTableData(data);
  //
  //
  //  }, []);
  //


  const [firstData = {}] = data;

  let cols_to_hide = [];
  for (const [key, value] of Object.entries(firstData)) {

    if (key.split(".")[1] === "columns_to_hide") {
      cols_to_hide = firstData[key].value.split(",").map((e) => e.trim());
      break;
    }
  }


  cols_to_hide.map((col) => {
    delete firstData[col];
  });

  const data2 = useMemo(() => data, [] )

  console.log(data)
  console.log("Object.keys(firstData)", Object.keys(firstData));

  const columns = useMemo(
    () =>
      Object.keys(firstData)
       .filter((key) =>
       key.indexOf("logo_text") === -1
       && key.indexOf("property_floor") === -1
       && key.indexOf("units_occupied_yoy_delta") === -1
       && key.indexOf("sentiment_date") === -1
       && key.indexOf("avatar_name") === -1
       && key.indexOf("watch_count") === -1
       // && key !== "average_reference_line"
     )
        .map( (key ) => {

        // const [tableKeyword, slicedKey] = key.split(".");
          var slicedKey = []
          var tableKeyword =[]
          if (key !== "progress_bar"){

           var [tableKeyword, slicedKey] = key.split(".");
          }

          if (key === "progress_bar"){

           var slicedKey = key;

          }



          const dimension = config.query_fields.dimensions.find(
            (dimension) => dimension.name === key
          );


        console.log(key)
        console.log(slicedKey)
          return {

            Header:



              slicedKey === key ? key : dimension?.field_group_variant ||

              // dimension?.field_group_variant ||
              config.query_fields.measures.find((dimension) => dimension.name === key)
                ?.field_group_variant ||
              slicedKey,

              accessor: (d) => {
              return d[key].value;

            },

            sortable: true,

            sortType: "basic",
            // Cell: (  { row: { original } }) => {
            //   return original[key]?.rendered || original[key]?.value;
            // },


            Cell: ({ cell, value, row }) => {
              // const row = cell.row.original;


              if (slicedKey === "logo_url") {
                return (
                  <>
                    <div class="d-flex align-items-center" id="logoText">
                    <img src={row.original[key]?.rendered || row.original[key]?.value} alt="" class="img-fluid"/>
                      <p class="moveRight">
                      {row.original[tableKeyword + ".logo_text"]?.rendered ||
                        row.original[tableKeyword + ".logo_text"]?.value}
                      </p>
                    </div>
                  </>
                );
              }

              if (slicedKey === "property_name") {
                return (
                  <>
                  <div class="d-flex flex-column" id="propertyInfo">
                      <h3>{row.original[key]?.rendered || row.original[key]?.value}</h3>
                      <p class="small">
                      {row.original[tableKeyword + ".property_floor"]?.rendered ||
                       row.original[tableKeyword + ".property_floor"]?.value}
                      </p>
                  </div>

                  </>
                );
              }

              if (slicedKey === "units_occupied") {
                return (
                  <>

                  <div class="var d-flex justify-content-start align-items-center" id="unitVariance">
                    <h3>{row.original[key]?.rendered || row.original[key]?.value}</h3>
                    <span className={row.original[tableKeyword + ".units_occupied_yoy_delta"]?.value < 0 ? "type negative" : "type positive"}>
                    <i class="fal fa-arrow-up mr-2"></i>
                    {row.original[tableKeyword + ".units_occupied_yoy_delta"]?.rendered ||
                    row.original[tableKeyword + ".units_occupied_yoy_delta"]?.value}</span>
                  </div>

                  </>
                );
              }

              if (slicedKey === "sentiment") {
                return (
                  <>

                  <div class="d-flex flex-column" id="sentimentInfo">
                    <p className={row.original[key]?.value === "Positive" ? "pos" : row.original[key]?.value === "Negative" ? "neg" :  'neut'}>
                    {row.original[key]?.rendered || row.original[key]?.value}</p>
                    <p class="small mr-2">
                    {row.original[tableKeyword + ".sentiment_date"]?.rendered ||
                    row.original[tableKeyword + ".sentiment_date"]?.value}</p>
                  </div>

                  </>
                );
              }

              if (slicedKey === "key_count") {
                return (
                  <>

                <div class="d-flex align-items-center" id="keyWatch">
                    <h3 class="mr-2"><i class="far fa-key"></i> {row.original[key]?.rendered || row.original[key]?.value}</h3>
                    <h3><i class="far fa-eye pr-1"></i>
                    {row.original[tableKeyword + ".watch_count"]?.rendered ||
                    row.original[tableKeyword + ".watch_count"]?.value}
                    </h3>
                  </div>

                  </>
                );
              }

              if (slicedKey === "avatar_url") {
                return (
                  <>
               <div class="d-flex align-items-center" id="avatarInfo">
               <img class="img-fluid avatar mr-2" src={row.original[key]?.rendered || row.original[key]?.value}/>
                   <p class="ms-2 small black">
                   {row.original[tableKeyword + ".avatar_name"]?.rendered ||
                   row.original[tableKeyword + ".avatar_name"]?.value}
                   </p>
               </div>

                  </>
                );
              }

           if (slicedKey === "unit_variance") {
             return (
               <>

               <div className={row.original[key]?.value < 0 ? "negativeBlock" : "positiveBlock"}><p>{row.original[key]?.rendered || row.original[key]?.value}%</p></div>

                 </>
               );

            }

              if (slicedKey === "tags") {

                var tags = row.original[key]?.value
                const items = tags.map((hero, index)=>
                 <li className={hero === "Critical" ? "tag critical" : hero === "Warning" ? "tag warning" : hero === "Informational" ? "tag informational" : hero === "Neutral" ? "tag neutral" : hero === "Branded" ? "tag branded" :  'tag success'}
                 >{hero}</li>
                 )
                return (
                  <>

                  <div class="mb-0" id="tagInfo">
                      <ul>
                       {items}
                      </ul>
                  </div>


                  </>
                );
              }


           if (slicedKey === "sum_total_units") {

             return (
               <>

              <div className="position-relative">
                <div className="progress">
                <div className="progress-bar" role="progressbar" style={{width:row.original[key]?.value}}>
                </div>
                </div>
                <span className="progress-label">{row.original[key]?.rendered || row.original[key]?.value}</span>
              </div>

              </>
            );

            }

            if (slicedKey === "sparkline_list_2") {

                var arry = row.original[key]?.value

                function calculateAverage(array) {
                  var total = 0;
                  var count = 0;
                  array.forEach(function(item, index) {
                      total += item;
                      count++;
                  });

                return total / count;
                }

                var average = calculateAverage(arry)

                  const iterator = arry.values();
                  var val = ''

                  for (var value of iterator) {
                    var val = value;

                    if (val > average){
                      // console.log(val)
                    }


                  }


                  var last = row.original[key]?.value[row.original[key]?.value.length - 1];
                  var first = row.original[key]?.value[0];


                  return (

                    <div id="spark2">

                    <Sparklines
                    data={row.original[key]?.value}
                    limit={10}
                    width={198}
                    height={38}
                    margin={0}
                    strokeWidth={"2px"}
                    >
                  <SparklinesLine style={{ strokeWidth: 3, stroke: last < first  ? "#C7200A" : "#39800B", fill: "none" }} />
                  <SparklinesSpots
                      size={4}

                      style={{ stroke:  last < first  ? "#C7200A" : "#39800B", strokeWidth: 3, fill: "white" }} />
                  </Sparklines>

                    </div>


                 );

            }

            if (slicedKey === "sparkline_list") {

              var last = row.original[key]?.value[row.original[key]?.value.length - 1];
              const first = row.original[key]?.value[0];

            var LinearGradientFill = stopColor => {
              var stopColor1 = "rgb(199, 32, 10)";
              var stopColor2 = "rgb(57, 128, 11)";

                return (
                  <linearGradient
                    id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"  stopColor={last < first  ? stopColor1 : stopColor2} stopOpacity="1" />
                    <stop offset="100%" stopColor={last < first  ? stopColor1 : stopColor2} stopOpacity="0" />
                  </linearGradient>

                );
              };

              return (
                <div id="spark1">
                <Sparklines
                  data={row.original[key]?.value}
                  limit={10}
                  width={198}
                  height={38}
                  margin={0}
                  strokeWidth={"2px"}
                  >
                  <svg>
                    <defs>
                      <LinearGradientFill />

                    </defs>
                  </svg>

                <SparklinesCurve
                  color={ last < first  ? "#C7200A" : "#39800B"}
                  style={{
				                strokeWidth: 5,
                        // fill: 'url(#gradient)'

			            }}
                  strokeWidth={"2px"}
                  type={"area"}

                  />

                </Sparklines>

               </div>
             );

            }

              if (key === "progress_bar") {

                  const now = row.original[key]?.value * 100;

                  console.log(now)

                return (
                  <>
                  <div className="skinny">
                    <ProgressBar now={now} label={`${now}%`} visuallyHidden />
                    <span className="progress-label">{row.original[key]?.rendered || row.original[key]?.value}</span>
                 </div>

                 </>
               );

              }

              return row.original[key]?.rendered || row.original[key]?.value;
            },
            headerClassName: "table-header1",
          };
        }),
    []
  );

  return (
    <Styles config={config}>

      <Table
      config={config}
      columns={columns}
      data={data}

      />

      <Pagination
        config={config}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"

        rowsPerPage={1}
        page={1}
        />

    </Styles>
  );

}
