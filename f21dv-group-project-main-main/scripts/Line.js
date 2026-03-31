export default class Line {

    // Declare properties
    width; height; margin;svg; chart; axisX; axisY;
    labelX; labelY; scaleX; scaleY;data; line; legend; tipline;

    /**
     * The constructor initializes the properties and sets up the initial state of the Line chart. 
     * It takes four parameters: container, width, height, and margin.
     * Margin definition   ->    margin: [vertical, horizontal] 
     */
    constructor(container, width, height, margin) {
        this.container = container;
        this.width = width;
        this.height = height - margin[0] - margin[1];
        this.margin = margin;

        this.svg = d3.select(container).append('svg').attr('width', width).attr('height', height).classed('linechart',true);;
        this.chart = this.svg.append('g').attr('transform', `translate(${this.margin[1]}, ${this.margin[0]+20})`)
        this.labelX = this.chart.append('text').classed('x-axis-label', true)
            .attr('transform', `translate(${270},${this.height + 8})`);
        this.labelY = this.chart.append('text').classed('label', true)
            .attr('transform', `translate(${-this.margin[1] / 2-5},${this.height / 2})rotate(-90)`);
        this.title = this.svg.append('text').classed('title', true)
            .attr('transform', `translate(${this.width/3},${15})`).text("Growth Rate in Population"); 
        this.axisX = this.chart.append('g').attr('class', 'x-axis')
            .attr('transform', `translate(${0}, ${this.height - this.margin[0]})`);
        this.axisY = this.chart.append('g').attr('class', 'y-axis').attr('transform', `translate(${10}, ${0})`);
        this.line = d3.line().x(d => this.scaleX(d.Year)).y(d => this.scaleY(d.Value));
        this.lineurban = this.chart.append('g').classed('line-urban', true);
        this.linerural = this.chart.append('g').classed('line-rural', true);
        this.legend = this.svg.append('g').attr('legend', true).attr('transform', `translate(${0})`);
        this.tipline = this.chart.append("g").append("line").classed('tipline', true).attr("transform", `translate(0, 10)`);
        this.tipdoturban = this.lineurban.append("g").append("circle").classed('tipdoturban', true);
        this.tipdotrural = this.linerural.append("g").append("circle").classed('tipdotrural', true);
        this.ruralText = this.chart.append("text").classed('tipruraltext', true);
        this.urbanText = this.chart.append("text").classed('tipurbantext', true);
    }

    /**
     * The updateScalesAxes(data) method updates the scales and axes of the Line chart 
     * based on the provided data. 
     */
    updateScalesAxes(data) {

        //Create an array of years and values
        let years = data.map(d => d.Year);
        let values = data.map(d => d.Value);

        //Define chart width and height
        this.chartWidth = this.width - this.margin[1] * 2.5;
        this.chartHeight = this.height - this.margin[0];

        //Update Scales and Axes
        this.scaleX = d3.scaleLinear().range([10, this.chartWidth]).nice();
        this.scaleY = d3.scaleLinear().range([this.chartHeight, 0]).nice();
        this.scaleX.domain(d3.extent(years));
        this.scaleY.domain([Math.min(0, d3.min(values)), d3.max(values)]);
        this.axisX.call(d3.axisBottom(this.scaleX).tickFormat(d3.format("d")));
        this.axisY.call(d3.axisLeft(this.scaleY));
        return this;
    }

    /**
     * The addLegendsLabels() method adds legends and labels to the Line chart.
     */
    addLegendsLabels() {
        this.legend.append('rect').attr('class', 'urban-legend-box')
            .attr('x', (this.width / 3 - this.margin[1] -5) ).attr('y', 17);
        this.legend.append('text').classed("legend-text",true)
            .attr('x', (this.width / 3 - this.margin[1]+10)).attr('y', 27).text('Urban growth');
        this.legend.append('rect').attr('class', 'rural-legend-box')
            .attr('x', (this.width / 2 + this.margin[1]+ 25)).attr('y', 17);
        this.legend.append('text').classed("legend-text",true)
            .attr('x', (this.width / 2 + this.margin[1]) + 40).attr('y', 27).text('Rural growth');
        this.labelX.text('Year');
        this.labelY.text('Values');
        return this;
    }

    /**
     * The plotlines(data1, data2)  method plots the lines on the Line chart based
     * on the provided data arrays data1 and data2.
     */
    plotlines(data1, data2) {
        this.lineurban.append('path').datum(data1).attr('class', 'lineUrban').attr('d', this.line);
        this.linerural.append('path').datum(data2).attr('class', 'lineRural').attr('d', this.line);
        return this;
    }

    
    /**
     * The `setEvents()` method sets up extra elements (marker line and marker dots) on the Line chart.
     */
    setEvents(data1, data2) {
        if (data1!=null && data2!=null){
                this.tipline = this.chart.append("g").append("line").classed('tipline', true).attr("transform", `translate(0, 10)`);
                this.tipline.attr('x1', 0).attr('x2', 0)
                    .attr('y1', this.height).attr('y2', this.height); // y1 and y2 assigned this.height so line goes all the way down
                this.tipdoturban.attr('cx', 10).attr('cy', 0).attr('r', 5);
                this.tipdotrural.attr('cx', 10).attr('cy', 0).attr('r', 5);
                this.urbanText.attr("x", 0).attr("y", 0);
                this.ruralText.attr("x", 0).attr("y", 0);}
                else{
                    this.chart.selectAll('.tipline').remove();
                }
        return this;
    }

    /**
     * The handleUnavailableData() method adds a text element to the chart to 
     * indicate that there is no data available for plotting the lines.
     */
    handleUnavailableData(){
        this.chart.append("text").classed("noData", true).text("Data Not Available")
            .attr("x", this.width / 2).attr("y", this.height / 2);//Centralize text
        return this;
    }
    
    /**
     * The updateEvents(data1, data2) method handles mouse events on the Line chart.
     * It updates the events th
     * at were initally set up.
     */
    updateEvents(data1, data2) {
        let valueFormat = d3.format('.2f');

        //Accesses Year and Value properties  of a data point
        let xAccessor = (d) => d.Year;
        let yAccessor = (d) => d.Value;

        //Finds insertion point based on xAccessor
        let bisect = d3.bisector(xAccessor);

        this.svg.on('mousemove', (event) => {
            //Get current coordinates of the mouse pointer relative to the SVG
            let mouse = d3.pointer(event);
            let x = mouse[0]; // horizontal mouse pointer coordinates
            let y = mouse[1]; // vertical mouse pointer coordinates

            // Convert x to its corresponding data value on the x-axis scale
            let year = this.scaleX.invert(x);

            // returns the index of the data point closest to the current year in the data array
            let index1 = bisect.center(data1, year);
            let index2 = bisect.center(data2, year);

            //Retrieve data point from data at insertion index
            let d1 = data1[index1];
            let d2 = data2[index2];
           
            //retrieves x and y coordinates for data points 
            let x1 = this.scaleX(xAccessor(d1));
            let y1 = this.scaleY(yAccessor(d1));
            let x2 = this.scaleX(xAccessor(d2));
            let y2 = this.scaleY(yAccessor(d2));
            console.log(`x: ${x1}, y: ${y1}`);
            console.log(`x: ${x2}, y: ${y2}`);

            if(data1!==null&&data2!=null){
                   // Updating markerline, dot and text positions on mouse move over in the line graph
            this.tipline.attr('x1', x1).attr('y1', 0).attr('x2', x2).attr('y2', this.height).classed("tipline", true);
            this.tipdoturban.attr('cx', x1).attr('cy', y1).classed("tipdoturban", true);
            this.tipdotrural.attr('cx', x2).attr('cy', y2).classed("tipdotrural", true);
            this.urbanText.attr("x", x1+20).attr("y", y1-3).text(valueFormat(yAccessor(d1))).classed("tipurbantext", true);
            this.ruralText.attr("x", x2+20).attr("y", y2-3).text(valueFormat(yAccessor(d2))).classed("tipruraltext", true);
        
            }
            else{
                this.chart.selectAll('.tipline').remove();
            }
        });

            
         

        this.svg.on('mouseleave', () => {
            this.tipline.classed('tipline', false);
            this.tipdoturban.classed('tipdoturban', false).attr("opacity", 0);
            this.tipdotrural.classed('tipdotrural', false).attr('opacity', 0);
            this.ruralText.text(null);
            this.urbanText.text(null);
        });

        return this;
    }

    /**
     * The render(data1, data2) method renders the Line chart based on the provided
     * data arrays data1 and data2. 
     */
    render(data1, data2) { 
        console.log(data1, data2);
        //Remove existing elements
        this.chart.selectAll('.noData').remove();
        this.chart.selectAll('.lineUrban').remove();
        this.chart.selectAll('.lineRural').remove();
        this.chart.selectAll('.tipline').remove();
        this.axisX.selectAll('*').remove();
        this.axisY.selectAll('*').remove();
        this.legend.selectAll('*').remove();
        this.labelX.selectAll('*').remove();
        this.labelX.text('');
        this.labelY.text('');
    
        // Checks if all values in data are zero
        let zeroData1 = data1.every(d => d.Value === 0);
        let zeroData2 = data2.every(d => d.Value === 0);

        //if true then the "no data available" message is displayed else chart is rendered
        if (zeroData1 && zeroData2){

            this.handleUnavailableData();
          }
        else{
             // Update scales, events, plot lines and legends
             this.updateScalesAxes([...data1, ...data2]);
             this.setEvents(data1, data2);
             this.plotlines(data1, data2);
             this.updateEvents(data1, data2);
             this.addLegendsLabels();  
        }
        
        return this;
    }
           
}
