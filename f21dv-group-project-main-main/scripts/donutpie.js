export default class DonutChart {
    // Declare properties
    width; height; margin;
    svg; chart; arcs; labels; tooltip; legends;
    data; sum;colorScale;
    pieGenerator; arcGenerator; l
    

    // Constructor
    constructor(container, width, height, margin){
        this.width = width;
        this.height = height;
        this.margin = margin;
        let innerWidth = this.width - this.margin[2] - this.margin[3];
        let innerHeight = this.height - this.margin[0] - this.margin[1];
        this.svg = d3.select(container).append('svg').classed('donut', true)
                    .attr('width', this.width).attr('height', this.height) ;
        this.chart = this.svg.append('g')
            .attr('transform', `translate(${this.width / 2},${this.margin[0] + innerHeight / 2})`);
        this.arcs = this.chart.selectAll('path.arc');
        this.title = this.svg.append('text').classed('title', true)
            .attr('transform', `translate(${this.width / 4+20},${20})`).text("Health Expenditure Distribution"); 
        this.legends = this.svg.append('g').classed('legends', true);
        this.tooltip = this.svg.append('g').classed('tooltip', true);
        this.pieGenerator = d3.pie().padAngle(0.02).value(d => d.Value);    
        let size = Math.min(innerWidth, innerHeight);
        this.arcGenerator = d3.arc().outerRadius(size / 2 - 20).innerRadius(size / 4);
        this.labelGenerator = d3.arc().innerRadius(size / 2 - 20).outerRadius(size / 2);
        this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    }


    /**
     * The arcTween(d) method creates a transition effect when updating the arcs of the donut chart. 
     */
    arcTween(d) {
      //update the arc path over a specified duration
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return t => this.arcGenerator(interpolate(t));
    }

    /**
     * The updateArcs() method updates the arcs of the donut chart based on the provided data.
     */
    updateArcs(){
        this.arcs = this.arcs
            .data(this.data, d => d.Series_Name)
            .join(enter => enter.append('path')
                 .classed('arc', true)
                 .attr('fill', d => this.colorScale(d.data.Series_Name))
                 .attr('d', d => {this._current = d;
                        return this.arcGenerator(d);})
                 .call(enter => enter.transition().duration(750).attrTween('d', this.arcTween.bind(this))),
                        update => update.call(update => update.transition().duration(750).attrTween('d', this.arcTween.bind(this))),
                        exit => exit.call(exit => exit.transition().duration(750).attrTween('d', this.arcTween.bind(this))).remove()
             );
    }

    /**
     * The updateEvents() method sets up event listeners for mouseover and mouseout events on the arcs of the donut chart.
     */
    updateEvents(){
      let  valueFormat = d3.format('.2f');
      
      this.arcs.on('mouseover', (event, d) => {
              let [x, y] = this.arcGenerator.centroid(d);
              let formatTooltip = d => `${d.data.Series_Name}: ${valueFormat(d.data.Value)}`;
              // Hide all other tooltips
              d3.selectAll('.tooltip').style('opacity', 0);
          
              // Highlight selected arc and increase its size
              d3.select(event.target)
                  .transition().duration(300)
                  .attr('d', d => {
                      const radius = this.arcGenerator.outerRadius()(d) + 5;
                      const arc = d3.arc()
                          .innerRadius(this.arcGenerator.innerRadius()(d))
                          .outerRadius(radius + 5);
                      return arc(d);
                  }
                  
                  );
              
              d3.select(event.target.parentNode)
                  .append('text')
                  .attr('class', 'tooltip')
                  .attr('x', x)
                  .attr('y', y)
                  .text(`${d.data.Series_Name}: ${valueFormat(d.data.Value)}`);    
          })  
          .on('mouseout', (event, d) => {
              // Remove highlight and restore arc size
              d3.select(event.target)
                  .transition().duration(200)
                  .attr('d', d => {
                      const radius = this.arcGenerator.outerRadius()(d) ;
                      const arc = d3.arc()
                          .innerRadius(this.arcGenerator.innerRadius()(d))
                          .outerRadius(radius);
                      return arc(d);
                  });
        
              // Remove tooltip 
              d3.selectAll('.tooltip').style('opacity', 0);
          });
  }

    /**
     * The updateLegend() method creates legends for each data point in the donut chart.
     */
    updateLegend(){
        this.legends = this.legends.selectAll('.legend').data(this.data)
            .enter().append('g').classed('legend', true)
            .attr('transform', (d, i) => {
                  const row = Math.floor(i / 2); 
                  const col = i % 2; 
                  const x = col * 310 ; 
                  const y = row * 20 ; 
            return `translate(${x},${y})`;});

        // Append rectangle for color indicator
        this.legends.append('rect').attr('width', 10).attr('height', 10).attr('x', 5).attr('y',360)
            .attr('fill', d => this.colorScale(d.data.Series_Name)); 

        // Append text for label
        this.legends.append('text').attr('x', 15).attr('y',370).text(d => d.data.Series_Name);
    }

    /**
       * The handleUnavailableData() method adds a text element to the chart to 
       * indicate that there is no data available for plotting the lines.
       */
    handleUnavailableData(){
      this.chart.append("text").classed("noData", true).text("Data Not Available")
          .attr("x", 10).attr("y", 20);
      return this;
  }
  
  /**
   * The render(dataset) method renders the donut chart based on the provided data. 
   */
    render(dataset){
        // Remove existing elements
        this.chart.selectAll('*').remove();
        this.legends.selectAll('.legend').remove();
        
       //Check if data is null if true then the "no data available" message is displayed else chart is rendered
        let zeroData = dataset.every(d => d.Value === 0);
        if(zeroData){
          this.handleUnavailableData();
        }else{
            // Update scales, bars, legend, tooltips and events
            this.data = this.pieGenerator(dataset);  
            this.sum = d3.sum(dataset, d => d.Value);
            this.updateLegend();
            this.updateArcs();
            this.updateEvents(); 
        }

        return this;
    }
}