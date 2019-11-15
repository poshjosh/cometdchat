/* 
 * Copyright 2018 NUROX Ltd.
 *
 * Licensed under the NUROX Ltd Software License (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.looseboxes.com/legal/licenses/software.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var bcDocumentUtils = function(){
    
    var documentVisibility = undefined;
    
    var propertyToggler = {

        mTimeoutId : undefined,
        mArrayIndex : 0,
        mTarget : null,
        mPropName : null,
        mOldPropValue : null,
        mNewPropValue : null,

        toggleProperty : function(target, intervalMillis, timeoutMillis, propName, propValues) {
            if(!propertyToggler.mTimeoutId) {
                propertyToggler.mTarget = target;
                propertyToggler.mPropName = propName;
                propertyToggler.mOldPropValue = target[propName];
                propertyToggler.mNewPropValue = propertyToggler.getActualValue(propValues);
//                window.alert("target["+propName+"] = " + blinker.mOldPropValue);
                propertyToggler.mTimeoutId = setInterval(propertyToggler.toggle, intervalMillis);
                setTimeout(propertyToggler.reset, timeoutMillis);
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
            if(propertyToggler.mNewPropValue instanceof Array) {
                x = propertyToggler.mNewPropValue[propertyToggler.mArrayIndex];
                y = propertyToggler.mNewPropValue[propertyToggler.nextArrayIndex()];
            }else{
                x = propertyToggler.mNewPropValue;
                y = ' ';
            }
            
            propertyToggler.setTargetProperty(propertyToggler.mTarget[propertyToggler.mPropName] === x ? y : x);
        },
        
        nextArrayIndex : function() {
            propertyToggler.mArrayIndex = propertyToggler.mArrayIndex + 1;
            if(propertyToggler.mArrayIndex >= propertyToggler.mNewPropValue.length) {
                propertyToggler.mArrayIndex = 0;
            }
            return propertyToggler.mArrayIndex;
        },

        reset : function() {
            clearInterval(propertyToggler.mTimeoutId);
            propertyToggler.setTargetProperty(propertyToggler.mOldPropValue);
            propertyToggler.mArrayIndex = 0;
            propertyToggler.mNewPropValue = null;
            propertyToggler.mOldPropValue = null;
            propertyToggler.mPropName = null;
            propertyToggler.mTarget = null;
            propertyToggler.mTimeoutId = null;
        },
        
        setTargetProperty : function(propValue) {
            propertyToggler.mTarget[propertyToggler.mPropName] = propValue;
        }
    };

    return {
        
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
            documentVisibility = v;
        },
        
        isDocumentVisible : function() {
            return documentVisibility == "visible";
        },

        getDocumentVisibility : function() {
            return documentVisibility;
        },

        toggleProperty : function (target, intervalMillis, timeoutMillis, propName, propValues) {
            propertyToggler.toggleProperty(target, intervalMillis, timeoutMillis, propName, propValues);
        },

        resetPropertyToggler : function() {
            propertyToggler.reset();
        }
    };       
}();

(function() {
    
    bcDocumentUtils.addVisibilityListener(onchange);
    
    function onchange (evt) {
        var v = "visible", h = "hidden",
            evtMap = {
              focus:v, focusin:v, domfocusin:v, pageshow:v, blur:h, focusout:h, domfocusout:h, pagehide:h
            };

        evt = evt || window.event;

        var mVisibility;
        if (evt.type in evtMap) {
              mVisibility = evtMap[evt.type];
        }else{
              mVisibility = this[hidden] ? h : v;
        }
          
        bcDocumentUtils.setDocumentVisibility(mVisibility); 
    }

  // set the initial state (but only if browser supports the Page Visibility API)
    if( document[hidden] !== undefined ) {
        onchange({type: document[hidden] ? "blur" : "focus"});
    }  
})();
