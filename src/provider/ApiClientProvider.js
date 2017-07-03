import * as q from "q";
import request from "request";

/**
 * Provides an interface to the Hipmunk API client
 * Takes a base URL to point to which is provided by the caller
 */
class ApiClientProvider {

    /**
     * Set up valid sources - these sources IRL could be stored in some configuration database etc.
     * same things for for the contrived error messages here - as this application grew
     * I would formalize errors into proper classes  which extended Error to keep things simple
     * and not reinvent the wheel. 
     * @param apiBase
     */
    constructor(apiBase){
        if (!apiBase) throw new Error('Must pass a valid URL for the API base');
        this.apiBase = apiBase;

        this.errors = {
            INVALID_SOURCE:  'Invalid API Source'
        };

        this.sources = [
            'expedia', 'hilton', 'orbitz',
            'priceline', 'travelocity'
        ];
    }

    /**
     * Return an array of responses from all registered providers
     * If we throw an error - we do not try and partially serve information
     * @returns Promise<Array<Promise>>
     */
    all(){
        const promises = this.sources
            .map((s) => this.getUrl(s))
            .map((url) => this.getSource(url));
        
        return q.all(promises);
    }

    /**
     * Make the HTTP request to which ever endpoint to get the data or fail
     * @returns Promise
     */
    getSource(source) {
        const deferred = q.defer();

        // taking advantage of default GET laziness here
        request(source, (err, req, body) => {
            if (err) {
                deferred.reject(err);
                return deferred.promise;
            }

            try {
                const parsed = JSON.parse(body);
                deferred.resolve(parsed);
            } catch(e){
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
    getUrl(source){
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
    isValidSource(source){
        return this.sources.indexOf(source) >= 0;
    }
}

export default ApiClientProvider;