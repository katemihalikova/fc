d3.json("https://rawgit.com/katemihalikova/fc/master/data.json", function(error, data) {
  if (error) {
    alert("Can't load data..");
    return console.error(error);
  }

  var svgElement = document.querySelector("svg");
  var width = svgElement.clientWidth, height = svgElement.clientHeight;
  var svg = d3.select(svgElement);

  var simulation = d3.forceSimulation()
    .nodes(data.users)
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("charge", d3.forceManyBody()
      .distanceMin(10))
    .force("link", d3.forceLink()
      .id(function(d) {return d.user;})
      .distance(function() {return 50;})
      .links(data.links))
    .on("tick", function() {
      users
        .attr("cx", function(d) {return d.x;})
        .attr("cy", function(d) {return d.y;});
      links
        .attr("x1", function(d) {return d.source.x;})
        .attr("y1", function(d) {return d.source.y;})
        .attr("x2", function(d) {return d.target.x;})
        .attr("y2", function(d) {return d.target.y;});
    });

  var links = svg.selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
      .classed("pending", function(d) {return d.pending;});

  var drag = d3.drag()
    .on("start", function(d) {
      simulation.alphaTarget(0.5);
      simulation.restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", function(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    })
    .on("end", function(d) {
      simulation.alphaTarget(0);
      delete d.fx;
      delete d.fy;
    });

  var users = svg.selectAll("circle")
    .data(data.users)
    .enter()
    .append("circle")
      .attr("r", 7)
      .attr("class", function(d) {return d.sunOrMoon;})
      .call(drag);
  users.append("title")
    .text(function(d) {return "@" + d.user + "\n" + d.nickname + "\n" + d.fc;});
});
