const {ApolloClient }= require('apollo-boost');
const {InMemoryCache }= require('apollo-cache-inmemory');
const {createHttpLink }= require('apollo-link-http');
const {fetch }= require('cross-fetch/polyfill');

const apollo_client = new ApolloClient({
    link: createHttpLink({
        uri: 'https://accurate-vervet-15.hasura.app/v1/graphql',
        headers: {
            "content-type": "application/json",
            "x-hasura-admin-secret":"skyisbluesamuelnoah",
        }
    }),
    cache: new InMemoryCache()
})


module.exports = apollo_client;