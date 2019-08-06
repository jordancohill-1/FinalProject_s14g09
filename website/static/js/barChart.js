'use strict';

// IIFE
(function() {
    // Init Data
    let color_data = [];
    let movie_data = [];

    // Fetch color json data
    let promise = d3.json('/load_color_data', (d) => { 
    
            return d;
    
    }).then((d) => {
        
        color_data = d['colors'];

        // Now, fetch movie json data        
        let promise = d3.json('/load_movie_data', (d) => { 
        
                return d;
        
        }).then((d) => {
            
            movie_data = d['movies'];

            // Delegate to createVis
            createVis();
       
        }).catch((err) => {
                 
          console.error(err);
                         
        })
   
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
        const dataset = [];
        const movie_scores = [];
        for (var i = 0; i < color_data.length; i++) { 
            dataset[i] = [color_data[i].dominant_color_name];
            movie_scores[i] = [movie_data[i].imdb_score]; 
        }
        
        //Extract colors from dataset
        const colorsArray = [];
        const colorScores = [];
        var color_found = false;
        for (var i = 0; i < dataset.length; i++) {
            color_found = false;
            for (var j=0; j < colorsArray.length; j++) {
                if (dataset[i][0] == colorsArray[j]) {
                    color_found = true;
                    colorScores[j] += Number(movie_scores[i]);
                    break;
                }
            }
            if(color_found == false) {
                colorsArray[colorsArray.length] = dataset[i][0];
                colorScores[colorScores.length] = Number(movie_scores[i]);
            }
        }
        console.log(colorsArray);        
        console.log(colorScores);

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

        for (var i = 0; i < colorScores.length; i++) {
            console.log(bins[i].length);
            colorScores[i] = Math.round(10*(colorScores[i]/bins[i].length))/10;
        }
        console.log(colorScores);

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
            .attr('shape-rendering', 'crispEdges');
            
        const scoreText = container.append('text')
            .text("")
            .attr('class', 'score_text')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'right')
            .attr('y', 25)
            .attr('x', 300);

        const avgScore = container.append('text')
            .text("")
            .attr('class', 'avg_score_text')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'right')
            .attr('y', 50)
            .attr('x', 300);

        bars.on('mouseover', function (d, i) {
            d3.select(this)
                .attr('opacity' , 0.8);

            d3.select('.score_text')
                .text("IMDB scores for " + colorsArray[i] + " colored images:");

            d3.select('.avg_score_text')
                .text("Avg = " + colorScores[i]);

        })
        .on('mouseout', function () {
            d3.select(this)
                .attr('opacity' , 1.0);

            d3.select('.score_text')
                .text("");

            d3.select('.avg_score_text')
                .text("");
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

    }

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
