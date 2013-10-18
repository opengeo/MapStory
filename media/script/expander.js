$(document).ready(function() {
    var expandable = $('div.expandable'),
        html = expandable.html(),
        slice = 100,
        first = html.indexOf('</p>');
    if (expandable.find('p').length > 1) {
        slice = first > 0 ? first : slice;
    }
    expandable.remove('br').expander({
        slicePoint: slice, // default is 100
        expandPrefix: ' ', // default is '... '
        expandText: '[read more]', // default is 'read more'
        userCollapseText: '[read less]'  // default is 'read less'
    });
});
