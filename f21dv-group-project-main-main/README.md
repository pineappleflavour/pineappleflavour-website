# F21DV Data Visualisation and Analytics 2023-2024 

> Coursework 1 - Exploring Global Health and Demographis Trends: A comprehensive dashboard analysis. <br>
> Authors: Etoro Ekong, Nerat Dazam, Lahja Ndjalo, Jacobs Ikedi <br>
> Group Leader: Jacobs Ikedi <br>
> Version: 1

This is a dashboard implemented in d3.js that displays charts that guide health parastatals, NGOs, policy makers and the general public through insights that would help them draw conclusions to the determinants of life expectancy in different countries. 

We have 5 charts on our dashboard that interact to tell our story:
- A choropleth map <br>
- A Scatterplot graph <br>
- A donut chart <br>
- A butterfly chart <br>
- A Linechart <br>


D3 was a better option for us to implement this dashboard because it offers more flexibility as regards the customization of our charts.

The charts on the dashboard have been programmed to get updated upon change of filter (years specified at the top of the dashboard and countries from the choropleth map) with some interactions that indicate the changes that have been made on the dashboard.

The application is structured to have three main parts:<br>

- The `index.html` file <br>
- The `Scripts` folder <br>
- The `Styles` folder <br>

The scripts folder holds the individual JS files for each chart and also has the main.js with all these charts imported into it <br>

The Styles folder holds the individual css files for each chart and also has the main.css with all the the styles for these charts linked inside of it. <br>

The index.html file loads the d3.v7 library, the stylesheet (main.css) and the main script (main.js).<br>

**Running the code** <br>
To successfully view this dashboard, the user can clone into this repository, and load the `index.html`  file.

We hope to make further improvements on this project in the nearest future.


THANK YOU!!!







