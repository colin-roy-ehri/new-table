// To allow invalid https certificates from localhost in Chrome: chrome://flags/#allow-insecure-localhost

import * as React from "react";
import * as ReactDOM from "react-dom";
import { CustomTable } from "./CustomTable";

looker.plugins.visualizations.add({
  options: {

    // headerStyles: {
    //   type: "string",
    //   label: "Header CSS Styles",
    //   order: 1,
    //   section: "Styles"
    // },
    // rowStyles: {
    //   type: "string",
    //   label: "Row CSS Styles",
    //   order: 2,
    //   section: "Styles"
    // },
    // generalCSS: {
    //   type: "string",
    //   label: "Genral CSS Overrides",
    //   order: 3,
    //   section: "Styles"
    // },
    // borderBetweenColumns: {
    //   type: "string",
    //   label: "What columns need thick borders?",
    //   order: 4,
    //   section: "Styles"
    // },
    // borderBetweenRows: {
    //   type: "string",
    //   label: "What rows need thick borders?",
    //   order: 5,
    //   section: "Styles"
    // },
    // groupByMeasure: {
    //   type: "boolean",
    //   label: "Group by Measure then Pivot",
    //   default: false,
    //   section: "Styles"
    // },
    // conditionalHighlightStyle: {
    //   type: "string",
    //   label: "Conditional Highlight Style",
    //   section: "Conditional",
    //   order: 1
    // },
    chartTitle: {
      type: "string",
      label: "Chart Title",
      default: "",
      section: "Chart",
      order: 1
    },
    chartBarColor: {
      type: "string",
      label: "Bar Color",
      default: "#4A90E2",
      section: "Chart",
      order: 2
    },
    chartBarBackgroundColor: {
      type: "string",
      label: "Bar Background Color",
      default: "#eee",
      section: "Chart",
      order: 3
    },
    upSparklineColor: {
      type: "string",
      label: "Up Trend Color",
      default: "#34D058",
      section: "Chart",
      order: 4
    },
    downSparklineColor: {
      type: "string",
      label: "Down Trend Color",
      default: "#FF4B4B",
      section: "Chart",
      order: 5
    },
    
  },


  create: function (element, config) {
    // console.log("create-config", config);
  },


  // The updateAsync method gets called any time the visualization rerenders due to any kind of change,
  // such as updated data, configuration options, etc.
  updateAsync: function (data, element, config, queryResponse, details, done) {

//         // Extract column names from the data
//         const columnNames = queryResponse.fields.dimension_like.map(dim => dim.name).concat(queryResponse.fields.measure_like.map(measure => measure.name));
//         let options = this.options
//         // Add configuration options for renaming columns
//         columnNames.forEach((colName, index) => {
//           const configKey = `rename_${colName}`;
//           if (!options[configKey]) {
//             options[configKey] = {
//               type: "string",
//               label: `Rename column: ${colName}`,
//               default: colName,
//               order: 10 + index,
//               section: "Labels",
//             };
//           }
//         });
//         columnNames.forEach((colName, index) => {
//           const configKey = `conditional_styles_${colName}`;
//           if (!options[configKey]) {
//             options[configKey] = {
//               type: "string",
//               label: `${colName} formats this column:`,
//               default: colName,
//               display: "select",
//               values: [{'none':'None'},...columnNames.map((col) => ({ [col]: col }))],
//               order: 10 + index,
//               section: "Conditional",
//               default: 'none'
//             };
//           }
//         });
//         // If there are pivots, I want to also add rename options for the pivot values
//         if (queryResponse.pivots && queryResponse.pivots.length > 0) {
//           queryResponse.pivots.forEach((pivot, index) => {
            
//               const configKey = `rename_${pivot.key}`;
//               if (!options[configKey]) {
//                 options[configKey] = {
//                   type: "string",
//                   label: `Rename pivot value: ${pivot.key}`,
//                   default: pivot.key,
//                   order: 20 + index + columnNames.length,
//                   section: "Labels",
//                 };
//               }
//           });
//         }
//         // register the options with the visualization
//         this.trigger("registerOptions", options);
// console.log('queryResponse', queryResponse)

    ReactDOM.render(
      <CustomTable
        data={data}
        config={config}
        queryResponse={queryResponse}
        details={details}
        done={done}
      />,

      element
    );
  },
});
