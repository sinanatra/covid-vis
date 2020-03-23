function loadLegend(){
    const legendRectSize = 18;                               
    const legendSpacing = 4;       

    var legend = g.selectAll('.legend')                     
        .data(color.domain())                                   
        .enter()                                                
        .append('g')                                            
        .attr('class', 'legend')                                
        .attr('transform', function(d, i) {                     
        var height = legendRectSize + legendSpacing;          
        var offset =  height * color.domain().length / 2;     
        var horz = legendRectSize;                       
        var vert = i * height - offset;                       
        return 'translate(' + horz + ',' + vert + ')';        
        });                                                     

    legend.append('rect')                                     
        .attr('width', legendRectSize)                          
        .attr('height', legendRectSize)                         
        .style('fill', color)                                   
        .style('stroke', color);                                
        
    legend.append('text')                                     
        .attr('x', legendRectSize + legendSpacing)              
        .attr('y', legendRectSize - legendSpacing)              
        .text(function(d) { return d; });                       
}