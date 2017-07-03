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
        let aCount = 0, bCount = 0, rCount = 0;

        // while we have matching indexes compare and sort appropriately
        while( aCount < a.length && bCount < b.length){
            if (a[aCount].ecstasy > b[bCount].ecstasy) {
                result[rCount] = a[aCount];
                aCount++;
            } else {
                result[rCount] = b[bCount];
                bCount++;
            }
            rCount++;
        }

        // sort out the rest in which ever list had more items
        while (aCount < a.length){
            result[rCount] = a[aCount];
            aCount++;
            rCount++;
        }

        while (bCount < b.length){
            result[rCount] = b[bCount];
            bCount++;
            rCount++;
        }
        
        return result;
    }
}

export default ProviderResponseAggregator;