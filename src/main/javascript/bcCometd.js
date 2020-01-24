var $ = require('jquery');
var cometdLibrary = require('cometd');
var chatInfo = require('./chatInfo');
var chatUtil = require('./chatUtil');
var docUtil = require('./docUtil');
var soundPlayer = require('./soundPlayer');
var bcUtil = require('./bcUtil');
var defaultConfig = require('./defaultConfig');
var chatWindow = require('./chatWindow');
var cometdWrapper = require('./cometdWrapper');

var bcCometd = {
    
    serverAvailable : true,
    
    productionMode : false,
    
    config : undefined,
    
    cometdInfo : undefined,
    
    windowInfo: undefined,
    
    newInstance: function() {
        return new cometdLibrary.CometD();
    },     

    isVerbose: function() {
        return bcUtil.isVerbose();
    },
    
    isProductionMode : function() {
        return bcCometd.productionMode;
    },

    getCometd: function(chatuser, resultIfNone) {
        
        var cometd = bcCometd.cometdInfo.getData(chatuser, '', resultIfNone);
       
        bcUtil.log( function(){return "Got: " + cometd + ", from: " + bcCometd.cometdInfo.getArray();} );
        
        return cometd;
    },
    
    addCometd: function(chatuser, cometd) {
        
        bcCometd.cometdInfo.add(chatuser, '', cometd);
        
        bcUtil.log( function(){return "Added: " + cometd + ", to: " + bcCometd.cometdInfo.getArray();} );
    },

    /** 
     * @param {string} fromUser
     * @param {string} toUser
     * @param {string} messageText
     * @returns {boolean} true if the message was published, otherwise returns false
     */
    sendChatMessage: function(fromUser, toUser, messageText) {

        bcUtil.log( function(){return "sendChatMessage("+fromUser+", "+toUser+", "+messageText+")";} );
        
        if (!messageText || !messageText.length) {
            return false;
        }

        var cometd = bcCometd.getCometd(fromUser);

        if(cometd) {
            cometd.publish(bcCometd.config.chat.channel, {
                room: bcCometd.config.chat.room,
                user: fromUser,
                chat: messageText,
                peer: toUser
            });
        }else{
            bcUtil.log( function(){return "No instance of cometd available for chat pair: (" + fromUser + "," + toUser + ")";} );
        }
        
        return true;
    },

    joinChat: function(chatuser, onSuccess) {
    
        bcUtil.log( function(){return "entering joinChat("+chatuser+", "+onSuccess+")";} );
        
        if( ! chatuser) {
            chatuser = bcUtil.generateRandomUsername('guest');
        }
        
        var callback = function() {
            
            var cometd = bcCometd.getCometd(chatuser);
            if(!cometd || cometd === null){ 
                cometd = bcCometd.newInstance();
            }
            
            var cometdWrapperObj = new cometdWrapper();
    
            cometdWrapperObj.init(cometd, bcCometd.config, bcCometd.displayChatWindow);

            var cfg = {chatuser : chatuser};
            if(bcCometd.config.hasOwnProperty('logLevel')) {
                cfg.logLevel = bcCometd.config['logLevel'];
            }

            cometdWrapperObj.join(cfg);
            
            bcCometd.addCometd(chatuser, cometd);
    
            if(onSuccess) {
                onSuccess();
            }
        };
        
        if(bcCometd.serverAvailable) {
            chatUtil.ifNotJoinedToChat(chatuser, callback);
        }else{
            callback();
        }
        
        bcUtil.log( function(){return "exiting joinChat("+chatuser+", "+onSuccess+")";} );
    },
    
    updateDefaultMp3Source: function() {
        
        if(bcCometd.config.hasOwnProperty('soundFiles')) {

            var soundFiles = bcCometd.config['soundFiles'];

            for(var soundFname in soundFiles) {
                
                if(bcUtil.stringEndsWith(soundFname, '.mp3', true)) {
                    
                    soundPlayer.setMp3Source(soundFname);
                }
            }
        }
    },
    
    // DO NOT REMOVE or RENAME (--- without appropriate related refactorings ---) 
    // If you REMOVE OR RENAME this method, search for the method name within 
    // this module (also within string literals) and refactor appropriately.
    /**
     * This method is accessed dynamically e.g from scripts within text
     * @param {string} loginUserName
     * @param {string} peerUserName
     * @returns {ChatWindow}
     */
    displayChatWindow: function(loginUserName, peerUserName) {
        
        bcUtil.log( function(){return "entering displayChatWindow("+loginUserName+", "+peerUserName+")";} );

        var chatWindowObj = bcCometd.windowInfo.getData(loginUserName, peerUserName, null);
        
        var windowInfoArray = bcCometd.windowInfo.getArray();

        bcUtil.log( function(){return "Window info array: " + windowInfoArray + ", found window: " + chatWindowObj;} );
        
        if (!chatWindowObj || chatWindowObj === null) { //Not chat window created before for this user pair.

            chatWindowObj = new chatWindow(); //Create new chat window.

            var cfg = {
                loginUserName : loginUserName, 
                peerUserName : peerUserName,
                loginUserDisplayName : bcCometd.config.userDisplayName,
                windowBackground : bcCometd.config.windowBackground,
                soundFiles : bcCometd.config.soundFiles,
                windowArray : windowInfoArray
            };
            
            var sendChatMessage = function(from, to, msg) { return bcCometd.sendChatMessage(from, to, msg); };
            var getWindowArrayCount = function() { return bcCometd.windowInfo.getArray().length; };
            chatWindowObj.init(cfg, sendChatMessage, getWindowArrayCount);

            //collect all chat windows opended so far.
            bcCometd.windowInfo.add(loginUserName, peerUserName, chatWindowObj);

            bcUtil.log( function(){return "After adding, Window info array: " + windowInfoArray;} );
        }

        chatWindowObj.show();

        bcUtil.log( function(){return "exiting displayChatWindow("+loginUserName+", "+peerUserName+"), returned " + chatWindowObj;} );
        
        return chatWindowObj;
    },
    
    /**
     * <p>
     * In this file, this variables value is declared as the default export thus:
     * </p>
     * <code>export default bcCometd;</code>
     * <p>
     * Likewise, in the file webpack.config.js, this variable's value is assigned to
     * the property/key named <tt>library</tt>, thus:</p>
     * <code>library: '[EXPORTED_VARIABLE]'
     * <p>
     * In addition, in the file src/index.js, this variables value is assigned to
     * <tt>module.exports</tt>, thus:
     * </p>
     * <code>module.exports = bcCometd;</code>
     * @return {string} the exported variable which will be available to client users of this api
     */
    getExportedVariable : function() {
        return "bcCometd";
    },
    
    init: function(cfg) {
        
        bcUtil.log("entering bcCometd.init");
        
        bcUtil.init(cfg);

        defaultConfig.update(cfg);

        bcUtil.log( function(){return "Config ("+JSON.stringify(cfg)+")";} );
        
        bcCometd.config = bcUtil.requireType(cfg, 'object'); /** Must come first */
        
        docUtil.addLoadEvent(docUtil.onDocumentLoad());

        docUtil.addLoadEvent(bcCometd.updateDefaultMp3Source());
        
        chatUtil.init(cfg, bcCometd.getExportedVariable());
        
        bcCometd.cometdInfo = new chatInfo();
        
        bcCometd.windowInfo = new chatInfo();

        bcUtil.log("exiting bcCometd.init");
    }
};

module.exports = bcCometd;


