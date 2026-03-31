
export default class Butterfly {
    // Declare properties
    width;height; margin;
    svg;chart;
    maleBars;femaleBars;
    scaleX;scaleY;
    maleData;femaleData;

    /**
     * The constructor initializes the properties and sets up the initial state of the Butterfly chart. 
     * It takes four parameters: container, width, height, and margin.
     * Margin definition   ->    margin: [vertical, horizontal] 
     */
    constructor(container, width, height, margin) {
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.svg = d3.select(container).append('svg').classed('butterfly', true).attr('width', this.width + 2 * this.margin[1])
            .attr('height', this.height).classed('butterflychart', true);
        this.chart = this.svg.append('g').attr('transform', `translate(${this.width / 3 + this.margin[0]},${this.margin[1]})`); // Center the chart
        this.axisX = this.chart.append('g').classed('x-axis', true);
        this.axisY = this.chart.append('g').classed('y-axis', true);
        this.maleBars = this.chart.selectAll('rect.right_bar');
        this.femaleBars = this.chart.selectAll('rect.left_bar');
        this.femaleTooltip = this.chart.selectAll('female-tooltip');
        this.maleTooltip = this.chart.selectAll('.male-tooltip');
        this.title = this.svg.append('text').classed('title', true)
        .attr('transform', `translate(${200},${15})`).text("Gender Distribution of Age Groups");
    }

     /**
     * The updateScalesAxes(data) method updates the scales and axes of the Butterfly chart 
     * based on the provided data. 
     */
    updateScalesAxes() {
        //Define chart width and height
        let chartWidth = this.width / 2 - this.margin[1] - this.margin[0];
        let chartHeight = this.height - this.margin[0] - this.margin[1];

        //Update Scales and Axes
        this.scaleX = d3.scaleLinear().range([0, chartWidth]).nice();
        this.scaleY = d3.scaleBand().range([0, chartHeight]).padding(0.1);
        let maxMaleValue = d3.max(this.maleData, d => d.Value);
        let maxFemaleValue = d3.max(this.femaleData, d => d.Value);
        let maxBarValue = Math.max(maxMaleValue, maxFemaleValue);
        this.scaleX.domain([0, maxBarValue]);
        this.scaleY.domain([...new Set([...this.maleData, ...this.femaleData].map(d => d.Age_Group))]);
    
        // Calculate the translation for y-axis based on the scales
        let translationX = this.width / 4 - this.scaleX(maxBarValue)- 50;

        this.chart.select('.y-axis')
            .attr('transform', `translate(${ translationX },${0})`) // Adjust translationX to move it further right
            .call(d3.axisLeft(this.scaleY).tickSize(0));
    
        
        }

    /**
     * The updateBars() method updates the bars in the Butterfly chart based on the provided data. 
     */
    updateBars() {
        this.femaleBars = this.chart.selectAll('.right_bar')
            .data(this.femaleData)
            .join(
                    enter => enter.append('rect') //entering data points
                        .attr('class', 'right_bar')
                        .attr('y', d => this.scaleY(d.Age_Group))
                        .attr('height', this.scaleY.bandwidth())
                        .attr('x', this.width / 4) 
                        .attr('width',0)
                        .transition()
                        .duration(1000)
                        .attr('width', d => this.scaleX(d.Value)),
                    update => update // update data point
                        .transition()
                        .duration(1000)
                        .attr('y', d => this.scaleY(d.Age_Group))
                        .attr('height', this.scaleY.bandwidth())
                        .attr('x', this.width / 4) 
                        .attr('width', d => this.scaleX(d.Value)),
                    exit => exit // exit data points
                        .transition()
                        .duration(500)
                        .attr('width',0)
                        .remove()
                );

            this.maleBars = this.chart.selectAll('.left_bar')//entering data points
                .data(this.maleData)
                .join(
                    enter => enter.append('rect')
                        .attr('class', 'left_bar')
                        .attr('y', d => this.scaleY(d.Age_Group))
                        .attr('height', this.scaleY.bandwidth())
                        .attr('x', d => this.width / 4) 
                        .attr('width', 0)
                        .transition()
                        .duration(1000)
                        .attr('x', d => (this.width / 4) - this.scaleX(d.Value))
                        .attr('width', d => this.scaleX(d.Value)),
                    update => update //update data points
                        .transition()
                        .duration(1000)
                        .attr('y', d => this.scaleY(d.Age_Group))
                        .attr('height', this.scaleY.bandwidth())
                        .attr('x', d => (this.width / 4) - this.scaleX(d.Value))
                        .attr('width', d => this.scaleX(d.Value)),
                    exit => exit //exit data points
                        .transition()
                        .duration(1000)
                        .attr('width',0)
                        .remove()
                );
    }

    /**
     * The addLegends() adding legend text elements to the SVG chart.
     */
    addLegends() {
        this.svg.append('text').attr('class', 'legend').attr('x', this.width / 4)
            .attr('y', this.height - this.margin[1]).text('Male')

        this.svg.append('text').attr('class', 'legend').attr('x', this.width)
            .attr('y', this.height - this.margin[1])//move lengends up
            .text('Female')
    }

    /**
     * The handleUnavailableData() method adds a text element to the chart to 
     * indicate that there is no data available for plotting the lines.
     */
    handleUnavailableData(){
        this.chart.append("text").classed("noData", true).text("Data Not Available")
            .attr("x", this.width / 4).attr("y", this.height / 3);//Centralize text
        return this;
    }

