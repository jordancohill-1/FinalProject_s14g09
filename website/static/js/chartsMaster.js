'use strict';

// IIFE
(function() {
    // Init Data
    let color_data = [];
    let movie_data = [];
 
    // Fetch color data
    let promise = d3.json('/load_color_data', (d) => { 
    
            return d;
    
    }).then((d) => {
        
        color_data = d['colors'];
        
        //Now get the movie data
        let promise = d3.json('/load_movie_data', (d) => { 
    
                return d;
        
        }).then((d) => {
            
            movie_data = d['movies'];
            
            createVis();
            //createMovieVis();
       
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

        // Get barchart svg
        const barchart_svg = d3.select('#barChart');

        // Get movie svg
        const movie_svg = d3.select('#moviePlot');
        
        //Config
        const margin = {'top': 25, 'right': 54, 'bottom': 50, 'left': 10};
        const width = +barchart_svg.attr('width') - (margin.right + margin.left);
        const height = +barchart_svg.attr('height') - (margin.top + margin.bottom);

        // create and position barchart_container
        const barchart_container = barchart_svg.append('g')
            .attr('class', 'barchart_container')
            .style('transform', `translate(${margin.left}px, ${margin.top}px)`);

        //Extract the color names from the entire data set
        var dataset = [];
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
            colorScores[i] = Math.round(10*(colorScores[i]/bins[i].length))/10;
        }

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
        const bars = barchart_container.selectAll('.bar')
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
            
        const scoreText = barchart_container.append('text')
            .text("")
            .attr('class', 'score_text')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'right')
            .attr('y', 25)
            .attr('x', 300);

        const avgScore = barchart_container.append('text')
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

            movieVis(movie_svg, colorsArray[i]);
        })
        .on('mouseout', function () {
            d3.select(this)
                .attr('opacity' , 1.0);

            d3.select('.score_text')
                .text("");

            d3.select('.avg_score_text')
                .text("");

            movieVis(movie_svg, "all");
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

        movieVis(movie_svg, "all");
        

    }

    function movieVis(movieSVG, color) {
        // Get movie_svg
        const movie_svg = movieSVG

        //Config
        const labels_font_size = 16;
        const movie_margin = {'top': 60, 'right':200, 'bottom': 20, 'left': 10+labels_font_size};
        const movie_svg_dx = +movie_svg.attr('width');
        const movie_svg_dy = +movie_svg.attr('height');
        const movie_plot_dx = movie_svg_dx - (movie_margin.right + movie_margin.left);
        const movie_plot_dy = movie_svg_dy - (movie_margin.top + movie_margin.bottom);
       

        // create and position movie_container
        const movie_container = movie_svg.append('g')
            .attr('class', 'movie_container')
            .style('transform', `translate(${movie_margin.left}px, ${movie_margin.top}px)`);

        //Extract the dominant colors and imdb scores
        var dataset=[];
        var j=0;
        for (var i = 0; i < color_data.length; i++) { 
            if (color == "all") {
                dataset[i] = [color_data[i].dominant_color_name, movie_data[i].imdb_score];
            } else {
                if (color_data[i].dominant_color_name == color) {
                    dataset[j] = [color_data[i].exact_color_name, movie_data[i].imdb_score];
                    j++;
                }
            }
        }
        
        const new_dataset =[];
        var line_offset = 1;
        for (var i = 0; i < dataset.length; i++) { 
            line_offset = 1;
            for (var j = 0; j < new_dataset.length; j++) { 
                if ((dataset[i][0] == new_dataset[j][0]) && (dataset[i][1] == new_dataset[j][1])) {
                    line_offset += 1;
                }
            }
            new_dataset[new_dataset.length] = [dataset[i][0], dataset[i][1], line_offset, color_data[i].dominant_color_rgb, movie_data[i].images_path];
        }        
console.log(new_dataset);

        //Extract colors from dataset
        const colorRects = [];
        var color_found=false;
        for (var i = 0; i < dataset.length; i++) {
            color_found = false;
            for (var j=0; j < colorRects.length; j++) {
                if (dataset[i][0] == colorRects[j]) {
                    color_found = true;
                    break;
                }
            }
            if(color_found == false) {
                colorRects[colorRects.length]= dataset[i][0];
            }
        }
console.log(colorRects);

        //x Scale
        const movie_scX = d3.scaleLinear()
            .domain(d3.extent(new_dataset, (d) => {
                return d[1];
            }))
            .range([0, movie_plot_dx]);

        //y Scale
        const movie_scY = d3.scaleLinear()
            .domain([0, new_dataset.length])
            .range([0, movie_plot_dy]);

        //Handle Axis
        const xAxis = movie_container.append('g')
            .attr('transform', 'translate(0, -20)')
            .call(d3.axisTop(movie_scX).ticks(5));

        // Add x-label
        movie_container.append('text')
            .attr('transform', `translate(${movie_plot_dx/2}, ${-movie_margin.top+labels_font_size})`)
            .attr('text-anchor', 'middle')
            .attr('font-size', `${labels_font_size + 'px'}`)
            .text('IMDB Score');

        movie_container.append('text')
            .attr("transform", "rotate(-90)")
            .attr("y", `${-movie_margin.left + labels_font_size}`)
            .attr("x", `${-(movie_plot_dy / 2)}`)
            .attr('text-anchor', 'middle')
            .attr('font-size', `${labels_font_size + 'px'}`)
            .text('Dominant Color in Movie Poster');

        movie_container.selectAll("#dataLine").remove();

        var dataLines = movie_container.selectAll("#dataLine")
            .data(new_dataset)
            .enter()
            .append("rect")
            .attr("x", function(d,i) {
                return movie_scX(d[1])+d[2]-1;
            })
            .attr("y", function(d,i) {
                var y = colorRects.indexOf(d[0]);
                return 5+y*25;
            })
            .attr("width", function(d) {
                
                return 1;//d[2];
            })
            .attr("height", 20)
            .attr("fill", function(d) {
                   var my_color;
                   if (color == "all") { my_color = d[3];} else {my_color = d[1];} 
                return ("rgb" + my_color);
            })
            .attr("stroke", "rgba(150,150,150,0.7)")
            .attr("stroke-width", 0)
            .attr("id", "dataLine");

        const movieImage = movie_container.append("image")
            .attr("x", movie_plot_dx + 20)
            .attr("y", 0)
            .attr("width", 200)
            .attr("height", 300)
            .attr('class', 'movie_image')
            .attr("display", "none");

        const movieScore = movie_container.append('text')
            .text("")
            .attr('class', 'movie_score')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'right')
            .attr('y', 320)
            .attr('x', movie_plot_dx + 20);

        dataLines.on('mouseover', function (d, i) {
            d3.select(this)
                .attr('width' , 3)
                .attr('x',movie_scX(d[1])+d[2]-2);

            d3.select('.movie_score')
                .text("IMDB Score = " + d[1]);

            d3.select('.movie_image')
                .attr("display", "block")
                .attr("xlink:href", "https://storage.cloud.google.com/imdbvis/full/" + d[4]);//"/static/images/randoms/" + d[4]);

        })
        .on('mouseout', function (d) {
            d3.select(this)
                .attr('width' , 1)
                .attr('x',movie_scX(d[1])+d[2]-1);

            d3.select('.movie_score')
                .text("");

            d3.select('.movie_image')
                .attr("display", "none");
        });
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
