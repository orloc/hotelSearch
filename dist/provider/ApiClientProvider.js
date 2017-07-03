"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _q = require("q");

var q = _interopRequireWildcard(_q);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Provides an interface to the Hipmunk API client
 * Takes a base URL to point to which is provided by the caller
 */
var ApiClientProvider = function () {

    /**
     * Set up valid sources - these sources IRL could be stored in some configuration database etc.
     * same things for for the contrived error messages here - as this application grew
     * I would formalize errors into proper classes  which extended Error to keep things simple
     * and not reinvent the wheel. 
     * @param apiBase
     */
    function ApiClientProvider(apiBase) {
        _classCallCheck(this, ApiClientProvider);

        if (!apiBase) throw new Error('Must pass a valid URL for the API base');
        this.apiBase = apiBase;

        this.errors = {
            INVALID_SOURCE: 'Invalid API Source'
        };

        this.sources = ['expedia', 'hilton', 'orbitz', 'priceline', 'travelocity'];
    }

    /**
     * Return an array of responses from all registered providers
     * If we throw an error - we do not try and partially serve information
     * @returns Promise<Array<Promise>>
     */


    _createClass(ApiClientProvider, [{
        key: "all",
        value: function all() {
            var _this = this;

            var promises = this.sources.map(function (s) {
                return _this.getUrl(s);
            }).map(function (url) {
                return _this.getSource(url);
            });

            return q.all(promises);
        }

        /**
         * Make the HTTP request to which ever endpoint to get the data or fail
         * @returns Promise
         */

    }, {
        key: "getSource",
        value: function getSource(source) {
            var deferred = q.defer();

            (0, _request2.default)(source, function (err, req, body) {
                if (err) {
                    deferred.reject(err);
                    return deferred.promise;
                }

                try {
                    var parsed = JSON.parse(body);
                    deferred.resolve(parsed);
                } catch (e) {
                    deferred.reject(e);
                }
            });

            return deferred.promise;
        }

        /**
         * Handle some validation and parse our source list into a valid URI
         * @param source
         * @returns {string}
         */

    }, {
        key: "getUrl",
        value: function getUrl(source) {
            if (!this.isValidSource(source)) {
                throw new Error(this.errors.INVALID_SOURCE);
            }
            return [this.apiBase, source].join('/');
        }

        /**
         * Confirm things are OK
         * @param source
         * @returns {boolean}
         */

    }, {
        key: "isValidSource",
        value: function isValidSource(source) {
            return this.sources.indexOf(source) >= 0;
        }
    }]);

    return ApiClientProvider;
}();

exports.default = ApiClientProvider;