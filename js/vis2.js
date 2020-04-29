d3.csv('dataset/gender-by-provider.csv', function (data) {
    var level = "All";
    var country = "All";
    var sex = "Female";

    var color = {
        "Female": "#ffa372",
        "Male": "#0f4c81",
        "Other": "#999999"
    };

    var colorHover = {
        "Female": "#fb5700",
        "Male": "#07233b",
        "Other": "#333333"
    };
    document.addEventListener("reloadChart2Event", function () {
        var levelDropdown = document.getElementById('level-2');
        level = levelDropdown.options[levelDropdown.selectedIndex].value;
        var countryDropdown = document.getElementById('countries-2');
        country = countryDropdown.options[countryDropdown.selectedIndex].value;
        // var sexDropdown = document.getElementById('sex-2');
        // sex = sexDropdown.options[sexDropdown.selectedIndex].value;
        var sexRadioBtn = document.getElementsByName('sex-2');
        for (i = 0; i < sexRadioBtn.length; i++) {
            if (sexRadioBtn[i].checked) {
                sex = sexRadioBtn[i].value;
            }
        }

        update();
    });

    var sexByProviderVis = d3.select('#vis-2')

    var margin = {
        top: 30,
        right: 50,
        bottom: 60,
        left: 50
    };
    var width = 350;
    var height = 300;

    var svg = sexByProviderVis.append("svg")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", "100%")
        .attr("preserveAspectRatio", "xMinYMin")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    var x_Scale = d3.scaleLinear()
        .range([0, width]);

    var y_Scale = d3.scaleLinear()
        .range([height, 0]);

    svg.append('g')
        .attr('class', 'y axis-grid');

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr('class', 'x axis');

    svg.append("g")
        .attr('class', 'y axis');

    svg.append("g")
        .append("text")
        .attr("id", "vis2-x-axis-topic")
        .attr("x", (width) / 2)
        .attr("y", height + (margin.bottom / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "0.5em")
        .text(function (d) {
            return "The percentage of students (only selected sex) in a HE provider";
        })

    var yAxisTopic = svg.append("g")
        .append("text")
        .attr("class", "vis2-y-axis-topic")

    yAxisTopic.append("tspan")
        .attr("id", "vis2-y-axis-topic-1")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", -20)
        .attr("text-anchor", "end")
        .style("font-size", "0.5em")
        .text(function (d) {
            return "Number of";
        })

    yAxisTopic.append("tspan")
        .attr("id", "vis2-y-axis-topic-2")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", -10)
        .attr("text-anchor", "end")
        .style("font-size", "0.5em")
        .text(function (d) {
            return "HE providers";
        })

    var noDataMsg = svg.append("g")
        .append("text")
        .attr("class", "no-data-msg")

    noDataMsg.append("tspan")
        .attr("id", "vis2-no-data-msg-1")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dy", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "0.6em")
        .style("fill", "red")
        .style("opacity", 0)
        .text(function (d) {
            return "There are no HE providers in your selected country";
        })

    noDataMsg.append("tspan")
        .attr("id", "vis2-no-data-msg-2")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dy", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "0.6em")
        .style("fill", "red")
        .style("opacity", 0)
        .text(function (d) {
            return "which have students in your selected sex";
        })

    noDataMsg.append("tspan")
        .attr("id", "vis2-no-data-msg-3")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dy", 10)
        .attr("text-anchor", "middle")
        .style("font-size", "0.6em")
        .style("fill", "red")
        .style("opacity", 0)
        .text(function (d) {
            return "and level of study";
        })
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

    function update() {
        var convertedData = processSexByProviderData(data, level, country, sex);
        var numOfTicksX = 10;

        var x_axis = d3.axisBottom(x_Scale);
        var y_axis = d3.axisLeft(y_Scale).tickSizeOuter(0);

        var yAxisGrid = d3.axisLeft(y_Scale)
            .tickSize(-width)
            .tickSizeOuter(0)
            .tickFormat('');

        var sexInTopic = (sex == 'Other') ? "other-sex" : sex.toLowerCase();

        svg.select("#vis2-x-axis-topic")
            .text("The percentage of " + sexInTopic + " students in a HE provider");

        if (sex != "Other") {
            x_Scale.domain([0, 100]);
        } else {
            var maxDomainX = (Math.ceil(d3.max(convertedData, function (d) {
                return d["% " + sex];
            }) * 10) / 10).toFixed(1);
            numOfTicksX = maxDomainX / 0.1;

            x_Scale.domain([0, maxDomainX]);
        }

        /*
         *   Foundation code for Histogram
         *   This code was adapted from examples on d3-graph-gallery.com
         *   accessed 24-04-2020
         *   https://www.d3-graph-gallery.com/graph/histogram_binSize.html
         *   Change code by adjust thresvold value and data used
         */

        var histogram = d3.histogram()
            .value(function (d) {
                return parseFloat(d["% " + sex]);
            })
            .domain(x_Scale.domain())
            .thresholds(x_Scale.ticks(numOfTicksX));

        var bins = histogram(convertedData);

        /* End of referenced code : Foundation code for Histogram */

        if (bins.length == 1 && bins[0].x0 == 0 && bins[0].x1 == 0) {
            svg.select("#vis2-no-data-msg-1")
                .transition()
                .text("There are no HE providers " + "in " + (country == "All" ? "the UK" : country))
                .style("opacity", 1);
            svg.select("#vis2-no-data-msg-2")
                .transition()
                .text("which have " + (sex == "Other" ? "other-sex" : sex.toLowerCase()))
                .style("opacity", 1);
            svg.select("#vis2-no-data-msg-3")
                .transition()
                .text((level == "All" ? "HE" : level == "All undergraduate" ? "undergraduate" : "postgraduate") + " students")
                .style("opacity", 1);

            y_Scale.domain([0, 0])
        } else {
            svg.select("#vis2-no-data-msg-1").transition().style("opacity", 0);
            svg.select("#vis2-no-data-msg-2").transition().style("opacity", 0);
            svg.select("#vis2-no-data-msg-3").transition().style("opacity", 0);

            y_Scale.domain([0, d3.max(bins, function (d) {
                return d.length;
            })])
        }





        if (numOfTicksX <= 5) {
            x_axis.ticks(numOfTicksX);
        }

        if (d3.max(bins, function (d) {
                return d.length;
            }) < 10) {
            y_axis.ticks(d3.max(bins, function (d) {
                return d.length;
            }));

            yAxisGrid.ticks(d3.max(bins, function (d) {
                return d.length;
            }));
        }

        var lines = svg.selectAll(".line")
            .data(bins);

        var t = d3.transition()
            .duration(1000)
            .ease(d3.easeCircle);

        lines
            .exit()
            .transition(t)
            .attr("y", height)
            .attr("height", 0)
            .attr("opacity", 0)
            .remove();

        /*
         *   Tooltip 2nd Part
         *   This code was adapted from an example on bl.ocks.org
         *   accessed 20-04-2020
         *   https://bl.ocks.org/tiffylou/88f58da4599c9b95232f5c89a6321992
         *   Change code by adjust how to display, data and style
         */
        var new_lines = lines
            .enter()
            .append('rect')
            .attr('class', 'line')
            .attr("y", height)
            .attr("x", function (d, i) {
                return x_Scale(d.x0) + 1;
            })
            .attr("width", function (d) {
                if (x_Scale(d.x1) - x_Scale(d.x0) - 1 < 0) {
                    return 0;
                } else {
                    return x_Scale(d.x1) - x_Scale(d.x0) - 1;
                }
            })
            .attr("height", 0)
            .attr("opacity", 0)
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltip.html("There " + (d.length == 1 ? "is " : "are ") + "<b>" + d.length + "</b> HE provider" + (d.length == 1 ? "" : "s") + " in <b>" + (country == "All" ? "the UK" : country) + "</b> " +
                    "of which <b>" + d.x0 + "-" + d.x1 + "%</b> of " + (d.length == 1 ? "its " : "their ") +
                    "<b>" + (level == "All" ? "all HE" : level.toLowerCase()) + "</b> students " +
                    "are <b>" + (sex == "Other" ? "other-sex students" : sex.toLowerCase()) + "</b><br/><br/>" +
                    "<i>Click to see the names of<br/>HE providers in this group.</i>"
                );
                tooltip.style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) - 50 + "px")
                    .style("border-color", color[sex]);
                d3.select(this).attr("fill", function (d) {
                        return colorHover[sex];
                    })
                    .style("cursor", "pointer");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                d3.select(this).attr("fill", function (d) {
                        return color[sex];
                    })
                    .style("cursor", "normal");
            })
            .on("click", function (d) {
                var allProvider = d.map(function (row) {
                    return row['HE provider'];
                });

                var allProviderText = "<span class='provider-header'>" +
                    "HE provider" + (allProvider.length == 1 ? "" : "s") + " in " +
                    (country == "All" ? "the UK" : country) + " in which " + d.x0 + "-" + d.x1 + "%</b> of their " +
                    (level == "All" ? "all HE" : level.toLowerCase()) + "</b> students are " + (sex == "Other" ? "other-sex" : sex.toLowerCase()) +
                    "</span><br/><br/>" + allProvider.join(" | ");
                d3.select("#example-chart-2").html(allProviderText);
            });
        /* End of referenced code : Tooltip 2nd Part */

        new_lines.merge(lines)
            .transition(t)
            .attr("height", function (d, i) {
                return height - y_Scale(d.length);
            })
            .attr("y", function (d, i) {
                return y_Scale(d.length);
            })
            .attr("x", function (d, i) {
                return x_Scale(d.x0) + 1;
            })
            .attr("width", function (d) {
                if (x_Scale(d.x1) - x_Scale(d.x0) - 1 < 0) {
                    return 0;
                } else {
                    return x_Scale(d.x1) - x_Scale(d.x0) - 1;
                }
            })
            .attr("fill", function (d) {
                return color[sex];
            })
            .attr("opacity", 1);

        svg.select('.y.axis-grid')
            .transition(t)
            .call(yAxisGrid);

        svg.select('.x.axis')
            .call(x_axis);

        svg.select('.y.axis')
            .transition(t)
            .call(y_axis);
    }

    update();
})

function processSexByProviderData(rawData, level, dest, sex) {
    if (sex == 'Female') {
        rawData.sort((a, b) => (a['% Female'] < b['% Female']) ? 1 : (a['% Female'] === b['% Female']) ? ((a['HE provider'] > b['HE provider']) ? 1 : -1) : -1);
    } else if (sex == 'Male') {
        rawData.sort((a, b) => (a['% Male'] < b['% Male']) ? 1 : (a['% Male'] === b['% Male']) ? ((a['HE provider'] > b['HE provider']) ? 1 : -1) : -1);
    } else if (sex == 'Other') {
        rawData.sort((a, b) => (a['% Other'] < b['% Other']) ? 1 : (a['% Other'] === b['% Other']) ? ((a['HE provider'] > b['HE provider']) ? 1 : -1) : -1);
    }

    selectedData = rawData.filter(function (row) {
        if (dest == "All") {
            return row['Level of study'] == level;
        } else return row['Level of study'] == level && row['Country of HE provider'] == dest;
    });

    return selectedData;
}