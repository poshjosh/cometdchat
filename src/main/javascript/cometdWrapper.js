var chatUtil = require('./chatUtil');
var bcUtil = require('./bcUtil');

function cometdWrapper(){

    var _self = this;
    
    var _delegate;
    var _config;
    var _functionDisplayChatWindow;
    
    this._connected = false;
    this.loginUserName = undefined;
    this._disconnecting = undefined;
    this._chatSubscription = undefined;
    this._membersSubscription = undefined;
    
    /**
     * This method can be invoked to disconnect from the chat server.
     * When user logging off or user close the browser window, user should
     * be disconnected from cometd server.
     */
    this.leave = function() {
        
        bcUtil.log("entering cometdWrapper.leave");
        
        _self._delegate.batch(function() {
            _self._unsubscribe();
        });
        _self._delegate.disconnect();

        _self.loginUserName  = null;
        _self._disconnecting = true;
    };

    /**
     * Handshake with the server. When user logging into your system, you can call this method
     * to connect that user to cometd server. With that user will subscribe with tow channel.
     * '/chat/demo' and '/members/demo' and start to listen to those channels. 
     * @param config
     */
    this.join = function(config) {
        bcUtil.log("entering cometdWrapper.join");

        _self._disconnecting = false;
        _self.loginUserName = config['chatuser'];

        var cfg = {url: _self._config.chat.endpoint};
        if(config.hasOwnProperty('logLevel')) {
            cfg.logLevel = config['logLevel'];
        }

//        bcUtil.log("cometdWrapper.join loginUser: " + _self.loginUserName + ", URL: " + cfg.url);
        _self._delegate.configure(cfg);
        _self._delegate.websocketEnabled = false;

        _self._delegate.handshake();
        
        bcUtil.log("exiting cometdWrapper.join");
    };

    /**
     * Send the text message to peer as a private message. Private messages
     * are visible only for relevant peer users.
     * @param textMessage
     * @param peerUserName
     */
    this.send = function(textMessage, peerUserName) {

        if (!textMessage || !textMessage.length) return;

        _self._delegate.publish(_self._config.chat.channel, {
            room: _self._config.chat.room,
            user: _self.loginUserName,
            chat: textMessage,
            peer: peerUserName
        });
    };
    
    /**
     * Updates the members list.
     * This function is called when a message arrives on channel /chat/members
     * @param message
     */
    this.members = function(message) {
        
        bcUtil.log( function(){return "cometdWrapper.members("+JSON.stringify(message)+")";} );

        var htmlText = chatUtil.buildMembersListHtml(_self.loginUserName, message.data);

        chatUtil.updateMemberList(htmlText);
    };

    /**
     * This function will be invoked every time when '/chat/demo' channel receives a message.
     * @param message
     */
    this.receive = function(message) {

        bcUtil.log( function(){return "cometdWrapper.receive("+JSON.stringify(message)+")";} );

        var fromUser = message.data.user;
        var text     = message.data.chat;
        var toUser   = message.data.peer;

        //Handle receiving messages
        if (_self.loginUserName === toUser) {
            //'toUser' is the loginUser and 'fromUser' is the peer user.
            var chatReceivingWindow = _self._functionDisplayChatWindow(toUser, fromUser);
            chatReceivingWindow.appendMessage(fromUser, text, _self.loginUserName);
        }

        //Handle sending messages
        if (_self.loginUserName === fromUser) {
            //'fromUser' is the loginUser and 'toUser' is the peer user.
            var chatSendingWindow = _self._functionDisplayChatWindow(fromUser, toUser);
            chatSendingWindow.appendMessage(fromUser, text, _self.loginUserName);
        }
    };

    this._unsubscribe = function() {
        bcUtil.log("entering cometdWrapper._unsubscribe");
        if (_self._chatSubscription) {
            _self._delegate.unsubscribe(_self._chatSubscription);
        }
        _self._chatSubscription = null;

        if (_self._membersSubscription) {
            _self._delegate.unsubscribe(_self._membersSubscription);
        }
        _self._membersSubscription = null;
    };

    this._connectionEstablished = function() {
        
        bcUtil.log("entering cometdWrapper._connectionEstablished");
        
        // connection establish (maybe not for first time), so just
        // tell local user and update membership
        _self._delegate.publish(_self._config.members.channel, {
            user: _self.loginUserName,
            room: _self._config.chat.room
        });
    };

    this._connectionBroken = function(){
        bcUtil.log("entering cometdWrapper._connectionBroken");
        chatUtil.clearMemberListHtml();
    };

    this._connectionClosed = function() {
        bcUtil.log("entering cometdWrapper._connectionClosed");
       /* _self.receive({
            data: {
                user: 'system',
                chat: 'Connection to Server Closed'
            }
        });*/
    };

    this._metaConnect = function(message) {
        
//        bcUtil.log( function(){return "cometdWrapper._metaConnect("+JSON.stringify(message)+")";} );
        
        if (_self._disconnecting) {
            _self._connected = false;
            _self._connectionClosed();
        } else {
            var wasConnected = _self._connected;
            _self._connected = message.successful === true;
            if (!wasConnected && _self._connected) {
                _self._connectionEstablished();
            } else if (wasConnected && !_self._connected) {
                _self._connectionBroken();
            }
        }
    };

    this._subscribe = function() {
        bcUtil.log( function(){return "cometdWrapper._subscribe";} );
        _self._chatSubscription    = _self._delegate.subscribe(_self._config.chat.room, _self.receive); //channel handling chat messages
        _self._membersSubscription = _self._delegate.subscribe(_self._config.members.room, _self.members); //channel handling members.
    };

    this._connectionInitialized = function() {
        
        bcUtil.log( function(){return "cometdWrapper._connectionInitialized";} );
        
        // first time connection for this client, so subscribe tell everybody.
        _self._delegate.batch(function() {
            _self._subscribe(); // Don't use this keyword here
        });
    };

    this._metaHandshake = function (message) {
        
        bcUtil.log( function(){return "cometdWrapper._metaHandshake("+JSON.stringify(message)+")";} );
        
        if (message.successful) {
            _self._connectionInitialized();
        }
    };

    this._initListeners = function() {
        
        bcUtil.log("_initListeners entering");
        
        _self._delegate.addListener('/meta/handshake', _self._metaHandshake);
        _self._delegate.addListener('/meta/connect',   _self._metaConnect);

        $(window).on("unload", function() {
            _self._delegate.reload();
            _self._delegate.disconnect();
        });
//        bcUtil.log("_initListeners exiting");
    };		

    this.init = function(delegate, config, functionDisplayChatWindow) {
        bcUtil.log( function(){return "entering cometdWrapper.init("+Object.keys(config)+")";} );
        
        this._delegate = bcUtil.requireType(delegate, 'object');
        this._config = bcUtil.requireType(config, 'object');
        this._functionDisplayChatWindow = bcUtil.requireType(functionDisplayChatWindow, 'function');

        _self._initListeners();

        bcUtil.log( function(){return "exiting cometdWrapper.init";} );
    };	
}

module.exports = cometdWrapper;


