/'use strict';

// IIFE
(function() {
    // Init Data
    let data = [];
 
    // Fetch json data
    let promise = d3.json('/load_data', (d) => {
         
            return d;
    }).then((d) => {
        
        data = d['movies'];
        
        // Delegate to createVis
            createVis();
    }).catch((err) => {
             
      console.error(err);
                     
    })

   
//console.log(color);
    /*
     Function :: createVis()
     */
    function createVis() {

       // Get svg
        const svg = d3.select('#donutChart');

        //Config
        const margin = {'top': 20, 'right': 20, 'bottom': 20, 'left': 20};
        const width = +svg.attr('width') - (margin.right + margin.left);
        const height = +svg.attr('height') - (margin.top + margin.bottom);
        const radius = Math.min(width, height) / 2 - margin.left;  //This needs to take into consideraiton whether the minimum is the width or height
 
        // create and position container
        const container = svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${margin.left + width/2}px, ${margin.top + height/2}px)`);

        const colorScale = d3.scaleOrdinal()
            .domain(data.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

        var arcGenerator = d3.arc().innerRadius(radius * 0.67).outerRadius(radius);


        var pieGenerator = d3.pie()
            .padAngle(0.005)
            .sort(null)
            .value(d => d.value);

        const arcs = pieGenerator(data);

        container.selectAll("pie")
            .data(arcs)
            .join("path")
            .attr("fill", d => colorScale(d.data.name))
            .attr('class','pie')
            .attr("d", arcGenerator);
            /*.append("title")
            .text(d => `Hello: ${d.data.dominant_color_name}`);

        container.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(arcs)
            .join("text")
            .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
            .call(text => text.append("tspan")
                .attr("y", "-0.4em")
                .attr("font-weight", "bold")
                .text(d => d.data.name))
            .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .attr("fill-opacity", 0.7)
                .text(d => d.data.value.toLocaleString()));*/



       /* var jsonData = d3.nest()
            .key(function(d) { return d.prog_lang; })
            .rollup(function(v) { return v.length; })
            .entries(data);
        
        //console.log(JSON.stringify(jsonData));
        
        const numProgrammers = jsonData.map(function(d, i) {
            return d.value;//[d.key, d.value];
        });
        const lang = jsonData.map(function(d, i) {
            return d.key;//[d.key, d.value];
        });

        var arcData = pieGenerator(numProgrammers);*/

        // set the color scale
        //const colorScale = d3.scaleOrdinal()
         // .range(['#1b7688','#1b7676','#f9d057','#f29e2e','#9b0a0a', '#d7191c']);    

        /*var arcGenerator = d3.arc()
            .innerRadius(radius - 20)
            .outerRadius(radius);

        var arcGeneratorOver = d3.arc()
            .innerRadius(radius * 0.67)
            .outerRadius(radius - 1);

        const pies = container.selectAll('.pie')
            .data(arcData)
            .enter()
            .append('path')
            .attr('class','pie')
            .attr('d', arcGenerator)
            .attr('fill', function(d, i) {
                    return colorScale(i);
                 });
        
        container.append('text')
            //.text('Samer')
            .attr('class', 'name-text')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle');

        container.append('text')
            .attr('class', 'value-text')
            .attr('y', 20)
            .attr('text-anchor', 'middle');

        pies.on('mouseover', function (d, i) {
                

                d3.select(this)
                .transition()
                .attr("d",arcGeneratorOver);
                
                d3.select('.name-text')
                    .text(lang[i]);

                d3.select('.value-text')
                    .text(numProgrammers[i]);
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("d", arcGenerator);
                d3.select('.name-text')
                    .text('');
                d3.select('.value-text')
                    .text('');
            });
*/

var setCenterText = function(thisDonut) {
            var sum = d3.sum(thisDonut.selectAll('.clicked').data(), function(d) {
                return numProgrammers(d.data.key);
            });

            thisDonut.select('.value')
                .text(function(d) {
                    return (sum)? sum.toFixed(1) + d.unit
                                : d.total.toFixed(1) + d.unit;
                });
            thisDonut.select('.percentage')
                .text(function(d) {
                    return (sum)? (sum/d.total*100).toFixed(2) + '%'
                                : '';
                });
        }

    }

})();