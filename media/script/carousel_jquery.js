(function($) {

    $.fn.carousel = function() {
        var tiles = $('#carousel .tile'),
        carousel = this,
        twidth = 256,
        margin = (carousel.width() - (3 * twidth)) / 4,
        positions = [margin, (2 * margin) + twidth, (3 * margin) + (2 * twidth)],
        idx = 0, timeout = 5000,
        handle, arrows;

        if (tiles.length <= 3) {
            carousel.children('.arrow').hide();
            return;
        }
        function tile(off) {
            var tidx = idx + off;
            if (off < 0) tidx += tiles.length;
            return tidx % tiles.length;
        }
        function align(right) {
            tiles.css( 'left', right ? carousel.width() : -twidth);
            for (var i = 0; i < 3; i++ ) {
                tiles.eq([ tile(i) ]).css('left', positions[i]);
            }
        }
        align(true);
        function go(left) {
            var lidx = left ? idx : tile(2);
            tiles.eq(lidx).animate({
                left: left ? -twidth: carousel.width() + twidth
                }, function() {
                tiles.eq(lidx).css('left', left ? carousel.position().left + carousel.width() : -twidth);
            });
            idx = tile( left ? 1: -1);
            for (var i = 0; i < 3; i++) {
                var p = positions[i];//; + carousel.position().left;
                tiles.eq([ tile(i) ]).animate({
                    left: p
                });
            }
        }

        handle = window.setInterval(function() {
            go(true)
            }, timeout);
        arrows = carousel.children('.arrow');
        arrows.eq(0).click(function() {
            window.clearInterval(handle);
            align(true);
            go(true);
        });
        arrows.eq(1).click(function() {
            window.clearInterval(handle);
            align(false);
            go(false);
        });
    };

    $.fn.carouselResize = function(mw, mh) {
        this.each(function(i,e) {
            var el = $(e),
                w = el.width(),
                h = el.height(),
                rw = w / mw,
                rh = h / mh,
                r = Math.max(rw, rh);
            if (r == 0) return;
            if (r > 1) {
                if (r == rw) {
                    w = mw;
                    h = mh / r;
                } else {
                    h = mh;
                    w = mw / r;
                }
                el.width(w);
                el.height(h);
            }
            if (h < mh) {
                el.css({margin: (mh - h) / 2 + "px 0"});
            }
        });
        return this;
    };

    $(function () {
        $("#carousel").carousel();
    });
})(jQuery);