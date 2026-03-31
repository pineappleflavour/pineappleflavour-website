// Scatter Plot Class
export default class Scatter {

    // Object properties
    width; height; margin;
    svg; chart; circles; xAxis; yAxis; xLabel; yLabel;
    xScale; yScale;
    data;
    zoom;

    // constructor: setup size and selections
    // parameters: selector, width, height, [top, bottom, left, right]

    constructor(container, width, height, margin = [0, 0, 0, 0]) {
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.svg = d3.select(container).append('svg')
            .classed('ScatterPlot_Vis', true)
            .attr('width', this.width)
            .attr('height', this.height);
        this.chart = this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]},${this.margin[0]})`);
        this.circles = this.chart.selectAll('circle');
        this.xAxis = this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]},${this.height - this.margin[1]})`);
        this.yAxis = this.svg.append('g')
            .attr('transform', `translate(${this.margin[2]}, ${this.margin[0]})`);
        this.xLabel = this.svg.append('text').classed('legend', true)
            .attr('transform', `translate(${this.width/2}, ${this.height})`)
            .style('text-anchor', 'middle').attr('dy', -5);
        this.yLabel = this.svg.append('text').classed('legend', true)
            .attr('transform', `translate(${this.margin[2]}, ${this.margin[0]})rotate(-90)`)
            .style('text-anchor', 'end').attr('dy', 15);

        // create zoom behaviour
        this.zoom = d3.zoom()
            .extent([[0, 0], [this.width, this.height]])
            .scaleExtent([1, 3]) 
            .on('zoom', this.zoomed.bind(this));
        
        this.svg.call(this.zoom); //call zoom behaviour on svg
    }

    // Private methods

    #updateScales() {
        let chartWidth = this.width - this.margin[2] - this.margin[3];
        let chartHeight = this.height - this.margin[0] - this.margin[1];
    
        // Determine the domain for x and y scales
        let domainX = d3.extent(this.data, d => d[1]); //data([0] = country, [1] = LE_year, [2] = HE_year)
        let domainY = [0, d3.max(this.data, d => d[2])]; //data([0] = country, [1] = LE_year, [2] = HE_year)
    
        // Set up the x and y scales
        this.xScale = d3.scaleLinear()
            .domain(domainX)
            .range([0, chartWidth])
            .nice();
    
        this.yScale = d3.scaleLinear()
            .domain(domainY)
            .range([chartHeight, 0])
            .nice();
    }
    

    #updateAxes() {
        let axisGenX = d3.axisBottom(this.xScale),
            axisGenY = d3.axisLeft(this.yScale);
        this.xAxis.attr('transform', `translate(${this.margin[2]},${this.height - this.margin[1]})`).call(axisGenX);
        this.yAxis.attr('transform', `translate(${this.margin[2]}, ${this.margin[0]})`).call(axisGenY);
    }

    #updateCircle() {
        this.circles = this.circles
            .data(this.data)
            .join('circle')
            .classed('circle', true)
            .attr('cx', d => this.xScale(d[1])) //data([0] = country, [1] = LE_year, [2] = HE_year)
            .attr('cy', d => this.yScale(d[2]))
            .attr('r', 5)
            .attr('fill', 'steelblue')
    }

    #tooltip() {
        let tooltip = d3.select('#scatter').append("div").attr("id", "tooltip");

        this.circles
            .on('mouseenter', (event, d) => {
                setTimeout(() => {
                    tooltip
                        .style('opacity', 1)
                        .html(`<strong>${d[0]}:</strong> ${d[1]},</strong> ${d[2]}`)
                        .style('visibility',"visible")
                        .style('left', event.pageX + 'px')
                        .style('top', event.pageY - 30 + 'px');
                }, 100);
                    
            })
            .on('mouseleave', () => {
                tooltip.style("opacity", 0); // Fade out tooltip
            });
        
    }
    
    zoomed(event) {
        const { transform } = event;
        // Update the chart transform based on the zoom transform
        this.chart.attr('transform', transform);
        // Update axes to match the zoomed scale
        this.xAxis.call(d3.axisBottom(transform.rescaleX(this.xScale)));
        this.yAxis.call(d3.axisLeft(transform.rescaleY(this.yScale)));
        // Update circles with the new scale
        this.circles.attr('transform', transform);
    }

    highlightCountry(countryName) {
        this.chart.selectAll('.circle')
            .attr('fill', d => d[0] === countryName ? 'orange' : 'steelblue');
    }
    

    //Diaplay chart
    render(dataset) {
        this.data = dataset;
        this.#updateScales();
        this.#updateCircle();
        this.#updateAxes();
        this.#tooltip();
        return this;
    }

    setLabels(xLabel = 'categories', yLabel = 'values') {
        this.xLabel.text(xLabel);
        this.yLabel.text(yLabel);
        return this;
    }
}