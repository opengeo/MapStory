$(function() {
    var tab = $('.tab-pane.flag'),
        form = tab.find('form'),
        status = tab.find('.flag-type input'),
        msg = tab.find('.msg'),
        input = $("<input type='hidden' name='flag_type'>").appendTo(form);
    function err(m) {
        var alert = msg.find('.alert-error');
        if (m) {
            alert.removeClass('hide').html(m);
        } else {
            alert.addClass('hide');
        }
        msg.find('.alert-info').addClass('hide');
    }
    form.find('[name=comment]').attr('placeholder', 'Tell us a little bit more about this issue...')
    form.on('submit', function(ev) {
        var selectedStatus = status.filter(":checked").val();
        ev.preventDefault();
        if (typeof selectedStatus === 'undefined') {
            err('Please choose one of the options on the left.');
            return;
        }
        if (! form.find('[name=comment]').val()) {
            err('Please provide a useful comment.');
            return;
        }
        input.val(selectedStatus);
        $.post(form.attr('action'), form.serialize(), function() {
            err(false);
            msg.find('.alert-info').html('Thank you for your comment.').slideDown().delay(1000).fadeOut(2000);
        }).fail(function() {
            err('There was a problem submitting your comment. The administrator will be notified.');
        });
    });
});