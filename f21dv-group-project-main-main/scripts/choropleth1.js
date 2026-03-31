// Import javascript modules
import { initialize } from './main.js';

// Define the dimensions for the svg
const width = 1500;
const height = 600;
let selectedCountry = null;
let selectedYear = "2000"; 

// Create a projection and path generator
const projection = d3.geoNaturalEarth1()
    .scale(180)
    .translate([620, height/2]);

const path = d3.geoPath()
    .projection(projection);

// Define the colour scale of the map and population ranges
const colorScale = d3.scaleLinear()
    .domain([1000, 10000, 50000, 100000, 250000, 750000, 1000000, 50000000])
    .range(["#deebf7", "#08306b", "#2171b5"]); // Linear colour scale

// Create an svg element
const svg = d3.select(".map-container svg")
    .attr("width", width)
    .attr("height", height)
    .style('background', 'radial-gradient(circle, rgba(0,15,99,1) 0%, rgba(28,99,173,1) 41%, rgba(0,9,125,1) 100%)');

// Define the tooltip
const tooltip = d3.select("body").append("div").attr("id", "tooltip");

// Create a function to update the map
const updateMap = (geoData, populationData, year) => {
    const populationByCountry = new Map(populationData.map(d => [d["Country"], +d[year]])); // Selects population of given country
    colorScale.domain([d3.min(populationData, d => +d[year]), d3.max(populationData, d => +d[year])]); // Set domain of color scale based on data
    // Merge country boundaries (geojson) with population data
    svg.selectAll("path").data(geoData.features).join("path").attr("d", path).attr("fill", d => {
        const population = populationByCountry.get(d.properties.ADMIN);
        return population ? colorScale(population) : "#FFFFFF";
    }).on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible").text(d.properties.ADMIN + ": " + populationByCountry.get(d.properties.ADMIN) || "No Data");
    }).on("mousemove", event => {
        tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
    }).on("mouseout", () => {
        tooltip.style("visibility", "hidden");
    }).on("click", function (event, d) {
        // Toggle selected state of the clicked country
        const selected = d3.select(this).classed("selected");
        svg.selectAll("path").classed("selected", false); // Deselect all countries
        d3.select(this).classed("selected", !selected); 
        const selectedcountry = d.properties.ADMIN;

        console.log(selectedcountry, selectedYear);
        selectedCountry = selectedcountry;
        // Update other charts when a country is clicked
        updateCharts(selectedCountry, selectedYear);
    });
};

// Create a function to update all the charts
const updateCharts = (selectedcountry, selectedYear) => {
    initialize(selectedcountry, selectedYear);
    // Call other chart update functions here
};

// Create a function to get the selected country
const getSelectedCountry = () => {
    return selectedCountry;
};

// Create a list of years and append it to the year-select-container
const yearList = [2000, 2005, 2010, 2015, 2020, 2021, 2022];
let  yearSelectContainer = d3.select("#filterContainer");
yearSelectContainer.append("select")
    .classed("year_dropdown", "true")
    .selectAll("option").data(yearList)
    .enter().append("option")
    .attr("value", d => d).text(d => d);

// Loading the data and then process data 
Promise.all([
    d3.csv("data/Choropleth_Population_1.csv"),
    d3.json("data/geojson.json")
]).then(([populationData, geoData]) => {
    updateMap(geoData, populationData, selectedYear);
    console.log(populationData);

    // Attach change event listener to the year select dropdown
    d3.select("#filterContainer").on("change", function (event) {
        selectedYear = event.target.value; // Get the selected year from the dropdown
        updateMap(geoData, populationData, selectedYear); // Update the map with the selected year
        // Update other charts when the year changes
        updateCharts(selectedCountry, selectedYear);
    });
});

// Export the updateMap and getSelectedCountry functions
export { updateMap, getSelectedCountry };
