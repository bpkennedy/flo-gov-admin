'use strict';

/**
* @ngdoc function
* @name clientApp.controller:search
* @description
* # search
* Controller of the clientApp
*/
angular.module('clientApp').factory('Search', function($sce) {
    function initialize() {
        var search = window.instantsearch({
          appId: '2YTXYMP8JH',
          apiKey: '6b7453f1533ef21b41cae656471a235c',
          indexName: 'my-florissant-gov',
          urlSync: true
        });

        search.addWidget(
          window.instantsearch.widgets.searchBox({
            container: '#search-box',
            placeholder: 'Search for products',
            autofocus: false,
            poweredBy: true,
            searchOnEnterKeyPressOnly: true,
            queryHook: function(query, search) {
                if (query === '' || query === ' ') {
                    return;
                } else {
                    search(query);
                }
            }
          })
        );

        search.addWidget(
          window.instantsearch.widgets.hits({
            container: '#hits-container',
            templates: {
                item: function(data) {
                    return '<h1>' + data.title + '</h1><p>' + data._snippetResult.fileContent.value +'</p>';
                }
            },
            // transformData: function(data) {
            //     // console.log(data);
            //     return data;
            // }
          })
        );

        search.addWidget(
          window.instantsearch.widgets.refinementList({
            container: '#docType',
            attributeName: 'docType',
            operator: 'or',
            limit: 10,
            templates: {
              header: 'Document Types'
            }
          })
        );

        search.addWidget(
          window.instantsearch.widgets.refinementList({
            container: '#fileType',
            attributeName: 'fileType',
            operator: 'or',
            limit: 10,
            templates: {
              header: 'File Types'
            }
          })
        );

        search.addWidget(
            window.instantsearch.widgets.pagination({
              container: '#pagination-container'
            })
        );

        search.addWidget(
          window.instantsearch.widgets.stats({
            container: '#stats-container'
          })
        );

        search.start();
    }

    return {
        initialize: initialize
    };
});
