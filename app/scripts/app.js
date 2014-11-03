(function(window, $, undefined) {
  'use strict';

  console.log('Hello, BARExpressionViewer!');

  var appContext = $('[data-app-name="barexpressionviewer"]');

  /* Generate Agave API docs */
  window.addEventListener('Agave::ready', function() {
    var Agave = window.Agave;

    var context, formName, api;

    context = $('.gene_expression_viewer');

    formName = 'gene_expression_viewer_form';
    api = 'https://api.araport.org/data/BioAnalyticResource/efp_service/pr2-0.1/?request=';

    $('form[name='+formName+']').on('submit', function(e) {
      e.preventDefault();

      var imgUrl, imgEl, query;

      query = {
        agi: $('#gene_expression_viewer_gene').val(),
        datasource: $('#gene_expression_viewer_datasource').val()
      };

      if (query.agi.length > 0) {
        imgUrl = api + JSON.stringify(query);

        imgEl = $('<img>').attr('src', imgUrl).width('100%');

        $('.gene_expression_viewer_messages').empty();
        $('.gene_expression_viewer_progress').removeClass('hidden');

        imgEl.on('load', function() {
          $('.gene_expression_viewer_progress').addClass('hidden');
        });

        imgEl.on('error', function() {
          $('.gene_expression_viewer_progress').addClass('hidden');
          $('.gene_expression_viewer_messages').html('<p class="alert alert-danger">There was an error loading the image for <em>'+ query.agi +'</em>.</p>');
        });

        $('.gene_expression_viewer_result').html(imgEl);
      } else {
        window.alert('You must enter a gene first.');
      }
    }).on('reset', function() {
      $('.gene_expression_viewer_result').empty();
      $('.gene_expression_viewer_messages').empty();
    });


    // initial value
    var initgene = $('#gene_expression_viewer_gene').data('initial-value');
    $('#gene_expression_viewer_gene').val(initgene);

    var initds = $('#gene_expression_viewer_datasource').data('initial-value');
    $('#gene_expression_viewer_datasource').val(initds).prop('selected', true);
  });
})(window, jQuery);
