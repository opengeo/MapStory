function mapstoryExpandable() {
    var expandable = $('div.expandable'),
        html = expandable.html(),
        slice = 200,
        first = html.indexOf('</p>');
    if (expandable.find('p').length > 1) {
        slice = first > 0 ? first : slice;
    }
    expandable.removeData().remove('br').expander({
        slicePoint: slice, // default is 100
        expandPrefix: ' ', // default is '... '
        expandText: '[read more]', // default is 'read more'
        userCollapseText: '[read less]'  // default is 'read less'
    });
}
$(document).ready(mapstoryExpandable);
