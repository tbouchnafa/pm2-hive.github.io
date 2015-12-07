(function() {

  $(document).ready(function() {

    function FormatForUrl(str) {
      return str.replace(/_/g, '-')
        .replace(/ /g, '-')
        .replace(/:/g, '-')
        .replace(/\\/g, '-')
        .replace(/\//g, '-')
        .replace(/[^a-zA-Z0-9\-]+/g, '')
        .replace(/-{2,}/g, '-')
        .toLowerCase();
    };

    $('.docs-content').find('h2, h3, h1').each(function() {
      var anchor = FormatForUrl($(this).text());
      $(this).wrap('<a class="auto-anchor" href="#' + anchor + '"></a>');
    });

    var STRING_DECAMELIZE_REGEXP = (/([a-z\d])([A-Z])/g);
    var STRING_STRIP_HTML_REGEXP = (/(<[^>]*>)/g);
    var STRING_DASHERIZE_REGEXP  = (/[^a-z\d]+/g);

    var decamelize = _.memoize(function(str) {
      return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
    });

    var stripHtml = _.memoize(function(str) {
      return str.replace(STRING_STRIP_HTML_REGEXP, '');
    });

    var dasherize = _.memoize(function(str) {
      return decamelize(stripHtml(str)).replace(STRING_DASHERIZE_REGEXP, '-');
    });

    var headings = [];

    $('h2, h3').each(function(index, heading) {
      var textContent = heading.textContent;
      var id = dasherize(textContent);

      heading.id = id;

      var value = {
        el: headings,
        id: heading.id,
        text: textContent,
        children: []
      };

      if (heading.tagName.toUpperCase() === 'H2') {
        headings.push(value);
        current = value;
      } else {
        current.children.push(value);
      }
    });

    var selects = $('.nav .active .dropdown-menu li');

    selects.each(function () {
      var title = $(this);

      if (title.attr('class') == 'active') {
        var usage = title.next().children().attr('href');
        $('.sidebar .next-page').attr('href', usage);

        if (usage != undefined) {
          $('.sidebar .next-page').show();
        }

      }

    });

    function renderHeadings(headings) {
      var template = '';

      _.each(headings, function(heading) {
        template += '<li><a href="#' + heading.id + '">' + heading.text + '</a>';

        if (heading.children.length) {
          template += '<ul class="nav">';
          template += renderHeadings(heading.children);
          template += '</ul>';
        }

        navContent += '</li>';
      }, this);

      return template;
    }

    var navContent = renderHeadings(headings);

    var $sidebar = $('.sidebar');

    $sidebar.find('.auto-nav').html(navContent);

    var navigator = $('#navigator');
    var navtop = navigator.offset().top;

    $(document).scroll(function() {
      if (navtop < $(document).scrollTop())
        navigator.addClass('navigator-fixed');
      else
        navigator.removeClass('navigator-fixed');
    });

    // $sidebar.affix({
    //   offset: {
    //     top: _.memoize(function() {
    //       var offsetTop = $sidebar.offset().top;
    //       var navbarOuterHeight = $('.navbar').height();
    //       var sidebarMargin = parseInt($sidebar.children(0).css('margin-top'), 10);

    //       return offsetTop - navbarOuterHeight - sidebarMargin;
    //     }),
    //     bottom: _.memoize(function() {
    //       return $('.footer').outerHeight(true);
    //     })
    //   }
    // });

    var $body = $(document.body);

    $body.scrollspy({
      target: '.sidebar',
      offset: 100
    });

    //$('td:contains("✓")').addClass('bg-success');
  });
}());
