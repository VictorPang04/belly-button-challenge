function init() {
  // Dropdown select
  var selector = d3.select("#selDataset");

  // Using the sample names for options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Initial plot will use the first sample
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


// Initialize the dashboard
init();
function optionChanged(newSample) {
  //  Fetch the data every time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}


// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter for the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h5").text(`${key}: ${value}`);
    });
  });
}


// Create the buildCharts function.
function buildCharts(sample) {

  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
    //  Define samples 
    console.log(data);
    var samples = data.samples;
    var metadata = data.metadata;
    
    //  Filtering
    var filteredsamples = samples.filter(sampleObj => sampleObj.id == sample);
    var filteredMetadata = metadata.filter(sampleObj => sampleObj.id == sample);

    //  Variable that holds the first sample in the resultArray.
    var firstSample = filteredsamples[0];
    console.log(firstSample);

    //  Variable that holds the first sample in filteredMetadata.
    var firstMetadata = filteredMetadata[0];
    console.log(firstMetadata);

    //  Variables for otu_ids, otu_labels, and sample_values.
    var otu_Ids = firstSample.otu_ids;
    var otu_Labels = firstSample.otu_labels;
    var sample_Values = firstSample.sample_values;


    //  Bar Chart
    var barData = [{
      x: sample_Values.slice(0, 10).reverse(),
      y: otu_Ids.slice(0, 10).map(id => "OTU " + id + " ").reverse(),
      text: otu_Labels.slice(0, 10).reverse(),
      type: "bar",
      orientation:"h"
      }];
 
    Plotly.newPlot("bar", barData);
  

    //  Bubble Chart
    var bubbleData = [{
      x: otu_Ids,
      y: sample_Values,
      text: otu_Labels,
      type: "scatter",
      mode: "markers",
      marker: {
        size: sample_Values,
        color: otu_Ids,
      }
    }];
    //  Bubble chart layout
    var bubbleLayout = {
      xaxis: {title: "OTU ID"},
      hovermode: "closest"
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

  });
}