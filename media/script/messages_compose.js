$(function() {
    var authors = "/search/api/authors",
        t = $('#id_recipient').typeahead(),
        ti = t.data('typeahead'),
        lookup = ti.lookup,
        user;
    t.attr('autocomplete','off');
    // patch in ajax lookup and allow for callback func
    ti.lookup = function(func) {
        var q = this.$element.val();
        $.getJSON(authors, {"query": q, 'fullname': 1}, function(data) {
            ti.names = data['names'];
            ti.source = $.map(ti.names, function(pair) {
                return pair['display'] + (pair['display'].length ? ' ' : '') + '[ ' + pair['username'] + ' ] ';
            });
            lookup.apply(ti, arguments);
            func && func();
        });
        return this;
    };
    // get selected username
    ti.getUserName = function() {
        var q = this.$element.val();
        for (var i in self.names) {
            if (self.names[i].display == q) {
                return self.names[i].username;
            }
        }
    };
    $('#message-form').submit(function(ev) {
        // before submitting, extract username
        var username = /\[ (.*) \]/.exec(ti.$element.val())[1];
        $('#id_recipient').val(username);
    });
    $('#message-form input[type=submit]').addClass('btn');
    t.attr('placeholder', 'Enter name or username');
    $('#id_subject').attr('placeholder', 'Enter subject');
    $('#id_body').attr('placeholder', 'Enter message');
    user = /to=(.*)/.exec(window.location.search)[1];
    if (user) {
        t.val(user);
        // select on callback from ajax
        ti.lookup(function() { ti.select(); });
    }
});