//Some of the code for the sunburst was from https://observablehq.com/@d3/zoomable-sunburst

'use strict';

// IIFE
(function () {

    // Init data
    let data = [];
    let color_data = [];
    let movie_data = [];


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
/*    d3.json("static/data/movie_budget.json")
        .then((d) => {

// Redefine data
        movie_data = d;

        //console.log(d);
        console.log("Movie Data = ",  movie_data);
        createVis();
    }).catch((err) => {

        console.error(err);
    });*/
        // Init data
    //let data = [];
    
    // Fetch json data
    data = d3.json("https://raw.githubusercontent.com/d3/d3-hierarchy/v1.1.8/test/data/flare.json", function(d) {
        return d;
    }).then((d) => {
        // Redefine data
        data = d;//['domestic_gross'];
        //console.log(data);
        createVis();
    }).catch((err) => {
        console.error(err);
    });

    //console.log(data);
/*   let data = [];

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
//createVis();
    /*
     Function :: createVis()
     */
    function createVis() {

        // Get svg
        const svg = d3.select('#sunburstChart');
        
        //Config
        const labels_font_size = 16;
        const margin = {'top': 20, 'right':20, 'bottom': 20, 'left': 20};
        const svg_dx = +svg.attr('width');
        const svg_dy = +svg.attr('height');
        const plot_dx = svg_dx - (margin.right + margin.left);
        const plot_dy = svg_dy - (margin.top + margin.bottom);
        const radius = Math.min(plot_dx, plot_dy) / 4 - margin.left;  //This needs to take into consideraiton whether the minimum is the width or height
 
        svg.attr("viewBox", [0, 0, plot_dx, plot_dx])
            .style("font", "10px sans-serif");

        // create and position container
        const container = svg.append('g')
            .attr('class', 'container')
            //.attr("viewBox", autoBox)
            .attr("transform", `translate(${plot_dx / 2},${plot_dx / 2})`);

        const color_dataset=[];

        for (var i = 0; i < color_data.length; i++) { 
            color_dataset[i] = [color_data[i].dominant_color_name, color_data[i].exact_color_name];
        }
        
        //Extract colors from dataset
        const colorsArray = [];
        var color_found=false;
        for (var i = 0; i < color_dataset.length; i++) {
            color_found = false;
            for (var j=0; j < colorsArray.length; j++) {
                if (color_dataset[i][0] == colorsArray[j]) {
                    color_found = true;
                    break;
                }
            }
            if(color_found == false) {
                colorsArray[colorsArray.length]= color_dataset[i][0];
            }
        }

        const colorMap = [];
        for (var i = 0; i < color_dataset.length; i++) { 
            colorMap[i] = get_color_index(color_dataset[i][0], colorsArray);
        }

        //console.log(color_dataset);
        //console.log(colorMap);

        const new_color_dataset=[];

        for (var i = 0; i < color_data.length; i++) { 
            new_color_dataset[i] = { dominant_color_name: color_data[i].dominant_color_name,
                                     exact_color_name: color_data[i].exact_color_name};
        }
        //console.log(new_color_dataset);

        const newColorsArray = [];
        //var color_found=false;
        for (var i = 0; i < new_color_dataset.length; i++) {
            color_found = false;
            for (var j=0; j < newColorsArray.length; j++) {
                if ((new_color_dataset[i].dominant_color_name == newColorsArray[j].dominant_color_name) && 
                    (new_color_dataset[i].exact_color_name == newColorsArray[j].exact_color_name))  {
                //if (new_color_dataset[i].domina == newColorsArray[j])  {
                    newColorsArray[j].value +=1;
                    color_found = true;
                    break;
                }
            }
            if(color_found == false) {
                newColorsArray[newColorsArray.length] = {dominant_color_name: new_color_dataset[i].dominant_color_name, 
                                                         exact_color_name: new_color_dataset[i].exact_color_name,
                                                         value: 1};
            //    newColorsArray[newColorsArray.length].value = 1;//newColorsArray[newColorsArray.length][] = 1;
            }
        }
        //console.log("newColorsArray = ", newColorsArray);
        
        const partition = data => {
          const root = d3.hierarchy(data)
              .sum(d => d.value)
              .sort((a, b) => b.value - a.value);
          return d3.partition()
              .size([2 * Math.PI, root.height + 1])
            (root);
        }

        const color = d3.scaleOrdinal(colorsArray);//d3.quantize(d3.interpolateRainbow, data.children.length + 1));

        var format = d3.format(",d"); 

        var arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
            .padRadius(radius * 1.5)
            .innerRadius(d => d.y0 * radius)
            .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

        //d3 = require("d3@5");

        const root = partition(data);

        root.each(d => d.current = d);

        const path = container.append("g")
            .selectAll("path")
            .data(root.descendants().slice(1))
            .join("path")
            .attr("fill", d => { 
                while (d.depth > 1) 
                    d = d.parent; 
                return color(d.data.name); 
            })
            .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("d", d => arc(d.current));

        path.filter(d => d.children)
            .style("cursor", "pointer")
            .on("click", clicked);

        path.append("title")
            .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

        const label = container.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .style("user-select", "none")
            .selectAll("text")
            .data(root.descendants().slice(1))
            .join("text")
            .attr("dy", "0.35em")
            .attr("fill-opacity", d => +labelVisible(d.current))
            .attr("transform", d => labelTransform(d.current))
            .text(d => d.data.name);

        const parent = container.append("circle")
            .datum(root)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("click", clicked);


        function clicked(p) {
            parent.datum(p.parent || root);

            root.each(d => d.target = {
              x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
              x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
              y0: Math.max(0, d.y0 - p.depth),
              y1: Math.max(0, d.y1 - p.depth)
            });

            const t = container.transition().duration(750);

            // Transition the data on all arcs, even the ones that aren’t visible,
            // so that if this transition is interrupted, entering arcs will start
            // the next transition from the desired position.
            path.transition(t)
                .tween("data", d => {
                  const i = d3.interpolate(d.current, d.target);
                  return t => d.current = i(t);
                })
              .filter(function(d) {
                return +this.getAttribute("fill-opacity") || arcVisible(d.target);
              })
                .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
                .attrTween("d", d => () => arc(d.current));

            label.filter(function(d) {
                return +this.getAttribute("fill-opacity") || labelVisible(d.target);
              }).transition(t)
                .attr("fill-opacity", d => +labelVisible(d.target))
                .attrTween("transform", d => () => labelTransform(d.current));
        }

        function arcVisible(d) {
            return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
        }

        function labelVisible(d) {
            return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
        }

        function labelTransform(d) {
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2 * radius;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        }

        function autoBox() {
            const {x, y, width, height} = this.getBBox();
            return [x, y, width, height];
        }

        function get_color_index(color, colorArray) {
           for (var i = 0; i<colorArray.length; i++) {
                if (colorArray[i] == color) {
                    return i;   
                }
            }
        }
    }

})();
