/* jshint camelcase: false */
(function(window, $, undefined) {
    'use strict';

    console.log('Hello, BARExpressionViewer!');
    var appContext = $('[data-app-name="barexpressionviewer"]');
    var base_url = 'https://api.araport.org/community/v0.3/aip/efp_by_locus_v0.2.0/search';

    window.addEventListener('Agave::ready', function() {
        var Agave = window.Agave;

        var is_valid_agi_identifier = function is_valid_agi_identifier(id) {
            var pattern = /AT[1-5MC]G[0-9]{5,5}/i;
            return id.match(pattern) ? true : false;
        };

        var errorMessage = function errorMessage(message) {
            return '<div class="alert alert-danger fade in" role="alert">' +
                   '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
                   '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span> ' +
                   message + '</div>';
        };

        var showImage = function showImage(obj) {
            var reader = new FileReader();
            reader.onload = function() {
                $('.gene_expression_viewer_progress', appContext).addClass('hidden');
                var img = new Image();
                img.src = reader.result;
                $('.gene_expression_viewer_result', appContext).html(img);
            };
            reader.readAsDataURL(new Blob([obj], {type: 'image/png'}));
        };

        $('#gene_expression_viewer_form', appContext).on('submit', function(e) {
            e.preventDefault();

            var query = {
                locus: $('#gene_expression_viewer_gene', appContext).val(),
                source: $('#gene_expression_viewer_datasource', appContext).val()
            };

            if (! is_valid_agi_identifier(query.locus)) {
                $('.gene_expression_viewer_messages', appContext).html(errorMessage('Please enter a valid AGI identifier!'));
                return;
            }

            // start progress bar
            $('.gene_expression_viewer_messages', appContext).empty();
            $('.gene_expression_viewer_progress', appContext).removeClass('hidden');

            if (query.locus.length > 0) {
                // Had to drop down to XMLHttpRequest for binary data... Yuck!
                var req_url = base_url + '?locus=' + query.locus + '&source=' + query.source;
                var request = new XMLHttpRequest();
                request.open('GET', req_url, true);
                request.setRequestHeader('Authorization', 'Bearer ' + Agave.token.accessToken);
                request.responseType = 'blob';
                request.onload = function () {
                    if (this.status === 200) {
                        var blob = request.response;
                        showImage(blob);
                    } else {
                        var msg = 'Problem querying for \'' + query.locus + '\' at BAR. Please try again.';
                        $('.gene_expression_viewer_messages', appContext).html(errorMessage(msg));
                        console.error(msg);
                    }
                };
                request.onerror = function (e) {
                    var msg = 'Problem querying for \'' + query.locus + '\' at BAR. Please try again.';
                    $('.gene_expression_viewer_messages', appContext).html(errorMessage(msg));
                    console.error('Error query for \'' + query.locus + '\' at BAR --> Status: ' + e.status + ' (' + e.statusText + ') Response: ' + e.responseText);
                };
                request.send();
            } else {
                window.alert('You must enter a gene first.');
            }
        }).on('reset', function() {
            $('.gene_expression_viewer_result', appContext).empty();
            $('.gene_expression_viewer_messages', appContext).empty();
        });
    });
})(window, jQuery);
