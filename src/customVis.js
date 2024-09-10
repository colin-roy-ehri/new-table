// To allow invalid https certificates from localhost in Chrome: chrome://flags/#allow-insecure-localhost

import * as React from "react";
import * as ReactDOM from "react-dom";
import { CustomTable } from "./CustomTable";

looker.plugins.visualizations.add({
  options: {

    marg: {
      type: "string",
      label: "Header CSS Styles",
      order: 1,
      section: "Styles"
    },
    rowStyles: {
      type: "string",
      label: "Row CSS Styles",
      order: 2,
      section: "Styles"
    },
    generalCSS: {
      type: "string",
      label: "Genral CSS Overrides",
      order: 2,
      section: "Styles"
    },
    borderBetweenColumns: {
      type: "string",
      label: "What columns need thick borders?",
      order: 4,
      section: "Styles"
    },
    borderBetweenRows: {
      type: "string",
      label: "What rows need thick borders?",
      order: 5,
      section: "Styles"
    },
  },


  create: function (element, config) {
    // console.log("create-config", config);
  },


  // The updateAsync method gets called any time the visualization rerenders due to any kind of change,
  // such as updated data, configuration options, etc.
  updateAsync: function (data, element, config, queryResponse, details, done) {

        // Extract column names from the data
        const columnNames = queryResponse.fields.dimension_like.map(dim => dim.name).concat(queryResponse.fields.measure_like.map(measure => measure.name));
        let options = this.options
        // Add configuration options for renaming columns
        columnNames.forEach((colName, index) => {
          const configKey = `rename_${colName}`;
          if (!options[configKey]) {
            options[configKey] = {
              type: "string",
              label: `Rename column: ${colName}`,
              default: colName,
              order: 10 + index,
              section: "Labels",
            };
          }
        });
        // register the options with the visualization
        this.trigger("registerOptions", options);
console.log('queryResponse', queryResponse)

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
