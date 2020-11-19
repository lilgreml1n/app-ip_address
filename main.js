
const IPCIDR = require('ip-cidr');
const path = require('path');
// Need this section as it's going to interpret the ipv6 address
const { getIpv4MappedIpv6Address } = require(path.join(__dirname, 'ipv6.js'));

class IpAddress {
  constructor() {
    // IAP's global log object is used to output errors, warnings, and other
    // information to the console, IAP's log files, or a Syslog server.
    // For more information, consult the Log Class guide on the Itential
    // Developer Hub https://developer.itential.io/ located
    // under Documentation -> Developer Guides -> Log Class Guide
    // Don't understand why i can't get this to work....
    //log.info('Starting the IpAddress product.');  
  }
    /**
    * Calculate and return the first host IP address from a CIDR subnet.
    * @param {string} cidrStr - The IPv4 subnet expressed
    *                 in CIDR format.
    * @param {callback} callback - A callback function.
    * @return {string} (firstIpAddress) - An IPv4 address.
    */
    getFirstIpAddress(cidrStr, callback) {

    // Initialize return arguments for callback
    let ipv6Address = null;
    let firstIpAddress = null;
    let callbackError = null;


    // Instantiate an object from the imported class and assign the instance to variable cidr.
    const cidr = new IPCIDR(cidrStr);
    // Initialize options for the toArray() method.
    // We want an offset of one and a limit of one.
    // This returns an array with a single element, the first host address from the subnet.
    const options = {
        from: 1,
        limit: 1
    };

    // Use the object's isValid() method to verify the passed CIDR.
    if (!cidr.isValid()) {
        // If the passed CIDR is invalid, set an error message.
        callbackError = 'Error: Invalid CIDR passed to getFirstIpAddress.';
    } else {
        // If the passed CIDR is valid, call the object's toArray() method.
        // Notice the destructering assignment syntax to get the value of the first array's element.
        // ip v4
        [firstIpAddress] = cidr.toArray(options);
        // ip v6
        ipv6Address = getIpv4MappedIpv6Address(firstIpAddress)
    }
    // Call the passed callback function.
    // Node.js convention is to pass error data as the first argument to a callback.
    // The IAP convention is to pass returned data as the first argument and error
    // data as the second argument to the callback function.

    // not a node expert, but trying to return a json ipv4: $ip test ip 1.1.1.0/24 retursn 1.1.1.1 & ipv6: $ipv6
    return callback({ipv4: firstIpAddress, ipv6: ipv6Address}, callbackError);
    }
}

module.exports = new IpAddress;
