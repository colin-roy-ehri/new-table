// To allow invalid https certificates from localhost in Chrome: chrome://flags/#allow-insecure-localhost

import * as React from "react";
import * as ReactDOM from "react-dom";
import { CustomTable } from "./CustomTable";

looker.plugins.visualizations.add({
  options: {

  tableBordered: {
   type: "boolean",
   label: "Bordered Table",
   default: false,
   order: 1,
 },
 fixedHeight: {
  type: "boolean",
  label: "Table Scroll",
  default: false,
  order: 2,
},
unsetTable: {
 type: "boolean",
 label: "Table Layout",
 default: false,
 order: 3,
},

bottomRight: {
 type: "boolean",
 label: "Bottom Right Pagination",
 default: false,
 order: 4,
},




  },




  create: function (element, config) {
    // console.log("create-config", config);
  },


  // The updateAsync method gets called any time the visualization rerenders due to any kind of change,
  // such as updated data, configuration options, etc.
  updateAsync: function (data, element, config, queryResponse, details, done) {
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
