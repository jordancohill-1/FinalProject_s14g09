'use strict';

// IIFE
(function() {
    // Init Data
    let color_data = [];
 
    // Fetch color json data
    let promise = d3.json('/load_color_data', (d) => { 
    
            return d;
    
    }).then((d) => {
        
        color_data = d['colors'];
        //console.log("color_data for barchart:", color_data);
        // Delegate to createVis
        createVis();
   
    }).catch((err) => {
             
      console.error(err);
                     
    })

    /*
        Function :: generateColors()
    */

   const colors = [{'color': 'black', 'value': '#1A202C'},
                   {'color': 'gray', 'value': '#A0AEC0'},
                   {'color': 'brown', 'value': '#7B341E'},
                   {'color': 'green', 'value': '#48BB78'},
                   {'color': 'blue', 'value': '#4299E1'},
                   {'color': 'purple', 'value': '#9F7AEA'},
                   {'color': 'white', 'value': '#FFFFFF'},
                   {'color': 'yellow', 'value': '#F6E05E'},
                   {'color': 'red', 'value': '#E53E3E'},
                   {'color': 'pink', 'value': '#FEB2B2'},
                   {'color': 'orange', 'value': '#F6AD55'}]

    function generateColors(colorsArray, i) {
        for (let k = 0; k < colors.length; k++) {
            if (colorsArray[i] == colors[k].color) {
                return colors[k].value
            }
        }
    }

    /*
     Function :: createVis()
     */
    function createVis() {

        // Get svg
        const svg = d3.select('#barChart');

        //Config
        const margin = {'top': 25, 'right': 54, 'bottom': 50, 'left': 10};
        const width = +svg.attr('width') - (margin.right + margin.left);
        const height = +svg.attr('height') - (margin.top + margin.bottom);

        // create and position container
        const container = svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${margin.left}px, ${margin.top}px)`);

        //Extract the color names from the entire data set
        const dataset=[];
        for (var i = 0; i < color_data.length; i++) { 
            dataset[i] = [color_data[i].dominant_color_name];
        }
        
        //Extract colors from dataset
        const colorsArray = [];
        var color_found = false;
        for (var i = 0; i < dataset.length; i++) {
            color_found = false;
            for (var j=0; j < colorsArray.length; j++) {
                if (dataset[i][0] == colorsArray[j]) {
                    color_found = true;
                    break;
                }
            }
            if(color_found == false) {
                colorsArray[colorsArray.length]= dataset[i][0];
            }
        }
        

        //Print the statistics
        printScaledNum('#moviesAnalyzed', dataset.length, "MOVIES ANALYZED");
        printScaledNum('#dominantColors', colorsArray.length, "DOMINANT COLORS");

        const colorMap = [];
        for (var i = 0; i < dataset.length; i++) { 
            colorMap[i] = get_color_index(dataset[i][0], colorsArray);
        }

        //x Scale
        const scX = d3.scaleLinear()
            .domain(d3.extent(colorMap, (d) => {
                return d;
            }))
            .range([0, width]);

        //Histogram
        const histogram = d3.histogram()
            .domain(scX.domain())
            .thresholds(scX.ticks(colorsArray.length));

        const bins = histogram(colorMap);

        //y Scale
        const scY = d3.scaleLinear()
            .domain([0, d3.max(bins, function(d) {
                return d.length;
            })])
            .range([0, height]);

        // Config transition
        const t = d3.transition()
            .duration(250)
            .ease(d3.easeLinear);

        //Create Bars
        const bars = container.selectAll('.bar')
            .data(bins)
            .enter()
            .append('g')
            .attr('class', 'bar')
            .style('transform', (d, i) => {
                return `translate(${i * Math.floor(width / bins.length)}px, ${height - scY(d.length)}px)`;
            });

        // Create rects
        bars.append('rect')
            .attr('width', () => {
                return Math.floor(width*0.8 / bins.length);
            })
            .attr('height', (d) => {
                return scY(d.length);
            })
            .attr('fill', function (d,i) {
                return generateColors(colorsArray, i);
            })
            .attr('stroke', '#1A202C')
            .attr('stroke-width', function(d, i) {
                if (colorsArray[i] == "white") {
                    return 1;
                } else {
                    return 0;
                }
            })
            .attr('shape-rendering', 'crispEdges')
            .on('mouseover', function () {
                d3.select(this)
                    .attr('opacity' , 0.8);
            })
            .on('mouseout', function () {
                d3.select(this)
                    .attr('opacity' , 1.0);
            });


        // Add y-label
        const yLabels = bars.append('text')
            .text(function (d) {
                return d.length;
            })
            .attr('class', 'yLabel')
            .attr('y', -5)
            .attr('x', Math.floor(width / bins.length) / 2)
            .attr('text-anchor', 'middle');

        // Add x-axis
        /*const xAxis = container.append('g')
            .attr('transform', `translate(0, ${height + 5})`)
            .call(d3.axisBottom(scX).ticks(5));
*/

        // Add x-label
        /*container.append('text')
            .attr('transform', `translate(${width/2}, ${height + 45})`)
            .attr('text-anchor', 'middle')
            .text('Age');*/
    }

    /*function random_item(items)
    {  
        return items[Math.floor(Math.random()*items.length)];
    }*/

    function get_color_index(color, colorArray) {
        for (var i = 0; i<colorArray.length; i++) {
            if (colorArray[i] == color) {
                return i;   
            }
        }
    }

    function printScaledNum(id, number, title) {
        
        // Get svg
        const svg = d3.select(id);
        
        //Config
        const margin = {'top': 0, 'right': 0, 'bottom': 0, 'left': 0};
        const width = +svg.attr('width') - (margin.right + margin.left);
        const height = +svg.attr('height') - (margin.top + margin.bottom);

        // create and position container
        const container = svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${margin.left}px, ${margin.top}px)`);

        const data = [{
            "num": number,
            "title": title,
        }];

        // Create a new <text> element for every data element.
        let text = container.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", 0)
            .attr("y", 30);

        // Add a <tspan class="title"> for every data element.
        text.append("tspan")
            .text(d => d.num)
            .attr('class', 'scaled_num') //Tot: Why isn't the font-size being reflected from the CSS file
            .attr("font-size", "36px")
            .attr("font-weight", 700);

        // Add a <tspan class="author"> for every data element.
        text.append("tspan")
            .text(d => d.title)
            .attr("class", "num_title")
            .attr("x", 0)
            .attr("dx", 0)
            .attr("dy", 25)
            .attr("font-size", "18px");
    }

})();
