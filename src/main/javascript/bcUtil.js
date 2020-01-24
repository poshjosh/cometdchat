var bcUtil = {
    
    verbose : false,
    nonce : 0, /** Used to uniquely identify randomly generated usernames */
    
    /**
     * @param {string} str the string to truncate to 0 < len <= max
     * @param {number} max the maximum length for the output
     * @param {string} suffix
     * @returns the truncated string
     */
    truncate: function(str, max, suffix) {
        var len = str.length;
        var res = str.substring(0, Math.min(len, max));
        return suffix && suffix !== null && res.length < len ? res + suffix : res;
    },
    
    requireType: function(candidate, type) {
        var foundType = typeof(candidate);
        if(foundType !== type){
            throw {name:"IllegalTypeError", message: "Expected type" + type + ", Found type: " + foundType};
        }
        return candidate;
    },
    
    generateRandomUsername: function(prefix) {
        prefix = (prefix && prefix !== null) ? prefix + '_' : '';
        return prefix + (new Date().getTime() + bcUtil.nonce ++).toString(16);
    },
    
    // Skip unnecessary comparisons using the second parameter of indexOf to skip ahead.
    // Works in Internet explorer
    stringEndsWith : function(str, suffix, ignoreCase) {
        if(ignoreCase) {
            str = str.toLowerCase();
            suffix = suffix.toLowerCase();
        }
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    },

    extractUsernameFromEmail : function(email) {
        var valueToDisplay = email;
        var endPos = valueToDisplay.indexOf("@");
        if(endPos !== -1 && endPos > 0) {
            valueToDisplay = valueToDisplay.substring(0, endPos);
        }
        return valueToDisplay;
    },

    /**
     * @param {any} msg
     * @returns true if the log was done, otherwise return false
     */
    log : function(msg) {
        if(bcUtil.verbose) {
            try{
                
                msg = typeof(msg) === "object" ? JSON.stringify(msg) : 
                        typeof(msg) === 'function' ? msg() : msg;
                
                console.info(msg); 
                
                $("body").append("" + msg + "<br/>");
                
                return true;
            }catch(err) { 
                try{
                    console.error(err);
                }catch(ignore) {}
            }
        }
        return false;
    },

    isVerbose : function() {
        return bcUtil.verbose;
    },
    
    init : function(cfg) {
        
        var configVerbose = cfg.hasOwnProperty('logLevel') && cfg['logLevel'] === 'debug';
        
        bcUtil.log("Verbose: " + configVerbose);

        bcUtil.verbose = configVerbose;
    }
};

module.exports = bcUtil;

