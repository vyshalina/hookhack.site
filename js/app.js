(function($) {
  'use strict';

  mina.elasticInEasing = function(t) {

    var n = 1.1;

    // equation y = sin(2x - 0.5Pi)
    // equation y = 2**(-10x)

    return Math.pow(2, -10 * t) * Math.sin((2 * t / n - 0.5) * Math.PI ) + 1;

  }

  var $contact_forms = $('form.blahlab_contact_form');

  for (var i = 0; i < $contact_forms.length; i++) {

    $($contact_forms[i]).validate({
      messages: { },
      submitHandler: function(form) {
        $.ajax({
          type: 'POST',
          url: 'send.php',
          data: $(form).serialize(),
          success: function(data) {
            if(data.match(/success/)) {
              $(form).trigger('reset');
              $(form).find('p.thanks').removeClass('hide').show().fadeOut(5000);
            }
          }
        });
        return false;
      }
    });

  }

  $(document).ready(function() {

    var svg = $('.header-svg svg');

    if ( !svg[0] ) { return; }

    var paths = Snap(svg[0]).selectAll('path');

    for(var i = 0; i < paths.length; i++) {
      paths[i].stop();
      paths[i].animate({
        path: $(paths[i].node).attr('data-mouseover')
      }, 1000, mina.elasticInEasing)
    }

  });


  $('#menu-toggler').on('click', function() {
    $(this).toggleClass('active');
    $('#menu-overlay').toggleClass('open');
    $('html').toggleClass('oneh');
    $('body').toggleClass('oneh');
  });


  $(document).ready(function() {

    var fullRows = $('.full');

    for (var i = 0; i < fullRows.length; i++) {

      var row = fullRows[i];

      (function(row) {

        var parallaxElems = $(row).find('img.parallax');

        for (var i = 0; i < parallaxElems.length; i++) {
          $(parallaxElems[i]).data('offsetTop', $(parallaxElems[i]).offset().top);
        }

        $(window).on('scroll', function() {

          if ( $(window).width() <= 824 ) return false;

          var scrollTop = $(this).scrollTop();

          for (var i = 0; i < parallaxElems.length; i++) {
            var elem = parallaxElems[i];

            var offsetTop = $(elem).data('offsetTop');
            var windowHeight = $(window).height();

            if ( ( offsetTop - scrollTop ) / windowHeight < 0.5 ) {

              var shift = 0.5 * (windowHeight) - (offsetTop - scrollTop);

              elem.style.transform = 'translateY(-' + shift * 0.3 + 'px)';

            }

          }

        });

      })(row);


    }

  });

  $(window).on('scroll', function() {


    // for header parallax effect
    var parent = document.getElementById('header');
    if ( $(parent).hasClass('animated') ) {
      // exclude .animo
      var children = $(parent).find('img, h1').not('.animo');
    } else {
      var children = $(parent).find('img, h1');
    }


    var children = $(parent).find('img, h1');

    var offset = $(this).scrollTop();

    if ( offset > 0 ) {
      mouseMoveLocked = true;
    } else {
      mouseMoveLocked = false;
    }

    for (var i = 0; i < children.length; i++) {
      if ($(children[i]).hasClass('animo') && $(parent).hasClass('animated') ) { continue; };

      var speed = $(children[i]).data('parallax-speed') ? parseFloat($(children[i]).data('parallax-speed')) : 1;

      children[i].style.transform = 'translateY(' + -1 *(offset * (i+1) / children.length) * speed + 'px)';
    }


    // for header elements animate down across bottom border

    var headerHeight = $('#header').height();
    // var headerOffsetTop = $('#header').offset().top;
    var pageScrollTop = $(document).scrollTop();

    // scroll hidden more than 2/3
    if ( !$('#header').hasClass('animated') && ( pageScrollTop > 0.8 * headerHeight) ) {

      $('#header').addClass('animated');

      var animos = $('#header .animo');

      for (var i = 0; i < animos.length; i++) {
        var animo = animos[i];
        var right = $(animo).data('animo-right');
        var bottom = $(animo).data('animo-bottom');
        var rotate = $(animo).data('animo-rotate');

        if ( !rotate ) {
          rotate = 0;
        }

        // back up initial right, bottom
        var initRight = $(animo).css('right');
        var initBottom = $(animo).css('bottom');

        $(animo).data('initRight', initRight);
        $(animo).data('initBottom', initBottom);

        // should overwrite transform
        $(animo).css({ right: right, bottom: bottom, transform: "translate(0, 0) rotate(" + rotate + ")" });
        // $(animo).css({ transform: transform, opacity: opacity });
      }

    }

    // scroll hidden less than 1/3
    if ( $('#header').hasClass('animated') && ( pageScrollTop < 0.5 * headerHeight ) ) {
      $('#header').removeClass('animated');

      var animos = $('#header .animo');

      for (var i = 0; i < animos.length; i++) {
        var animo = animos[i];
        $(animo).css({ right: $(animo).data('initRight'), bottom: $(animo).data('initBottom') });
      }

    }

  });


  var parallaxContainer = document.getElementById('header');
  var layers = $(parallaxContainer).find('img, h1');
  var mouseMoveLocked = false;

  function centerX() {

    for (var i = 0; i < layers.length; i++) {
      if ( $(layers[i]).hasClass('center-x') ) {

        for (var j = 0; j < 8; j++) {
          // multiple calculates for text re-layouting

          var width = $(layers[i]).width();
          var windowWidth = $('#header').width();

          var left = windowWidth / 2 - width / 2;

          $(layers[i]).css({ left: left });
        }

        $(layers[i]).show();

      }
    }

  }

  function centerY() {

    for (var i = 0; i < layers.length; i++) {

      if ( $(layers[i]).hasClass('center-y') ) {

        for (var j = 0; j < 8; j++) {
          // multiple calculates for text re-layouting

          var height = $(layers[i]).height();
          var windowHeight = $('#header').height();
          var reduction = windowHeight * 0.05;

          var top = (windowHeight - height - reduction) / 2

          $(layers[i]).css({ top: top });
        }

        $(layers[i]).show();

      }
    }

  }

  $(document).ready(function() {
    centerX();
    centerY();
  });

  $(window).on('resize', function() {
    centerX();
    centerY();
  });


  $(document).ready(function() {

    var works = $('.work-item');

    for (var i = 0; i < works.length; i++) {
      var work = works[i];

      $(work).on('mouseenter', function() {
        $(this).find('h3').show();

        // play video
        var video = $(this).find('video')[0];
        if (video) {
          video.play();
        }

      });

      $(work).on('mousemove', function(event) {

        var workOffset = $(this).offset();

        var titleWidth = $(this).find('h3').width();
        var titleHeight = $(this).find('h3').height();

        var top = event.pageY - workOffset.top - titleHeight / 2;
        var left = event.pageX - workOffset.left - titleWidth / 2;

        $(this).find('h3').css({ top: top, left: left });

      });

      $(work).on('mouseleave', function() {

        $(this).find('h3').hide();

        // pause video
        var video = $(this).find('video')[0];
        if (video) {
          video.pause();
        }
      });

    }

  });


  $(document).ready(function() {

    var svg = $('.new-footer svg path');

    if ( !svg[0] ) { return; }

    var path = Snap(svg[0]);

    $('.new-footer').on('mouseover', function() {
      path.stop();
      path.animate({
          path: $(path.node).attr("data-mouseover")
      }, 300, mina.elasticOutEasing)
    });

    $('.new-footer').on('mouseout', function() {
      path.stop();
      path.animate({
          path: $(path.node).attr("data-mouseout")
      }, 1000, mina.elasticInEasing)
    });


  });


  // move the mouse to the center to avoid start bump

  $(window).on('mousemove', function(e) {

    if ( mouseMoveLocked ) return;

    var x = e.clientX, y = e.clientY;

    var width = $(this).width();
    var height = $(this).height();

    for (var i = 0; i < layers.length; i++) {
      var deep = layers[i].getAttribute('data-parallax-deep');
      var itemX = - ( x - (width / 2) ) / deep * 2;
      var itemY = - ( y - (height / 2) ) / deep * 2;
      layers[i].style.transform = 'translateX(' + itemX + '%) translateY(' + itemY + '%)';
    }
  });

  $('.modBoxedTextSlider > .boxes').each(function() {
    var boxes = this;

    if ( $(boxes).hasClass('slick-initialized') ) return;

    $(boxes).slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: false,
      grabCursor: true,
      responsive: [
        {
          breakpoint: 2000,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 568,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });

  });


})(jQuery);