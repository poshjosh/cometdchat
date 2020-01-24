var docUtil = {
    
    documentVisibility: undefined,
    
    propToggler: {

        mTimeoutId : undefined,
        mArrayIndex : 0,
        mTarget : null,
        mPropName : null,
        mOldPropValue : null,
        mNewPropValue : null,

        toggleProperty : function(target, intervalMillis, timeoutMillis, propName, propValues) {
            if(!docUtil.propToggler.mTimeoutId) {
                docUtil.propToggler.mTarget = target;
                docUtil.propToggler.mPropName = propName;
                docUtil.propToggler.mOldPropValue = target[propName];
                docUtil.propToggler.mNewPropValue = docUtil.propToggler.getActualValue(propValues);
//                window.alert("target["+propName+"] = " + blinker.mOldPropValue);
                docUtil.propToggler.mTimeoutId = setInterval(docUtil.propToggler.toggle, intervalMillis);
                setTimeout(docUtil.propToggler.reset, timeoutMillis);
            }
        },

        getActualValue : function(arg) {
            var ret;
            if(arg instanceof Array) {
                if(arg.length === 0) {
                    throw "Empty Array not a valid argument";
                } else if(arg.length === 1) {
                    ret = arg[0];
                }else{
                    ret = arg;
                }
            }else{
                ret = arg;
            }
            return ret;
        },

        toggle : function() { 
            var x;
            var y;
            if(docUtil.propToggler.mNewPropValue instanceof Array) {
                x = docUtil.propToggler.mNewPropValue[docUtil.propToggler.mArrayIndex];
                y = docUtil.propToggler.mNewPropValue[docUtil.propToggler.nextArrayIndex()];
            }else{
                x = docUtil.propToggler.mNewPropValue;
                y = ' ';
            }
            
            docUtil.propToggler.setTargetProperty(docUtil.propToggler.mTarget[docUtil.propToggler.mPropName] === x ? y : x);
        },
        
        nextArrayIndex : function() {
            docUtil.propToggler.mArrayIndex = docUtil.propToggler.mArrayIndex + 1;
            if(docUtil.propToggler.mArrayIndex >= docUtil.propToggler.mNewPropValue.length) {
                docUtil.propToggler.mArrayIndex = 0;
            }
            return docUtil.propToggler.mArrayIndex;
        },

        reset : function() {
            clearInterval(docUtil.propToggler.mTimeoutId);
            docUtil.propToggler.setTargetProperty(docUtil.propToggler.mOldPropValue);
            docUtil.propToggler.mArrayIndex = 0;
            docUtil.propToggler.mNewPropValue = null;
            docUtil.propToggler.mOldPropValue = null;
            docUtil.propToggler.mPropName = null;
            docUtil.propToggler.mTarget = null;
            docUtil.propToggler.mTimeoutId = null;
        },
        
        setTargetProperty : function(propValue) {
            docUtil.propToggler.mTarget[docUtil.propToggler.mPropName] = propValue;
        }
    },

    addLoadEvent: function(func) {
//window.alert("#addLoadEvent. Function: "+func);    
        var oldonload = window.onload;
//window.alert("#addLoadEvent. OLD Function: "+oldonload);    
        if (typeof window.onload !== 'function') {
            window.onload = func;
        }else{
            window.onload = function() {
                if (oldonload) {
                    oldonload();
                }
                func();
            };
        }
    },

    getElementById: function (x){
        if(document.getElementById) {
            return document.getElementById(x);
        }else if(document.all) {
            return document.all(x);
        } else {
            return null;
        }
    },

    addVisibilityListener : function(listener) {
        var hidden = "hidden";
        // Standards:
        if (hidden in document) {
            document.addEventListener("visibilitychange", listener);
        }else if ((hidden = "mozHidden") in document) {
            document.addEventListener("mozvisibilitychange", listener);
        }else if ((hidden = "webkitHidden") in document) {
            document.addEventListener("webkitvisibilitychange", listener);
        }else if ((hidden = "msHidden") in document) {
            document.addEventListener("msvisibilitychange", listener);
        // IE 9 and lower:
        }else if ("ondomfocusin" in document) {
            document.ondomfocusin = document.ondomfocusout = listener;
        }else if ("onfocusin" in document) {
            document.onfocusin = document.onfocusout = listener;
        // All others:
        }else{
            window.onpageshow = window.onpagehide = window.onfocus = window.onblur = listener;
        }
    },

    setDocumentVisibility : function(v) {
        docUtil.documentVisibility = v;
    },

    isDocumentVisible : function() {
        return docUtil.documentVisibility === "visible";
    },

    getDocumentVisibility : function() {
        return docUtil.documentVisibility;
    },

    toggleProperty : function (target, intervalMillis, timeoutMillis, propName, propValues) {
        docUtil.propToggler.toggleProperty(target, intervalMillis, timeoutMillis, propName, propValues);
    },

    resetPropertyToggler : function() {
        docUtil.propToggler.reset();
    },
    
    _onchange: function(evt) {

        var v = "visible", h = "hidden",
            evtMap = {
              focus:v, focusin:v, domfocusin:v, pageshow:v, blur:h, focusout:h, domfocusout:h, pagehide:h
            };

        evt = evt || window.event;

        var mVisibility;
        if (evt.type in evtMap) {
            mVisibility = evtMap[evt.type];
        }else{
            mVisibility = document['hidden'] ? h : v;
        }

        docUtil.setDocumentVisibility(mVisibility); 
    },
    
    addVisibilityListenerForOnChangeEvent: function() {
        
        var visibilityListener = function(evt) {
            docUtil._onchange(evt);
        };
        
        docUtil.addVisibilityListener(visibilityListener);
    },
    
    updateVisibilityIfSupported: function() {
        if( document.hasOwnProperty('hidden')) {
            docUtil._onchange({type: document['hidden'] ? "blur" : "focus"});
        }  
    },

    onDocumentLoad: function() {

        docUtil.addVisibilityListenerForOnChangeEvent();
        
        docUtil.updateVisibilityIfSupported();
    },

    displayError: function(msg) {
        docUtil.displayMessage(msg, "#EE7777");
    },
    
    displayInfo: function(msg) {
        docUtil.displayMessage(msg, "#77EE77");
    },

    displayMessage: function(msg, backgroundColor) {
        $("body").prepend("<div style=\"background:" + backgroundColor + 
                "; width:100%; padding:0.25em; margin-bottom:0.5em;\">" + msg + "</div>");
    }
};

module.exports = docUtil;

