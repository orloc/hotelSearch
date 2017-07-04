import * as q from "q";

class ProviderResponseAggregator {

    // Maps our HTTP response package into just the data we care about
    // passes list on
    aggregate(data){
        const lists = data.map((d) => d.results);
        return this.mergeSorted(...lists)
    }

    // Slice and reduce our lists through our sorter
    mergeSorted(...lists) {
        return q.resolve(Array.prototype.slice.call(lists).reduce(this.doSort.bind(this)));
    }

    // traditional mergeSort of two sorted lists
    // we will just reduce our N lists through this function as
    // this is already pretty optimized, and a very standard implementation
    doSort(a,b){
        let result = new Array( a.length + b.length);
        const counts = {
            a : 0, b: 0, r: 0
        };

        // while we have matching indexes compare and sort appropriately
        while( counts.a < a.length && counts.b < b.length){
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
        while (counts.a < a.length){
            result[counts.r] = a[counts.a];
            counts.a++;
            counts.r++;
        }

        while (counts.b < b.length){
            result[counts.r] = b[counts.b];
            counts.b++;
            counts.r++;
        }
        
        return result;
    }
}

export default ProviderResponseAggregator;