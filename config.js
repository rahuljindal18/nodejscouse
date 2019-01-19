/*
 * Create and export config variables
 *
 * 
 */   

 //Container for all the environments
 var environments = {};

 //Staging (Default) environment
 environments.staging = {
     'httpPort':3000,
     'httpsPort':3001,
     'envName':'staging'
 }

 //Production Environment
 environments.production = {
    'httpPort':5000,
    'httpsPort':5001,
    'envName':'production'
}

//Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//Check that current environment is one of the above environment, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;


//Export module

module.exports = environmentToExport;

 
