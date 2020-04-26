var units = "Widgets";

// set the dimensions and margins of the graph
var margin = {
        top: 75,
        right: 80,
        bottom: 30,
        left: 75
    },
    width = 600 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

var nodeWidthNum = 50;

// format variables
var formatNumber = d3.format(",.0f"), // zero decimal places
    format = function (d) {
        return formatNumber(d) + " " + units;
    },
    // color = d3.scaleOrdinal(d3.schemeCategory10);
    color = {
        "England" : "#186A3B",
        "Scotland" : "#239B56",
        "Wales" : "#27AE60",
        "Northern Ireland" : "#82E0AA",
        "Female": "#ffa372",
        "Male": "#0f4c81",
        "Other": "#999999"
    }

var formatTwoDecimalPlaces = d3.format(",.2f");

// append the svg object to the body of the page
var svg = d3.select("#sankey").append("svg")
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
    .attr("width", "100%")
    .attr("preserveAspectRatio", "xMinYMin")
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// append topic
var topic1 = svg.append("g")
    .append("text")
    .attr("class", "topic1")

topic1.append("tspan")
    .attr("dy", 20 - margin.top)
    .attr("dx", (nodeWidthNum / 2))
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .text(function (d) {
        return "Number of";
    })

topic1.append("tspan")
    .attr("dy", 40 - margin.top)
    .attr("dx", (nodeWidthNum / 2))
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .text(function (d) {
        return "HE students";
    })

topic1.append("tspan")
    .attr("dy", 60 - margin.top)
    .attr("dx", (nodeWidthNum / 2))
    .attr("x", 0)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .text(function (d) {
        return "in each country";
    })

var topic2 = svg.append("g")
    .append("text")
    .attr("class", "topic2")

topic2.append("tspan")
    .attr("dy", 20 - margin.top)
    .attr("dx", -(nodeWidthNum / 2))
    .attr("x", width)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .text(function (d) {
        return "Number of";
    })

topic2.append("tspan")
    .attr("dy", 40 - margin.top)
    .attr("dx", -(nodeWidthNum / 2))
    .attr("x", width)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .text(function (d) {
        return "students in";
    })


topic2.append("tspan")
    .attr("dy", 60 - margin.top)
    .attr("dx", -(nodeWidthNum / 2))
    .attr("x", width)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "1.2em")
    .style("font-weight", "bold")
    .text(function (d) {
        return "each sex";
    })


/*
*   Sankey diagram with multiple value columns and transition
*   This code was adapted from examples on blockbuilder.org and stackoverflow.com
*   accessed 20-04-2020
*   https://blockbuilder.org/SpaceActuary/2a46e03eb7b7e05f48e6251054501244
*   https://stackoverflow.com/questions/13603832/sankey-diagram-transition
*   Change code by adjust style and appearance of Sankey Diagram
*   Add tooltip to describe more detail about data, Add transition effect when user change new option to filter data.
*/

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(nodeWidthNum)
    .nodePadding(20)
    .size([width, height]);

var path = sankey.link();

/*
*   Tooltip 1st Part
*   This code was adapted from an example on bl.ocks.org
*   accessed 20-04-2020
*   https://bl.ocks.org/tiffylou/88f58da4599c9b95232f5c89a6321992
*   Change code by adjust how to display and style
*/

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip-frame")
    .style("opacity", 0);

/* End of referenced code : Tooltip 1st Part */

var portfolioValues = [];
startingAllocation = 0;
startingAllocationText = "all HE";
startingAllocationTextGroup = {
    0: "all HE",
    1: "undergraduate",
    2: "postgraduate"
};

