'use strict';

// IIFE
(function () {

    // Init data
  /*  let data = [];

    // Fetch json data
    d3.json('/load_data', (d) => {

        return d;
    }).then((d) => {

        // Redefine data
        data = d['users'];

        createVis();
    }).catch((err) => {

        console.error(err);
    });
*/
createVis();
    /*
     Function :: createVis()
     */
    function createVis() {

        // Get svg
        const svg = d3.select('#moviePlot1');

        //Config
        const labels_font_size = 16;
        const margin = {'top': 60, 'right':30, 'bottom': 20, 'left': 10+labels_font_size};
        const svg_dx = +svg.attr('width');
        const svg_dy = +svg.attr('height');
        const plot_dx = svg_dx - (margin.right + margin.left);
        const plot_dy = svg_dy - (margin.top + margin.bottom);
       

        // create and position container
        const container = svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${margin.left}px, ${margin.top}px)`);

        //Todo: This will need to be extracted from the data once we have the file.
        const colors = ["red", "blue", "green", "orange", "brown", "black"];
        const dataset=[];

        for (var i = 0; i < 1000; i++) { 
            dataset[i] = [random_item(colors), Math.floor(Math.random()*300000000)];
        }
        console.log(dataset);

        //Todo: This will need to be extracted and sorted from the dataset at some point
        const colorRects = ["red", "blue", "green", "orange", "brown", "black"];

        //x Scale
        const scX = d3.scaleLinear()
            .domain(d3.extent(dataset, (d) => {
                return d[1];
            }))
            .range([0, plot_dx]);

        //y Scale
        const scY = d3.scaleLinear()
            .domain([0, dataset.length])
            .range([0, plot_dy]);

        //Handle Axis
        const xAxis = container.append('g')
            .attr('transform', 'translate(0, -20)')
            .call(d3.axisTop(scX).ticks(5));

        /*const yAxis = container.append('g')
             .attr('transform', 'translate(-20, 0)')
             .call(d3.axisLeft(scY).ticks(3));
*/
        // Add x-label
        container.append('text')
            .attr('transform', `translate(${plot_dx/2}, ${-margin.top+labels_font_size})`)
            .attr('text-anchor', 'middle')
            .attr('font-size', `${labels_font_size + 'px'}`)
            .text('Movie Income');

        container.append('text')
            .attr("transform", "rotate(-90)")
            .attr("y", `${-margin.left + labels_font_size}`)
            .attr("x", `${-(plot_dy / 2)}`)
            .attr('text-anchor', 'middle')
            .attr('font-size', `${labels_font_size + 'px'}`)
            .text('Dominant Color in Movie Poster');

        //This was used to show color rectangles on the left axis.  
        //However, since the colors are shown in teh plot, there is no need for this.
        /*var rects = container.selectAll("rect")
            .data(colorRects)
            .enter()
            .append("rect")
            .attr("x", -margin.left + 5 + labels_font_size)
            .attr("y", function(d,i) {
                return 5+i*25;
            })
            .attr("width", 50)
            .attr("height", 20)
            .attr("fill", function(d) {
                return d;
            });
        */

        var dataSquares = container.selectAll("#dataSquare")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", function(d,i) {
                return scX(d[1]);
            })
            .attr("y", function(d,i) {
                var y = colorRects.indexOf(d[0]);
                return 5+y*25;
            })
            .attr("width", 2)
            .attr("height", 20)
            .attr("fill", function(d) {
                return d[0];
            })
            .attr("id", "dataSquare");

    function random_item(items)
    {  
        return items[Math.floor(Math.random()*items.length)];
    }
}


})();
