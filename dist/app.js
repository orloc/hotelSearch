'use strict';

var _ApiClientProvider = require('./provider/ApiClientProvider');

var _ApiClientProvider2 = _interopRequireDefault(_ApiClientProvider);

var _ProviderResponseAggregator = require('./service/ProviderResponseAggregator');

var _ProviderResponseAggregator2 = _interopRequireDefault(_ProviderResponseAggregator);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _q = require('q');

var q = _interopRequireWildcard(_q);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

/**
 * Config Variables to be stored externally to the application or injected via environment variables 
 * @type {string}
 */
var apiUrl = 'http://localhost:9000';
var apiPath = 'scrapers';
var port = 8000;

var provider = new _ApiClientProvider2.default(apiUrl + '/' + apiPath);
var aggregator = new _ProviderResponseAggregator2.default();

app.use(_bodyParser2.default.json());

/**
 * Base route which executes our promise chain and aggregates our results
 */
app.get('/hotels/search', function (req, res, next) {

    provider.all().then(function (qs) {
        return aggregator.aggregate(qs);
    }).then(function (results) {
        return q.resolve({ results: results });
    }).then(function (data) {
        return res.status(200).send(data);
    }).catch(function (err) {
        return next(err);
    });
});

app.all('*', function (req, res) {
    return res.status(404).send({ 'message': 'Not found' });
});

app.listen(port, function () {
    console.log('Listening on port ' + port);
});