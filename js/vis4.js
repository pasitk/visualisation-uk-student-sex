var numOfTop = 5;

d3.csv('dataset/gender-by-subject.csv', function (data) {
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

    var textRank = {
        1: "first",
        2: "second",
        3: "third",
        4: "fourth",
        5: "fifth"
    }

    document.addEventListener("reloadChart4Event", function () {
        var levelDropdown = document.getElementById('level-4');
        level = levelDropdown.options[levelDropdown.selectedIndex].value;
        var countryDropdown = document.getElementById('countries-4');
        country = countryDropdown.options[countryDropdown.selectedIndex].value;
        var sexDropdown = document.getElementById('sex-4');
        sex = sexDropdown.options[sexDropdown.selectedIndex].value;

        update();
    });

    var sexByProviderVis = d3.select('#vis-4')

    var margin = {
        top: 45,
        right: 50,
        bottom: 60,
        left: 70
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

    var x_Scale = d3.scaleBand()
        .range([0, width])
        .paddingInner(0)
        .paddingOuter(0);

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
        .attr("id", "vis4-x-axis-topic")
        .attr("x", (width) / 2)
        .attr("y", height + (margin.bottom) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "0.5em")
        .text(function (d) {
            return "Subject Areas";
        })

    var yAxisTopic = svg.append("g")
        .append("text")
        .attr("class", "vis4-y-axis-topic")

    yAxisTopic.append("tspan")
        .attr("id", "vis4-y-axis-topic-1")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", -37)
        .attr("text-anchor", "end")
        .style("font-size", "0.4em")
        .text(function (d) { 
            return "Average change";
        })

    yAxisTopic.append("tspan")
        .attr("id", "vis4-y-axis-topic-2")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", -29)
        .attr("text-anchor", "end")
        .style("font-size", "0.4em")
        .text(function (d) {
            return "per year";
        })

    yAxisTopic.append("tspan")
        .attr("id", "vis4-y-axis-topic-2")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", -21)
        .attr("text-anchor", "end")
        .style("font-size", "0.4em")
        .text(function (d) {
            return "in the percentage";
        })

    yAxisTopic.append("tspan")
        .attr("id", "vis4-y-axis-topic-2")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", -13)
        .attr("text-anchor", "end")
        .style("font-size", "0.4em")
        .text(function (d) {
            return "of students";
        })

    var noDataMsg = svg.append("g")
        .append("text")
        .attr("class", "no-data-msg")

    noDataMsg.append("tspan")
        .attr("id", "vis4-no-data-msg-1")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dy", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "0.6em")
        .style("fill", "red")
        .style("opacity", 0)
        .text(function (d) {
            return "There are no HE providers in your selected country";
        })

    noDataMsg.append("tspan")
        .attr("id", "vis4-no-data-msg-2")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dy", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "0.6em")
        .style("fill", "red")
        .style("opacity", 0)
        .text(function (d) {
            return "which have students in your selected sex";
        })

    noDataMsg.append("tspan")
        .attr("id", "vis4-no-data-msg-3")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dy", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "0.6em")
        .style("fill", "red")
        .style("opacity", 0)
        .text(function (d) {
            return "and level of study in academic year 2018/19.";
        })

    noDataMsg.append("tspan")
        .attr("id", "vis4-no-data-msg-4")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dy", 10)
        .attr("text-anchor", "middle")
        .style("font-size", "0.6em")
        .style("fill", "red")
        .style("opacity", 0)
        .text(function (d) {
            return "So, the average of change in percentage of";
        })

    noDataMsg.append("tspan")
        .attr("id", "vis4-no-data-msg-5")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("dy", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "0.6em")
        .style("fill", "red")
        .style("opacity", 0)
        .text(function (d) {
            return "students in this group could not be calculated.";
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
        var convertedData = processSexBySubjectGrowthRankingData(data, level, country, sex);

        var x_axis = d3.axisBottom(x_Scale);
        var y_axis = d3.axisLeft(y_Scale).tickSizeOuter(0);

        x_Scale.domain(convertedData.map(function (d) {
            return d['Subject Area'].slice(4);
        }));

        var maxDomainY = d3.max(convertedData, function (d, i) {
            return d['Avg. yby % change of ' + sex];
        });

        if (maxDomainY == undefined) {
            d3.select("#vis4-no-data-msg-1")
                .transition()
                .text("There are no HE providers " + "in " + (country == "All" ? "the UK" : country))
                .style("opacity", 1);
            d3.select("#vis4-no-data-msg-2")
                .transition()
                .text("which have " + (sex == "Other" ? "other-sex" : sex.toLowerCase()))
                .style("opacity", 1);
            d3.select("#vis4-no-data-msg-3")
                .transition()
                .text((level == "All" ? "HE" : level == "All undergraduate" ? "undergraduate" : "postgraduate") + " students in academic year 2018/19.")
                .style("opacity", 1);
            d3.select("#vis4-no-data-msg-4")
                .transition()
                .style("opacity", 1);
            d3.select("#vis4-no-data-msg-5")
                .transition()
                .style("opacity", 1);
        } else {
            d3.select("#vis4-no-data-msg-1").transition().style("opacity", 0);
            d3.select("#vis4-no-data-msg-2").transition().style("opacity", 0);
            d3.select("#vis4-no-data-msg-3").transition().style("opacity", 0);
            d3.select("#vis4-no-data-msg-4").transition().style("opacity", 0);
            d3.select("#vis4-no-data-msg-5").transition().style("opacity", 0);
        }

        if (maxDomainY > 10) {
            y_Scale.domain([0, Math.ceil(maxDomainY)]);
        } else if (maxDomainY == 0 || maxDomainY == undefined) {
            y_Scale.domain([0, 0]);
        } else {
            maxDomainY = (Math.ceil(d3.max(convertedData, function (d) {
                return d['Avg. yby % change of ' + sex];
            }) * 10) / 10).toFixed(1);

            y_Scale.domain([0, maxDomainY]);
        }

        var yAxisGrid = d3.axisLeft(y_Scale)
            .tickSize(-width)
            .tickSizeOuter(0)
            .tickFormat('');

        var t = d3.transition()
            .duration(1000)
            .ease(d3.easeCircle);

        var lines = svg.selectAll(".line")
            .data(convertedData);

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
         *   This part is a tooltip appeared when cursor is over the lines in the chart
         */
        var new_lines = lines
            .enter()
            .append('rect')
            .attr('class', 'line')
            .attr('id', function (d, i) {
                return "line" + i;
            })
            .attr("y", height)
            .attr("x", function (d, i) {
                return x_Scale(d['Subject Area'].slice(4)) + ((x_Scale.bandwidth()) / 2) - 1;
            })
            .attr("height", 0)
            .attr("width", function (d) {
                return 2;
            })
            .attr("opacity", 0)
            .on("mouseover", function (d, i) {
                var subjectArea = d['Subject Area'].slice(4);
                if (subjectArea.indexOf("&") != -1 && subjectArea.length > 25) {
                    subjectArea = subjectArea.slice(0, subjectArea.indexOf("&") + 1) + "<br/>" + subjectArea.slice(subjectArea.indexOf("&") + 2)
                }
                var percentDisplay = parseFloat(d['Avg. yby % change of ' + sex]).toFixed(2);
                if (y_Scale.domain()[1] < 0.3) {
                    percentDisplay = parseFloat(d['Avg. yby % change of ' + sex]).toFixed(3);
                }
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltip.html("<span class='important-figure'>" + subjectArea + "<br/>" +
                    percentDisplay + "%</span><br/><br/>" +
                    "it stood in the <b>" + textRank[(i + 1)] + " rank</b> of subject<br/>" +
                    "areas which saw the most positive<br/>" +
                    "average change per year in the<br/>" +
                    "percentage of <b>" + (sex == "Other" ? "other-sex" : sex.toLowerCase()) + " " +
                    (level == "All" ? "HE" : level.toLowerCase().slice(4)) + "</b><br/>" +
                    "students in <b>" + (country == "All" ? "the UK" : country) + "</b>" +
                    "<hr class='line-hr-tooltip'>" +
                    "<b>Percentage of " + (sex == "Other" ? "other-sex" : sex.toLowerCase()) + " students<br/>" +
                    "among all " + (level == "All" ? "HE" : level.toLowerCase().slice(4)) + " students<br/>" +
                    "who studied this subject<br/>" +
                    "in " + (country == "All" ? "the UK" : country) + "</b><ul>" +
                    "<li>2014/15 : " + parseFloat(d[sex + ' (%) 2014/15']).toFixed(2) + "%</li>" +
                    "<li>2015/16 : " + parseFloat(d[sex + ' (%) 2015/16']).toFixed(2) + "%</li>" +
                    "<li>2016/17 : " + parseFloat(d[sex + ' (%) 2016/17']).toFixed(2) + "%</li>" +
                    "<li>2017/18 : " + parseFloat(d[sex + ' (%) 2017/18']).toFixed(2) + "%</li>" +
                    "<li>2018/19 : " + parseFloat(d[sex + ' (%)']).toFixed(2) + "%</li>");
                tooltip.style("left", (d3.event.pageX) + 15 + "px")
                    .style("top", (d3.event.pageY) - 175 + "px")
                    .style("border-color", color[sex]);
                d3.select(this).attr("fill", function (d) {
                    return colorHover[sex];
                });
                svg.select("#dot" + i).attr("fill", function (d) {
                    return colorHover[sex];
                });
            })
            .on("mouseout", function (d, i) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0)
                d3.select(this).attr("fill", function (d) {
                    return color[sex];
                });
                svg.select("#dot" + i).attr("fill", function (d) {
                    return color[sex];
                });
            });
        /* End of referenced code : Tooltip 2nd Part */

        new_lines.merge(lines)
            .transition(t)
            .attr("height", function (d, i) {
                return height - y_Scale(d['Avg. yby % change of ' + sex]);
            })
            .attr("y", function (d, i) {
                return y_Scale(d['Avg. yby % change of ' + sex]);
            })
            .attr("x", function (d, i) {
                return x_Scale(d['Subject Area'].slice(4)) + ((x_Scale.bandwidth()) / 2) - 1;
            })
            .attr("fill", function (d) {
                return color[sex];
            })
            .attr("opacity", 1);

        var dots = svg.selectAll(".dot")
            .data(convertedData);

        dots
            .exit()
            .transition(t)
            .attr("cy", height)
            .attr("r", function (d) {
                return 0;
            })
            .attr("opacity", 0)
            .remove();

        /*
         *   Tooltip 3rd Part
         *   This code was adapted from an example on bl.ocks.org
         *   accessed 20-04-2020
         *   https://bl.ocks.org/tiffylou/88f58da4599c9b95232f5c89a6321992
         *   This part is a tooltip appeared when cursor is over the dots in the chart
         */
        var new_dots = dots
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('id', function (d, i) {
                return "dot" + i;
            })
            .attr("cy", height)
            .attr("cx", function (d, i) {
                return x_Scale(d['Subject Area'].slice(4)) + ((x_Scale.bandwidth()) / 2);
            })
            .attr("r", function (d) {
                return 0;
            })
            .attr("opacity", 0)
            .on("mouseover", function (d, i) {
                var subjectArea = d['Subject Area'].slice(4);
                if (subjectArea.indexOf("&") != -1 && subjectArea.length > 25) {
                    subjectArea = subjectArea.slice(0, subjectArea.indexOf("&") + 1) + "<br/>" + subjectArea.slice(subjectArea.indexOf("&") + 2)
                }
                var percentDisplay = parseFloat(d['Avg. yby % change of ' + sex]).toFixed(2);
                if (y_Scale.domain()[1] < 0.3) {
                    percentDisplay = parseFloat(d['Avg. yby % change of ' + sex]).toFixed(3);
                }
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);
                tooltip.html("<span class='important-figure'>" + subjectArea + "<br/>" +
                    percentDisplay + "%</span><br/><br/>" +
                    "it stood in the <b>" + textRank[(i + 1)] + " rank</b> of subject<br/>" +
                    "areas which saw the most positive<br/>" +
                    "average change per year in the<br/>" +
                    "percentage of <b>" + (sex == "Other" ? "other-sex" : sex.toLowerCase()) + " " +
                    (level == "All" ? "HE" : level.toLowerCase().slice(4)) + "</b><br/>" +
                    "students in <b>" + (country == "All" ? "the UK" : country) + "</b>" +
                    "<hr class='line-hr-tooltip'>" +
                    "<b>Percentage of " + (sex == "Other" ? "other-sex" : sex.toLowerCase()) + " students<br/>" +
                    "among all " + (level == "All" ? "HE" : level.toLowerCase().slice(4)) + " students<br/>" +
                    "who studied this subject<br/>" +
                    "in " + (country == "All" ? "the UK" : country) + "</b><ul>" +
                    "<li>2014/15 : " + parseFloat(d[sex + ' (%) 2014/15']).toFixed(2) + "%</li>" +
                    "<li>2015/16 : " + parseFloat(d[sex + ' (%) 2015/16']).toFixed(2) + "%</li>" +
                    "<li>2016/17 : " + parseFloat(d[sex + ' (%) 2016/17']).toFixed(2) + "%</li>" +
                    "<li>2017/18 : " + parseFloat(d[sex + ' (%) 2017/18']).toFixed(2) + "%</li>" +
                    "<li>2018/19 : " + parseFloat(d[sex + ' (%)']).toFixed(2) + "%</li>");
                tooltip.style("left", (d3.event.pageX) + 15 + "px")
                    .style("top", (d3.event.pageY) - 175 + "px")
                    .style("border-color", color[sex]);
                d3.select(this).attr("fill", function (d) {
                    return colorHover[sex];
                });
                svg.select("#line" + i).attr("fill", function (d) {
                    return colorHover[sex];
                });
            })
            .on("mouseout", function (d, i) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                d3.select(this).attr("fill", function (d) {
                    return color[sex];
                });
                svg.select("#line" + i).attr("fill", function (d) {
                    return color[sex];
                });
            });
        /* End of referenced code : Tooltip 3rd Part */

        new_dots.merge(dots)
            .transition(t)
            .attr("cy", function (d, i) {
                return y_Scale(d['Avg. yby % change of ' + sex]);
            })
            .attr("cx", function (d, i) {
                return x_Scale(d['Subject Area'].slice(4)) + ((x_Scale.bandwidth()) / 2);
            })
            .attr("r", function (d) {
                return 5;
            })
            .attr("fill", function (d) {
                return color[sex];
            })
            .attr("opacity", 1);

        svg.select('.y.axis-grid')
            .transition(t)
            .call(yAxisGrid);

        svg.select('.x.axis')
            .call(x_axis)
            .selectAll(".x.axis .tick text")
            .style("font-size", "0.85em")
            .call(wrap, x_Scale.bandwidth())

        svg.select('.y.axis')
            .transition(t)
            .call(y_axis);
    }

    /*
     *   Function for wrapping long labels
     *   This code was copied from an example on bl.ocks.org
     *   accessed 24-04-2020
     *   https://bl.ocks.org/guypursey/f47d8cd11a8ff24854305505dbbd8c07
     */
    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em")
            while (word = words.pop()) {
                line.push(word)
                tspan.text(line.join(" "))
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop()
                    tspan.text(line.join(" "))
                    line = [word]
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
                }
            }
        })
    }
    /* End of referenced code : Function for wrapping long labels */

    update();
})

function processSexBySubjectGrowthRankingData(rawData, level, dest, sex) {
    rawData.sort((a, b) => (a['Avg. yby % change of ' + sex] < b['Avg. yby % change of ' + sex]) ? 1 : -1);

    selectedData = rawData.filter(function (row) {
        return (row['Level of study'] == level &&
            row['Country of HE provider'] == dest &&
            parseFloat(row['Avg. yby % change of ' + sex]) > 0);
    });

    if (selectedData.length > numOfTop) return selectedData.slice(0, numOfTop);
    else return selectedData;
}