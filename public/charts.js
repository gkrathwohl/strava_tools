
function chart1(){
    var margin = {top: 20, right: 40, bottom: 80, left: 40},
      width = 1000 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
    
    var barSpace = (width / newData.length)
    var barWidth = (width / newData.length) -4;

    // Set up the domain
    var x = d3.time.scale()
      // .domain([newData[0].key, newData[newData.length-1].key])
      .domain([d3.time.day.offset(new Date(), -60), new Date()])
      .range([0, width]);


    var y = d3.scale.linear()
      .range([height, 0])
      .domain([0, d3.max(newData, function(d) { return d.sum; })]);
    
    var svg = d3.select(".chart1").append("svg")
      .attr("class", "chart")
      .classed("chart1", true)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
    
    //Axis

    // x axis
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(d3.time.days, 1)
      .tickFormat(d3.time.format('%a %b %d -'))
      .tickSize(0)
      .tickPadding(8);

    var xAxisG = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height-7) + ")")
      .call(xAxis)
      .selectAll("text")  
                .style("text-anchor", "end")
                .style("font-size","12px")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d) {
                    return "rotate(-65)" 
                  });

    // y axis
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10, "miles");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("miles");

    // right hand axis
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+(width+40)+",0)")
      .call(yAxis)



    // lines
    var mean = y(d3.mean(newData, function(d){return d.sum}));
    svg.append("g")
      .attr("class", "mean")
    .append('line')
      .attr({ x1: 0, y1: mean, x2: width, y2: mean })

    // var min = y(d3.min(newData, function(d){return d.sum}));
    // svg.append("g")
    //   .attr("class", "min")
    // .append('line')
    //   .attr({ x1: 0, y1: min, x2: width, y2: min })
    //   .style("stroke", "#000");

    // var max = y(d3.max(newData, function(d){return d.sum}));
    // svg.append("g")
    //   .attr("class", "max")
    // .append('line')
    //   .attr({ x1: 0, y1: max, x2: width, y2: max })
    //   .style("stroke", "#000");

    // bars
    svg.selectAll(".bar")
      .data(newData)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) { return "translate(" + ((i * barSpace) + 10) + ",0)"; })
    .append("rect")
      .attr("width", barWidth)
      .attr("y", function(d) { return y(d.sum); })
      .attr("height", function(d) { return height - y(d.sum); })
      .on("mouseover", function(){mouse(d3.event.target, true)})
      .on("mouseout", function(){mouse(d3.event.target, false)})

    // sums
    var labels = svg.selectAll(".label")
      .data(newData)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + ((i * barSpace) + 15) + ",0)"; })
    .append('text')
      .text(function(d){return d.sum.toFixed(1)})
      .attr("y", function(d) { return y(d.sum)-3; })
      .attr("x", function(d) { return 0; })
      .attr("class", "sum")
      .style("font-size","11px")
      .style("font-weight", "bold")
      .classed('hidden', true);


    // highlighting (date, bar, sum)
    function mouse(event, notCurrent){

        // bar
        if(notCurrent){
          d3.select(".chart1").selectAll(".bar rect").classed("dim", false);
          d3.select(event).classed("dim", true);
        }else{ // if leaving, make all dark
          d3.select(".chart1").selectAll(".bar rect").classed("dim", false);
        }

		console.log("hi");
        // // date
        // xAxisG[0].forEach(function(label){
          // if (label['__data__'].getTime() == event['__data__'].key.getTime()){
            // d3.select(label).classed("highlight", bool);
          // }
        // });

        // // sum
        // labels[0].forEach(function(label){
          // if (label['__data__'].key.getTime() == event['__data__'].key.getTime()){
            // d3.select(label).classed("hidden", !bool);
          // }else{
            // // console.log(label['__data__']);
          // }
        // });
     }
}


function chart2(){
    var margin = {top: 20, right: 40, bottom: 80, left: 40},
      width = 1000 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
    
    var barSpace = (width / newData.length)
    var barWidth = (width / newData.length) -4;

    // Set up the domain
    var x = d3.time.scale()
      // .domain([newData[0].key, newData[newData.length-1].key])
      .domain([d3.time.day.offset(new Date(), -60), new Date()])
      .range([0, width]);


    var y = d3.scale.linear()
      .range([height, 0])
      .domain([0, d3.max(newData, function(d) { return d.values; })]);
    
    var svg = d3.select(".chart2").append("svg")
      .attr("class", "chart")
      .classed("chart2", true)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
    
    //Axis

    // x axis
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .ticks(d3.time.days, 1)
      .tickFormat(d3.time.format('%a %b %d -'))
      .tickSize(0)
      .tickPadding(8);

    // dates
    var xAxisG = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height-7) + ")")
      .call(xAxis)
      .selectAll("text")  
                .style("text-anchor", "end")
                .style("font-size","12px")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d) {
                    return "rotate(-65)" 
                  });

    // y axis
    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10, "miles");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("miles");

    // right hand axis
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+(width+40)+",0)")
      .call(yAxis)



    // lines
    var mean = y(d3.mean(newData, function(d){return d.values}));
    svg.append("g")
      .attr("class", "mean")
    .append('line')
      .attr({ x1: 0, y1: mean, x2: width, y2: mean })

    // var min = y(d3.min(newData, function(d){return d.sum}));
    // svg.append("g")
    //   .attr("class", "min")
    // .append('line')
    //   .attr({ x1: 0, y1: min, x2: width, y2: min })
    //   .style("stroke", "#000");

    // var max = y(d3.max(newData, function(d){return d.sum}));
    // svg.append("g")
    //   .attr("class", "max")
    // .append('line')
    //   .attr({ x1: 0, y1: max, x2: width, y2: max })
    //   .style("stroke", "#000");

    // bars
    svg.selectAll(".bar")
      .data(newData)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) { return "translate(" + ((i * barSpace) + 10) + ",0)"; })
    .append("rect")
      .attr("width", barWidth)
      .attr("y", function(d) { return y(d.values); })
      .attr("height", function(d) { return height - y(d.values); })
      .on("mouseover", function(){mouseIn(d3.event.target, true)})
      .on("mouseout", function(){mouse(d3.event.target, false)})

    // bar labels
    var labels = svg.selectAll(".label")
      .data(newData)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(" + ((i * barSpace) + 15) + ",0)"; })
    .append('text')
      .text(function(d){return d.values.toFixed(1)})
      .attr("y", function(d) { return y(d.values)-3; })
      .attr("x", function(d) { return 0; })
      .attr("class", "sum")
      .style("font-size","11px")
      .style("font-weight", "bold")
      .classed('hidden', true);


    // highlighting (date, bar, sum)
    function mouseIn(event, current){

		console.log("sc");
		
	
        if(current){
          d3.select(".chart1").selectAll(".bar rect").classed("dim", false);
          d3.select(event).classed("dim", true);
        }else{ // if leaving, make all dark
          d3.select(".chart1").selectAll(".bar rect").classed("dim", true);
        }

        // // date
        // xAxisG[0].forEach(function(label){
          // if (label['__data__'].getTime() == event['__data__'].key.getTime()){
            // d3.select(label).classed("highlight", bool);
          // }
        // });

        // // sum
        // labels[0].forEach(function(label){
          // if (label['__data__'].key.getTime() == event['__data__'].key.getTime()){
            // d3.select(label).classed("hidden", !bool);
          // }else{
            // // console.log(label['__data__']);
          // }
        // });
	}
}
