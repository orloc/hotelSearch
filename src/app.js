import ClientProvider from './provider/ApiClientProvider';
import Aggregator from './service/ProviderResponseAggregator';
import express from "express";
import bodyParser from 'body-parser';
import * as q from "q";

const app = express();

/**
 * Config Variables to be stored externally to the application or injected via environment variables 
 * @type {string}
 */
const apiUrl = 'http://localhost:9000';
const apiPath = 'scrapers';
const port = 8000;

const provider = new ClientProvider(`${apiUrl}/${apiPath}`);
const aggregator = new Aggregator();

app.use(bodyParser.json());

/**
 * Base route which executes our promise chain and aggregates our results
 */
app.get('/hotels/search', (req, res, next) => {
    
    provider.all()
        .then((qs) => aggregator.aggregate(qs))
        .then((results) => q.resolve({results}))
        .then((data) => res.status(200).send(data))
        .catch((err) => next(err));
    
});

app.all('*', (req, res) => res.status(404).send({ 'message': 'Not found' }));

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

