const Locator = require('codeceptjs/lib/locator');

async function setup() {
    let debug = process.env.E2E_DEBUG || 'false'
    if(debug === 'true') {
        // If debug is set to true we add the search type and value to the output set by .as()
        // this way it is possible to debug search path generated by the locator in the browser
        // and check why it does not work and how to fix it
        console.log(`Debug: ${debug}, overwrite locator.toString()`)
        Locator.prototype.toString = function() {
            return `${this.output}\n(Debug: {${this.type}: ${this.value}})`;
        }
    } else {
        console.log(`Debug: ${debug}, don't overwrite locator.toString()`)
    }
}
module.exports = {
    setup
}