    /**
     * The addTooltips() method adds tooltip text elements to the Butterfly chart. It formats the tooltip values, 
     * positions it next to the corresponding bars in the chart, and sets the opacity to make them visible. 
     * The method handles both female and male data separately by selecting the appropriate
     * elements and updating their positions and text values accordingly.
     */
    addTooltips() {
        let  valueFormat = d3.format('.2f');
        this.femaleTooltip = this.chart.selectAll('.female-tooltip')
            .data(this.femaleData)
            .join('text')
            .attr('class', 'female-tooltip')
            .transition() // add trsnsition for bars
            .duration(1200)
            .attr('x', d => this.width / 4 + this.scaleX(d.Value) + 15)// add space between tooltips and bars
            .attr('y', d => this.scaleY(d.Age_Group) + this.scaleY.bandwidth() / 1.5)// add space between tooltip values
            .text(d => valueFormat(d.Value))
            .attr('opacity', 1);

        this.maleTooltip=this.chart.selectAll('.male-tooltip')
            .data(this.maleData)
            .join('text')
            .attr('class', 'male-tooltip')
            .transition()
            .duration(1200)
            .attr('x', d => this.width / 4 - this.scaleX(d.Value) - 45) 
            .attr('y', d => this.scaleY(d.Age_Group) + this.scaleY.bandwidth() / 1.5)
            .text(d => valueFormat(d.Value))
            .attr('opacity', 1);
    }

    updateEvents(){

        this.femaleBars.on("mouseover", (event, data) => {
            let valueFormat = d3.format('.2f');
        
            // Hide all other female tooltips
            d3.selectAll('.female-tooltip').style('opacity', 0);
        
            // Highlight selected bar and increase bar height
            d3.select(event.target).classed("highlight", true)
                .transition().duration(300)
                .attr("height", this.scaleY.bandwidth() + 10);
        
            // Fade other bars
            this.femaleBars.filter(d => d !== data)
                .transition().duration(1).style("opacity", 0.5);
        
            // Show tooltip for selected bar
            d3.selectAll('.female-tooltip')
                .filter(d => d === data)
                .style('opacity', 1)
                .attr('x', this.width / 4 + this.scaleX(data.Value) + 15)
                .attr('y', this.scaleY(data.Age_Group) + this.scaleY.bandwidth() / 1.5)
                .text(valueFormat(data.Value));
        })
        .on("mouseout", (event, data) => {
            // Reset highlighting and restore bar height
            d3.select(event.target).classed("highlight", false)
                .transition().duration(0.5)
                .attr("height", this.scaleY.bandwidth());
        
            // Restore opacity of other bars
            this.femaleBars.transition().duration(1).style("opacity", 1);
        
            // Restore opacity of other tooltips
            d3.selectAll('.female-tooltip').style('opacity', 1);
        });
        
    
        
        this.maleBars.on("mousemove", (event, data)=>{
                 // Hide all male tooltips
                d3.selectAll('.male-tooltip').style('opacity', 0);

                // Highlight selected bar and increase bar height
                d3.select(event.target).classed("highlight", true)
                    .transition().duration(300)
                    .attr("height", this.scaleY.bandwidth() + 10);
        
                // Fade bars for unselected  bars
                this.maleBars.filter(d => d !== data).transition().duration(1).style("opacity", 0.5);
                  
                // Show tooltips for selected bar
                d3.selectAll('.male-tooltip')
                    .filter(d => d === data)
                    .style('opacity', 1)
                    .attr('x', this.width / 4 - this.scaleX(data.Value) - 45)
                    .attr('y', this.scaleY(data.Age_Group) + this.scaleY.bandwidth() / 1.5)
                    .text(valueFormat(data.Value));             
            })
            .on("mouseout",(event, data)=>{
                // Reset highlighting of selected bar and restore bar height
                d3.select(event.target).classed("highlight", false)
                  .transition().duration(0.5)
                  .attr("height", this.scaleY.bandwidth());

                // Restore opacity of other bars 
                this.maleBars.transition().duration(1).style("opacity", 1);
                // Restore opacity of other tooltips
                d3.selectAll('.male-tooltip').style('opacity', 1);  
            })}

    /**
     * The render(leftdata, rightdata) method renders the butterfly chart based on the provided
     * data arrays leftdata and rightdata. 
     */
    render(leftdata, rightdata) {
        //Remove existing elements
        this.chart.selectAll('.noData').remove();
        this.chart.selectAll('.left_bar').remove(); 
        this.chart.selectAll('.right_bar').remove(); 
        this.axisX.selectAll('*').remove(); 
        this.axisY.selectAll('*').remove(); 
        
        // Checks if all values in data are zero
        let zeroData1 = leftdata.every(d => d.Value === 0);
        let zeroData2 = rightdata.every(d => d.Value === 0);

        //if true then the "no data available" message is displayed else chart is rendered
        if(zeroData1 && zeroData2){
            this.handleUnavailableData();
               
        } else {
            // Update scales, bars, legend, tooltips and events
            this.maleData = leftdata;
            this.femaleData = rightdata;
            this.updateScalesAxes();
            this.updateBars();
            this.addLegends();
            this.addTooltips();
            this.updateEvents(); 
        }
        return this;
    
    }
}
