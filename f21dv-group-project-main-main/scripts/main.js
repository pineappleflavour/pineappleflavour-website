// Import javascript modules
import Butterfly from './Butterfly.js';
import Line from './Line.js';
import Scatter from './ScatterPlot.js';
import Donut from './donutpie.js';

// Declare Variables
let Country_data, Country_growth, ScatterData, Expenditure;
let butterfly, line, scatter, donut;


/**
 * The loadData() function loads data from CSV files asynchronously. Once all the data is successfully loaded, 
 * the initialize() function is called to set up dropdowns and initialize the visualizations. 
 * Error handling(try...catch) is applied to handle exceptions.
 */
async function loadData() {
    try {
        Country_data = await d3.csv("./data/country_age.csv", d => {
            return {
                Country_Name: d.Country_Name,
                Gender: d.Gender,
                Year: +d.Year, //type conversion (string to integer)
                Age_Group: d.Age_Group,
                Value: +d.Value  //type conversion (string to float)
            };
        });

        Country_growth = await d3.csv("./data/Population_growth_file.csv", d => {
            return {
                Country_Name: d.Country_Name,
                Continent: d.continent,
                Series_Code: d.Series_Code,
                Year: +d.Year,  //type conversion (string to integer)
                Value: +d.Growth_Value  //type conversion (string to integer)
            };
        });

        ScatterData = await d3.csv('./data/Scatter_Data_Final.csv', d => {
            return {
                country: d.Country,
                HE_2000: parseFloat(d.HE_2000), 
                LE_2000: parseFloat(d.LE_2000), 
                HE_2005: parseFloat(d.HE_2005), 
                LE_2005: parseFloat(d.LE_2005),
                HE_2010: parseFloat(d.HE_2010),
                LE_2010: parseFloat(d.LE_2010),
                HE_2015: parseFloat(d.HE_2015),
                LE_2015: parseFloat(d.LE_2015),
                HE_2020: parseFloat(d.HE_2020),
                LE_2020: parseFloat(d.LE_2020),
                HE_2021: parseFloat(d.HE_2021),
                LE_2021: parseFloat(d.LE_2021),
                HE_2022: parseFloat(d.HE_2022),
                LE_2022: parseFloat(d.LE_2022)
            };
        });

        Expenditure = await d3.csv("./data/expenditure.csv", d => {
            return {
                Country_Name: d.Country_Name,
                Series_Code: d.Series_Code,
                Series_Name: d.Series_Name,
                Year: +d.Year,
                Value: parseFloat(d.Value)
            };
        });

        console.log(Expenditure);
        console.log(Country_data);
        console.log(Country_growth);
        
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

/**
 * The initialize() function sets up and initializes visualizations on the webpage. 
 */
function initialize(selectedcountry, selectedYear) {

    d3.select('#butterfly').selectAll('*').remove();
    d3.select('#line').selectAll('*').remove();
    d3.select('#scatter').selectAll('*').remove();
    d3.select('#donut').selectAll('*').remove();


    // Create and initialize visualization objects butterfly, Scatter, donut and line.
    butterfly = new Butterfly('#butterfly', 550, 400, [20, 40]);
    line  = new Line('#line', 600, 400, [20, 30]);
    scatter = new Scatter("#scatter", 620, 400, [10, 40, 70, 10]);
    donut = new Donut('#donut', 600, 400, [20, 30, 30, 40]);

    updateData(selectedcountry, selectedYear);
}

/**
 * The updateData() updates  the data displayed in the visualizations based on the selected
 * year and country  values from the dropdown menus.
 */
function updateData(selectedcountry, selectedYear) {

    // Get selected year and country values from the country dropdown menu
    selectedYear = parseInt(selectedYear);
    // let selectedCountry = countryDropdown.getValue();
    console.log(selectedcountry);
    console.log(selectedYear);
    // Filter data displayed in visualization based on selected year and selected country
    let filteredData = Country_data.filter(d => d.Year === selectedYear && d.Country_Name === selectedcountry);
    let maleData = filteredData.filter(d => d.Gender === 'male');
    let femaleData = filteredData.filter(d => d.Gender === 'female');
    let linefilter = Country_growth.filter(d => d.Country_Name === selectedcountry);
    let UrbanData = linefilter.filter(d => d.Series_Code === "SP.URB.GROW");
    let RuralData = linefilter.filter(d => d.Series_Code === "SP.RUR.TOTL.ZG");
    let Expenditure_data = Expenditure.filter(d => d.Year === selectedYear && d.Country_Name === selectedcountry);

    console.log(Expenditure_data);

    // Render visualizations based on filtered data
    butterfly.render(maleData, femaleData);
    line.render(UrbanData, RuralData);
    scatter.render(getXY(ScatterData, "country", `LE_${selectedYear}`, `HE_${selectedYear}`), `Life Expectancy ${selectedYear}`);
    scatter.setLabels(`Life Expectancy ${selectedYear}`, 'Health Expenditure');
    scatter.highlightCountry(selectedcountry);
    donut.render(Expenditure_data);

}

function getXY(dataset, country, LE_year, HE_year) {
    const result = [];
    for (const entry of dataset) {
        result.push([String(entry[country]), String(entry[LE_year]), String(entry[HE_year])]);
    }
    return result;
}

/**
 * The run() function is asynchronous. It calls  the loadData() function.
 */
async function run() {
    await loadData();
}

/**
 * Call run() function.
 */
run();

export {initialize};
