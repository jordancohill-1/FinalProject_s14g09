'use strict';

// IIFE
(function() {
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
        const svg = d3.select('#facesChart');

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

        //Extract the dominant colors and imdb scores
        const dataset=[];
        for (var i = 0; i < face_data.length; i++) { 
            dataset[i] = [face_data[i].num_faces, movie_data[i].imdb_score];
        }
        console.log(dataset);

        //Find unique colors and scores.  IF color/imdb_score combination had been found before, increment a number of occurence 
        //for the combination value 
        const new_dataset =[];
        var data_duplicate=false;
        for (var i = 0; i < dataset.length; i++) { 
            data_duplicate = false;
            for (var j = 0; j < new_dataset.length; j++) { 
                if ((dataset[i][0] == new_dataset[j][0]) && (dataset[i][1] == new_dataset[j][1])) {
                    new_dataset[j][2] += 1;
                    data_duplicate = true;
                    break;
                }
            }
            if(data_duplicate == false) {
                new_dataset[new_dataset.length] = [dataset[i][0], dataset[i][1], 1, color_data[i].dominant_color_rgb];
            }
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
        const scX = d3.scaleLinear()
            .domain(d3.extent(new_dataset, (d) => {
                return d[1];
            }))
            .range([0, plot_dx]);

        //y Scale
        const scY = d3.scaleLinear()
            .domain([0, new_dataset.length])
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
            .text('IMDB Score');

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
            .data(new_dataset)
            .enter()
            .append("rect")
            .attr("x", function(d,i) {
                return scX(d[1]);
            })
            .attr("y", function(d,i) {
                var y = colorRects.indexOf(d[0]);
                return 5+y*25;
            })
            .attr("width", function(d) {
                
                return d[2];
            })
            .attr("height", 20)
            .attr("fill", function(d) {
                console.log(d[3]);
                return ("rgb" + d[3]);
            })
            .attr("stroke", "rgba(150,150,150,0.7)")
            .attr("stroke-width", function(d) {
                if(d[0] == "white") {
                    return 1;
                }
                else {
                    return 0;
                }
                print
            })
            .attr("id", "dataLine");

    function random_item(items)
    {  
        return items[Math.floor(Math.random()*items.length)];
    }
}


})();
