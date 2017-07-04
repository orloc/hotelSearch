"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _q = require("q");

var q = _interopRequireWildcard(_q);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProviderResponseAggregator = function () {
    function ProviderResponseAggregator() {
        _classCallCheck(this, ProviderResponseAggregator);
    }

    _createClass(ProviderResponseAggregator, [{
        key: "aggregate",


        // Maps our HTTP response package into just the data we care about
        // passes list on
        value: function aggregate(data) {
            var lists = data.map(function (d) {
                return d.results;
            });
            return this.mergeSorted.apply(this, _toConsumableArray(lists));
        }

        // Slice and reduce our lists through our sorter

    }, {
        key: "mergeSorted",
        value: function mergeSorted() {
            for (var _len = arguments.length, lists = Array(_len), _key = 0; _key < _len; _key++) {
                lists[_key] = arguments[_key];
            }

            return q.resolve(Array.prototype.slice.call(lists).reduce(this.doSort.bind(this)));
        }

        // traditional mergeSort of two sorted lists
        // we will just reduce our N lists through this function as
        // this is already pretty optimized, and a very standard implementation

    }, {
        key: "doSort",
        value: function doSort(a, b) {
            var result = new Array(a.length + b.length);
            var counts = {
                a: 0, b: 0, r: 0
            };

            // while we have matching indexes compare and sort appropriately
            while (counts.a < a.length && counts.b < b.length) {
                if (a[counts.a].ecstasy > b[counts.b].ecstasy) {
                    result[counts.r] = a[counts.a];
                    counts.a++;
                } else {
                    result[counts.r] = b[counts.b];
                    counts.b++;
                }
                counts.r++;
            }

            // sort out the rest in which ever list had more items
            while (counts.a < a.length) {
                result[counts.r] = a[counts.a];
                counts.a++;
                counts.r++;
            }

            while (counts.b < b.length) {
                result[counts.r] = b[counts.b];
                counts.b++;
                counts.r++;
            }

            return result;
        }
    }]);

    return ProviderResponseAggregator;
}();

exports.default = ProviderResponseAggregator;