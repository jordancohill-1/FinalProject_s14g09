// Used the following for the hover action: http://bl.ocks.org/erichoco/6694616
//https://alignedleft.com/tutorials/d3/axes

'use strict';

// IIFE
(function () {

    // Init Data
    let face_data = [];
    let movie_data = [];
    let color_data = [];
    // Fetch face data
    let promise = d3.json('/load_face_data', (d) => { 
            
            return d;
    
    }).then((d) => {
        
        face_data = d['faces'];
        //console.log("Faces = ", face_data);
        
        //Now get the movie data
        let promise = d3.json('/load_movie_data', (d) => { 
    
                return d;
        
        }).then((d) => {
            
            movie_data = d['movies'];
            
            //And now, the color data
            let promise = d3.json('/load_color_data', (d) => { 
        
                    return d;
            
            }).then((d) => {
                
                color_data = d['colors'];
                
                // Delegate to createVis
                createVis();
           
            }).catch((err) => {
                     
              console.error(err);
                             
            })
       
        }).catch((err) => {
                 
          console.error(err);
                         
        })
   
    }).catch((err) => {
             
      console.error(err);
                     
    })

    /*
     Function :: createVis()
     */
    function createVis() {


         // Get svg
        const svg = d3.select('#scatterplot');

        //Config
        const margin = {'top': 10, 'right': 10, 'bottom': 50, 'left': 25};
        const svg_dx = +svg.attr('width');
        const svg_dy = +svg.attr('height');
        const plot_dx = svg_dx - (margin.right + margin.left);
        const plot_dy = svg_dy - (margin.top + margin.bottom);

        // create and position container
        const container = svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${margin.left}px, ${margin.top}px)`);

        //Extract the dominant colors and imdb scores
        const dataset=[];
        for (var i = 0; i < face_data.length; i++) { 
            dataset[i] = [color_data[i].dominant_color_name, face_data[i].num_faces, movie_data[i].imdb_score];
        }
        console.log(dataset);

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
        console.log("Colors Array = ", colorsArray);

        const colorMap = [];
        for (var i = 0; i < dataset.length; i++) { 
            colorMap[i] = get_color_index(dataset[i][0], colorsArray);
        }
        console.log("Colors Map = ", colorMap);

        //Find unique colors and scores.  IF color/imdb_score combination had been found before, increment a number of occurence 
        //for the combination value 
        /*const new_dataset =[];
        var data_duplicate=false;
        for (var i = 0; i < dataset.length; i++) { 
            data_duplicate = false;
            for (var j = 0; j < new_dataset.length; j++) { 
                if ((dataset[i][0] == new_dataset[j][0]) && (dataset[i][1] == new_dataset[j][1])) {
                    new_dataset[j][3] += 1;
                    data_duplicate = true;
                    break;
                }
            }
            if(data_duplicate == false) {
                new_dataset[new_dataset.length] = [dataset[i][0], dataset[i][1], dataset[i][2], 1, colorMap[i]];
            }
        }
        console.log(new_dataset);
*/
        /*const dataMap = data.map(function(d, i) {
                    return [d.experience_yr, d.hw1_hrs, d.age];
                });

        const dataMap = new_dataset;
*/

        const dataMap = [];
        for (var i = 0; i < dataset.length; i++) { 
            dataMap[i] = [dataset[i][0], dataset[i][1], dataset[i][2], colorMap[i], color_data[i].dominant_color_rgb];
        }
console.log(dataMap);
/*        var scX = d3.scaleLinear()
            .domain([0, d3.max(dataMap, function(d) { return d[0]; })])
            .range([margin.left + 10, plot_dx]);
  */          
        const scX = d3.scaleLinear()
            .domain([0, d3.max(dataMap, function(d) { return d[3]; })])
            .range([0, plot_dx]);

        var scY = d3.scaleLinear()
            .domain([0, 25])//d3.max(dataMap, function(d) { return d[1]; })])
            .range([plot_dy, 0]);
            
        var scR = d3.scalePow()
            .exponent(5)
            .domain([d3.min(dataMap, function(d) { return d[2]; }) , d3.max(dataMap, function(d) { return d[2]; })])
            .range([1, 10]);

        var circles = container.selectAll("circle")
            .data(dataMap)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return scX(d[3]+1);
            })
            .attr("cy", function(d) {
                return scY(d[1]);
            })
            .attr("r", function(d) {
                return scR(d[2]);
            })
            .attr("class", "non_brushed")
            .attr("fill", function(d){ return ("rgb" + d[4]);});

        //Handle Axis
        const xAxis = container.append('g')
            .attr('transform', `translate(0, ${plot_dy + margin.top})`)
            .call(d3.axisBottom(scX).ticks(5));

        const yAxis = container.append('g')
            .attr("id", "axis_y")
            .attr('transform', `translate(${margin.left/2}, 0)`)
            .call(d3.axisLeft(scY).ticks(3));

        // Add x-label
        container.append('text')
            .attr('transform', `translate(${plot_dx/2}, ${plot_dy + margin.top + 30})`)
            .attr('text-anchor', 'middle')
            .text('Color Group');

        container.append('text')
            //.attr("transform", "rotate(-90) translate(0, 15)")
            .attr("transform", "rotate(-90)")
            .attr("y", -10)
            .attr("x",0 - (plot_dy / 2))
            .attr('text-anchor', 'middle')
            .text('Number of Faces');

        function highlightBrushedCircles() {

                if (d3.event.selection != null) {

                    // revert circles to initial style
                    circles.attr("class", "non_brushed");

                    var brush_coords = d3.brushSelection(this);

                    // style brushed circles
                    circles.filter(function (){

                           var cx = d3.select(this).attr("cx"),
                               cy = d3.select(this).attr("cy");

                           return isBrushed(brush_coords, cx, cy);
                        })
                        .attr("class", "brushed");
        }
            }

        function get_color_index(color, colorArray) {
            for (var i = 0; i<colorArray.length; i++) {
                if (colorArray[i] == color) {
                    return i;   
                }
            }
        }
        
        function isBrushed(brush_coords, cx, cy) {

             var x0 = brush_coords[0][0] - margin.left,
                 x1 = brush_coords[1][0] - margin.left,
                 y0 = brush_coords[0][1] - margin.top,
                 y1 = brush_coords[1][1] - margin.top;
                 //console.log("xy", x0+margin.left, y0, x1, y1);
                 //console.log (cx, cy);
            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
        }
        
        var brush = d3.brush()
            .on("brush", highlightBrushedCircles);
            //.on("end", displayTable); 

            svg.append("g")
               .call(brush);
    }

})();