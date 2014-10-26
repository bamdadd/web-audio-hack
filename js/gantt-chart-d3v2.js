/**
 * @author Dimitry Kudrayvtsev
 * @version 2.0
 */

d3.gantt = function() {
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";
    
    var margin = {
	top : 20,
	right : 40,
	bottom : 20,
	left : 150
    };
    var timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
    var taskTypes = [];
    var height = document.body.clientHeight - margin.top - margin.bottom-5;
    var width = document.body.clientWidth - margin.right - margin.left-5;

    var tickFormat = "%H:%M";

    var keyFunction = function(d) {
	return d.startTime + d.noteNumber + d.endTime;
    };

    var rectTransform = function(d) {
		return "translate(" + x(d.noteNumber) + "," + y(d.startTime) + ")";
    };

    var x;
    var y;
    var endTime;

    var i = 0;
    var windowSize = 1000;
	var xAxis;

    var initAxis = function() {
        y = d3.time.scale().domain([ i, i+windowSize ]).range([ 0, height - margin.top - margin.bottom ]).clamp(true);
        x = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, width ], .1);
        xAxis = d3.svg.axis().scale(x).orient("top").tickSize(0);
		
   		i+=parseInt($('#fader').val());

    };
    var initTimeDomain = function() {
	if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
	    if (notesToVisualise === undefined || notesToVisualise.length < 1) {
		return;
	    }
	    notesToVisualise.sort(function(a, b) {
		return a.endTime - b.endTime;
	    });
	    timeDomainEnd = notesToVisualise[notesToVisualise.length - 1].endTime;
	    notesToVisualise.sort(function(a, b) {
		return a.startTime - b.startTime;
	    });
	    timeDomainStart = notesToVisualise[0].startTime;
	}
    };



    function gantt(notes) {
		endTime = notes[notes.length-1].endTime;
	initTimeDomain();
	initAxis();
	
	var svg = d3.select("body")
	.append("svg")
	.attr("class", "chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
        .attr("class", "gantt-chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
	
      svg.selectAll(".chart")
	 .data(notes, keyFunction).enter()
	 .append("rect")
	 .attr("rx", 5)
         .attr("ry", 5)
	 .attr("class", function(d){ 
	     return d.status;
	     }) 
	 .attr("x", 0)
	 .attr("transform", rectTransform)
	 .attr("height", function(d) { return y(d.endTime) - y(d.startTime); })
	 .attr("width", function(d) { 
	     return x.rangeBand();
	  });

	 svg.append("g")
	 .attr("class", "x axis")
	 // .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
	 .transition()
	 .call(xAxis);

	 return gantt;

    };
    
    gantt.redraw = function(notes) {

	initTimeDomain();
	initAxis();
	
        var svg = d3.select("svg");

        var ganttChartGroup = svg.select(".gantt-chart");
        var rect = ganttChartGroup.selectAll("rect").data(notes, keyFunction);
        
        rect.enter()
         .insert("rect",":first-child")
         .attr("rx", 5)
         .attr("ry", 5)
	 .attr("class", function(d){
	     return d.status;
	     }) 
	 // .transition()
	 .attr("y", 0)
	 .attr("transform", rectTransform)
	 .attr("height", function(d) { return y(d.endTime) - y(d.startTime); })
	 .attr("width", function(d) { 
	     return x.rangeBand();
	     });

        rect
          .attr("transform", rectTransform)
	 .attr("height", function(d) { return y(d.endTime) - y(d.startTime); })
	 .attr("width", function(d) { 
	     return x.rangeBand();
	     });
        
	rect.exit().remove();

	// svg.select(".x").transition();
	// svg.select(".y").transition();
	
	return gantt;
    };

    gantt.atEnd = function() {
    	return i > endTime;
    }

    gantt.margin = function(value) {
	if (!arguments.length)
	    return margin;
	margin = value;
	return gantt;
    };

    gantt.timeDomain = function(value) {
	if (!arguments.length)
	    return [ timeDomainStart, timeDomainEnd ];
	timeDomainStart = +value[0], timeDomainEnd = +value[1];
	return gantt;
    };

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    gantt.timeDomainMode = function(value) {
	if (!arguments.length)
	    return timeDomainMode;
        timeDomainMode = value;
        return gantt;

    };

    gantt.noteAxisNumbers = function(value) {
	if (!arguments.length)
	    return taskTypes;
	taskTypes = value;
	return gantt;
    };

    gantt.width = function(value) {
	if (!arguments.length)
	    return width;
	width = +value;
	return gantt;
    };

    gantt.height = function(value) {
	if (!arguments.length)
	    return height;
	height = +value;
	return gantt;
    };

    gantt.tickFormat = function(value) {
	if (!arguments.length)
	    return tickFormat;
	tickFormat = value;
	return gantt;
    };


    
    return gantt;
};
