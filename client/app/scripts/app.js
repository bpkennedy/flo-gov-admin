'use strict';

/**
* @ngdoc overview
* @name clientApp
* @description
* # clientApp
*
* Main module of the application.
*/
angular
.module('clientApp', [
    'ng-admin'
])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
}])
.config(['NgAdminConfigurationProvider', function (nga) {
    // create an admin application
    var firebaseRootUrl = "https://my-florissant-gov.firebaseio.com/";
    var admin = nga.application('My First Admin')
    .baseApiUrl(firebaseRootUrl); // main API endpoint

    // create a bill entity
    // the API endpoint for this entity will be 'http://my-florissant-gov.firebaseio.com/bills/:id
    var bill = nga.entity('bills').url(function(view, viewType, entityId) {
        var url = firebaseRootUrl + view + '.json';
        if (entityId) {
            url = firebaseRootUrl + view + '/' + entityId + '.json';
        }
        return url;
    }).identifier(nga.field('key'));
    // set the fields of the user entity list view
    bill.listView().fields([
        nga.field('key'),
        nga.field('title'),
        nga.field('introducedBy')
    ]).listActions(['show', 'edit']);

    bill.showView().fields([
        nga.field('key'),
        nga.field('date', 'date'),
        nga.field('title'),
        nga.field('introducedBy')
    ]);

    bill.editionView().fields([
        // nga.field('key'),
        nga.field('title'),
        nga.field('date', 'date'),
        nga.field('docType', 'choice').choices([
            { value: 'Bill', label: 'Bill' },
            { value: 'Resolution', label: 'Resolution' },
        ]),
        nga.field('govId', 'number'),
        nga.field('introducedBy'),
        nga.field('fileContent', 'wysiwyg')
    ]).title(`Edit bill`).onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) { // jshint ignore:line
        notification.log('There was a problem.  Changes not saved.', { addnCls: 'humane-flatty-error' });
    }]);

    bill.creationView().fields([
        nga.field('key'),
        nga.field('title'),
        nga.field('introducedBy')
    ]).onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) { // jshint ignore:line
         // stop the progress bar
         progression.done();
         // add a notification
         notification.log(`Element ${entry.name} successfully edited.`, { addnCls: 'humane-flatty-success' });
         // redirect to the list view
         $state.go($state.get('list'), { entity: entity.name() });
         // cancel the default action (redirect to the edition view)
         return false;
    }]).onSubmitError(['error', 'form', 'progression', 'notification', function(error, form, progression, notification) { // jshint ignore:line
        console.log(error);
    }]);

    // add the user entity to the admin application
    admin.addEntity(bill);

    // more configuration here later
    // ...
    // attach the admin application to the DOM and execute it
    nga.configure(admin);
}])
.config(['RestangularProvider', function(RestangularProvider) {
    // RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params) {
    //     // The firebase api has an unusual interface, so this may not be helpful. Leaving it here for reference.
    //     if (operation == "getList") {
    //         //// custom sort params
    //         //if (params._sortField && params._sortField == "name") {
    //         //  params.orderBy = '\"' + params._sortField + '\"';
    //         //  params.startAt = '\"A\"';
    //         //}
    //         //delete params._sortField;
    //         //delete params._sortDir;
    //         //
    //         //// custom pagination params
    //         //if (params._page && params.orderBy && params.orderBy == "id") {
    //         //  params.startAt = (params._page - 1) * params._perPage;
    //         //  params.endAt = params._page * params._perPage;
    //         //}
    //         //delete params._page;
    //         //delete params._perPage;
    //         //
    //         //// custom filters
    //         //if (params._filters) {
    //         //  for (var filter in params._filters) {
    //         //    params[filter] = params._filters[filter];
    //         //  }
    //         //}
    //         //delete params._filters;
    //     }
    //     return {params: params};
    // });

    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) { // jshint ignore:line
        var results = data;

        if (operation === "post") {
            window.firebase.database().ref('bills/' + response.data.name).update({
                key: response.data.name
            });
        }

        if (operation === "getList") {
            if (Object.prototype.toString.call(results) !== '[object Array]') {
                // transform object to array
                results = [];
                for (var property in data) {
                    if (data.hasOwnProperty(property)) {
                        results.push(data[property]);
                    }
                }
            }

            if (response.config.params && response.config.params._sortField) {
                var sortField = response.config.params._sortField;
                var sortDirection = response.config.params._sortDir;
                var lessThanResult = -1;
                var greaterThanResult = 1;
                if (sortDirection === "DESC") {
                    lessThanResult = 1;
                    greaterThanResult = -1;
                }
                var compareSortFields = function(a, b) {
                    if (a[sortField] < b[sortField]) {
                        return lessThanResult;
                    }
                    if (a[sortField] > b[sortField]) {
                        return greaterThanResult;
                    }
                    return 0;
                };

                if (results[0].hasOwnProperty(sortField)) {
                    results.sort(compareSortFields);
                }
            }
        }

        return results;
    });
}]);
