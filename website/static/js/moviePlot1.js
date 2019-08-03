'use strict';

// IIFE
(function () {

    // Init data
    let color_data = [];
    let movie_data = [];

    // Fetch json data
    d3.csv("static/data/dominantColors.csv")
        .then((d) => {

// Redefine data
        color_data = d;

        //console.log(d);
        //console.log("Color Data = ",  color_data);
    }).catch((err) => {

        console.error(err);
    });

    // Fetch json data
    d3.json("static/data/movie_budget.json")
        .then((d) => {

        // Redefine data
        movie_data = d;

        //console.log(d);
        //console.log("Movie Data = ",  movie_data);
        //createVis();
    }).catch((err) => {

        console.error(err);
    });
    /*let data = [];
    
    d3.json("/static/data/movie_budget.json", function(d) {
        return d;
    }).then((d) => {
 // Redefine data
        data = d['domestic_gross'];
console.log(data);
        createVis();
    }).catch((err) => {

        console.error(err);
    });

console.log(data);*/

//This section should work once we cna load data from database
   let data = [];

    // Fetch json data
    d3.json('/load_data', (d) => {
        return d;
    }).then((d) => {

        console.log("loaded data: " , d);
        // Redefine data
        data = d['movies'];

        createVis();
    }).catch((err) => {

        console.error(err);
    });

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
        const color_dataset=[];

        for (var i = 0; i < color_data.length; i++) { 
            color_dataset[i] = [color_data[i].dominant_color_name, Math.floor(Math.random()*300000000)];
        }
        //console.log(dataset);

        //Extract colors from dataset
        const colorRects = [];
        var color_found=false;
        for (var i = 0; i < color_dataset.length; i++) {
            color_found = false;
            for (var j=0; j < colorRects.length; j++) {
                if (color_dataset[i][0] == colorRects[j]) {
                    color_found = true;
                    break;
                }
            }
            if(color_found == false) {
                colorRects[colorRects.length]= color_dataset[i][0];
            }
        }
        console.log(colorRects);

        //x Scale
        const scX = d3.scaleLinear()
            .domain(d3.extent(color_dataset, (d) => {
                return d[1];
            }))
            .range([0, plot_dx]);

        //y Scale
        const scY = d3.scaleLinear()
            .domain([0, color_dataset.length])
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
            .text('Domestic Gross');

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

        container.selectAll("#dataLine")
            .data(color_dataset)
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
            .attr("id", "dataLine");

    function random_item(items)
    {  
        return items[Math.floor(Math.random()*items.length)];
    }
}


})();
