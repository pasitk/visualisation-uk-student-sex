var units = "Widgets";

// set the dimensions and margins of the graph
var margin = {
        top: 75,
        right: 80,
        bottom: 30,
        left: 80
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
    colorChart1 = {
        "England": "#914651",
        "Scotland": "#b05a67",
        "Wales": "#c07c87",
        "Northern Ireland": "#d19fa7",
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

function checkShowHide() {
    var allCheckBox = document.getElementsByName("country-1");
    var checkAll = true;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked == true) {
            d3.select("#node-" + checkbox.value)
                .attr("display", "inline");
            d3.selectAll(".link-" + checkbox.value)
                .attr("display", "inline");
        } else {
            d3.select("#node-" + checkbox.value)
                .attr("display", "none");
            d3.selectAll(".link-" + checkbox.value)
                .attr("display", "none");
            checkAll = false;
        }
    })

    var sex = ['Female', 'Male', 'Other'];
    if (!checkAll) {
        sex.forEach((eachsex) => {
            d3.select("#node-" + eachsex + " .rect-value").attr("display", "none");
            d3.select("#node-" + eachsex + " .rect-label").attr("dy", "0.3em");
        })
    } else {
        sex.forEach((eachsex) => {
            d3.select("#node-" + eachsex + " .rect-value").attr("display", "block");
            d3.select("#node-" + eachsex + " .rect-label").attr("dy", "-0.2em");
        })
    }
}


/*
 *   Sankey diagram with multiple value columns and transition
 *   This code was adapted from examples on blockbuilder.org and stackoverflow.com
 *   accessed 20-04-2020
 *   https://blockbuilder.org/SpaceActuary/2a46e03eb7b7e05f48e6251054501244
 *   https://stackoverflow.com/questions/13603832/sankey-diagram-transition
 *   Change code by adjust style and appearance of Sankey Diagram
 *   Add tooltip to describe more detail about data, Add transition effect when user change new option to filter data.
 *   But the function 'checkShowHide' above which allow user to choose the countries they want to see data (filtering) 
 *   is not included in this reference, because I wrote it by myself.
 */

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(nodeWidthNum)
    .nodePadding(25)
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

var swap = function (array, posX, posY) {
    var temp = array[posX];
    array[posX] = array[posY];
    array[posY] = temp;
};

d3.csv("dataset-and-analysis/sankey-sex-by-country-multi.csv", function (error, data) {
    if (error) throw error;

    swap(data, 3, 6);
    swap(data, 4, 7);
    swap(data, 5, 8);
    swap(data, 6, 9);
    swap(data, 7, 10);
    swap(data, 8, 11);

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
        .layout(0);

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
        .attr("class", function (d) {
            return "link link-" + d.source.name.replace(" ", "");
        })
        .attr("id", function (d) {
            return "link-" + d.source.name.replace(" ", "") + "-" + d.target.name.replace(" ", "");
        })
        .style("fill", function (d) {
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
                tooltip.html("<b>" + formatNumber(d.value) + " students,</b> " +
                    "equals to <b>" + formatTwoDecimalPlaces(d.value / totalNum * 100) + "%</b> of <b>" + startingAllocationText + "</b> students in <b>" + d.source.name + "</b> answered that they are <b>" + (d.target.name == "Other" ? "other-sex" : d.target.name.toLowerCase()) + "</b> students");
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
        .attr("id", function (d) {
            return "node-" + d.name.replace(" ", "");
        })
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
            return d.color = colorChart1[d.name];
        })
        .style("stroke", function (d) {
            return d3.rgb(colorChart1[d.name]);
        });

    // add in the title for the nodes
    node.append("text")
        .attr("x", 6 + sankey.nodeWidth())
        .attr("y", function (d) {
            return d.dy / 2;
        })
        .attr("dy", "-0.2em")
        .attr("text-anchor", "start")
        .attr("transform", null)
        .attr("class", "rect-label")
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
        .attr("dy", "-0.2em")
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

    document.addEventListener("reloadChart1Event", function () {
        var levelDropdown = document.getElementById('level-1');
        update(parseInt(levelDropdown.selectedIndex));
        startingAllocationText = startingAllocationTextGroup[levelDropdown.selectedIndex];
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
            .layout(0);

        svg.selectAll(".link")
            .data(graph.links)
            .attr("d", path)
            .attr("class", function (d) {
                return "link link-" + d.source.name.replace(" ", "");
                // return "link-" + i;
            })
            .attr("id", function (d, i) {
                d.id = i;
                return "link-" + d.source.name.replace(" ", "") + "-" + d.target.name.replace(" ", "");
                // return "link-" + i;
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
            })
            .call(checkShowHide);

        svg.selectAll(".node").attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        svg.selectAll("rect")
            .attr("height", function (d) {
                return d.dy;
            })

        svg.selectAll(".rect-value")
            .transition()
            .duration(200)
            .attr("fill-opacity", 0.25)
            .transition()
            .text(function (d) {
                return formatNumber(d.value);
            })
            .transition()
            .duration(200)
            .attr("fill-opacity", 1);
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