d3.csv("dataset/sankey-sex-by-country-multi.csv", function (error, data) {
    // console.log(data);
    if (error) throw error;

    graph = {
        "nodes": [],
        "links": []
    };
    data.forEach(function (d, i) {
        var item = {
            source: d.source,
            target: d.target,
            values: []
        };
        for (var j = 0; j < 3; j++) {
            item.values.push(d['value' + j.toString()]);
        }
        portfolioValues.push(item);
        graph.nodes.push({
            "name": d.source
        });
        graph.nodes.push({
            "name": d.target
        });
        graph.links.push({
            source: portfolioValues[i].source,
            target: portfolioValues[i].target,
            value: portfolioValues[i].values[startingAllocation]
        });
    });

    //this handy little function returns only the distinct / unique nodes
    graph.nodes = d3.keys(d3.nest()
        .key(function (d) {
            return d.name;
        })
        .object(graph.nodes)
    );

    // it appears d3 with force layout wants a numeric source and target
    // so loop through each link replacing the text with its index from node
    graph.links.forEach(function (d, i) {
        graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
        graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
        portfolioValues[i].source = graph.links[i].source;
        portfolioValues[i].target = graph.links[i].target;
    });

    // now loop through each nodes to make nodes an array of objects
    // rather than an array of strings
    graph.nodes.forEach(function (d, i) {
        graph.nodes[i] = {
            "name": d
        };
    });

    // construct sankey
    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    /*
    *   Tooltip 2nd Part
    *   This code was adapted from an example on bl.ocks.org
    *   accessed 20-04-2020
    *   https://bl.ocks.org/tiffylou/88f58da4599c9b95232f5c89a6321992
    *   Change code by adjust how to display, data and style
    */
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .style("fill", function (d) {
            // console.log(d);
            return "#999999";
        })
        .style("fill-opacity", function (d) {
            return 0;
        })
        .attr("d", path)
        .style("stroke", function (d) {
            return "#999999";
        })
        .style("stroke-width", function (d) {
            if (d.value == 0) {
                return 0;
            } else {
                return Math.max(3, d.dy);
            }
        })
        .style("stroke-opacity", function (d) {
            return 0.3;
        })
        .sort(function (a, b) {
            return b.dy - a.dy;
        })
        .on("mouseover", function (d) {
            if (d.value != 0) {
                var totalNum = 0;
                d3.event.srcElement.style["stroke-opacity"] = 0.6;

                d.source.sourceLinks.forEach(function (link) {
                    totalNum += parseInt(link.value);
                });
                
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltip.html("<b>" + formatNumber(d.value) + " students</b> " +
                    "or equals <b>" + formatTwoDecimalPlaces(d.value / totalNum * 100) + "%</b><br/>of <b>" + startingAllocationText + "</b> students in <b>" + d.source.name + "</b><br/>answered that they are <b>" + (d.target.name == "Other" ? "other-sex" : d.target.name.toLowerCase()) + "</b> students");
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .style("font-size", "0.8em");
            }
        })
        .on("mouseout", function (d) {
            d3.event.srcElement.style["stroke-opacity"] = 0.3;
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
    /* End of referenced code : Tooltip 2nd Part */

    // add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .call(d3.drag()
            .subject(function (d) {
                return d;
            })
            .on("start", function () {
                this.parentNode.appendChild(this);
            })
            .on("drag", dragmove));

    // add the rectangles for the nodes
    node.append("rect")
        .attr("height", function (d) {
            return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
            return d.color = color[d.name];
        })
        .style("stroke", function (d) {
            return d3.rgb(d.color).darker(2);
        })
        .append("title")
        .text(function (d) {
            // console.log(d)
            return d.name + "\n" + format(d.value);
        });

    // add in the title for the nodes
    node.append("text")
        .attr("x", 6 + sankey.nodeWidth())
        .attr("y", function (d) {
            return d.dy / 2;
        })
        .attr("dy", "-0.1em")
        .attr("text-anchor", "start")
        .attr("transform", null)
        .text(function (d) {
            if (d.name != "Northern Ireland") {
                return d.name;
            } else {
                return "N. Ireland";
            }
        })
        .filter(function (d) {
            return d.x < width / 2;
        })
        .attr("dy", "-0.1em")
        .attr("x", -6)
        .attr("text-anchor", "end");

    node.append("text")
        .attr("y", function (d) {
            return d.dy / 2;
        })
        .attr("transform", null)
        .attr("class", "rect-value")
        .style("font-weight", "bold")
        .attr("dy", "0.9em")
        .text(function (d) {
            return formatNumber(d.value);
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start")
        .filter(function (d) {
            return d.x < width / 2;
        })
        .attr("dy", "0.9em")
        .attr("x", -6)
        .attr("text-anchor", "end");

    document.addEventListener("reloadAllEvent", function () {
        var ele = document.getElementsByName('level');
        for (i = 0; i < ele.length; i++) {
            if (ele[i].checked) {
                update(parseInt(ele[i].value));
                startingAllocationText = startingAllocationTextGroup[i];
            }
        }
    })

    function update(type) {
        var newLinks = [];

        portfolioValues.forEach(function (p, i) {
            newLinks.push({
                source: p.source,
                target: p.target,
                value: p.values[type]
            });
        });

        graph.links = newLinks;

        sankey
            .nodes(graph.nodes)
            .links(graph.links)
            .size([width, height])
            .layout(32);

        d3.selectAll(".link")
            .data(graph.links)
            .attr("d", path)
            .attr("id", function (d, i) {
                d.id = i;
                return "link-" + i;
            })
            .style("stroke-width", function (d) {
                if (d.value == 0) {
                    return 0;
                } else {
                    return Math.max(3, d.dy);
                }
            })
            .sort(function (a, b) {
                return b.dy - a.dy;
            });

        d3.selectAll(".node").attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        d3.selectAll("rect")
            .attr("height", function (d) {
                return d.dy;
            })

        d3.selectAll(".rect-value")
            .transition()
            .duration(200)
            .attr("fill-opacity",0.25)
            .transition()
            .text(function (d) {
                return formatNumber(d.value);
            })
            .transition()
            .duration(200)
            .attr("fill-opacity",1);
            
    };

    // the function for moving the nodes
    function dragmove(d) {
        d3.select(this)
            .attr("transform",
                "translate(" +
                d.x + "," +
                (d.y = Math.max(
                    0, Math.min(height - d.dy, d3.event.y))) + ")");
        sankey.relayout();
        link.attr("d", path);
    }
});

/* End of referenced code : Sankey diagram with multiple value columns and transition */