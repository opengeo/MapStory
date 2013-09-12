$(function() {
    $(document).on('click',".rm-favorite",function(ev) {
        var el = $(this);
        ev.preventDefault();
        $.post(el.attr('href'),function() {
           el.closest('li').fadeOut(); 
        });
    });
    function showSuccess() {
        $('#add-to-feedback').html('Successfully Added').fadeTo(0,1).fadeTo(2000, 0);
    }
    $(".add-to-favorites").click(function(ev) {
        var el = $(this);
        ev.preventDefault();
        $.post(el.attr('href'),showSuccess);
    });
    $(".add-to-map").click(function(ev) {
        var el = $(this);
        ev.preventDefault();
        $.post(el.attr('href'),showSuccess);
    });
});