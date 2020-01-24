var $ = require('jquery');
var docUtil = require('./docUtil');
var bcUtil = require('./bcUtil');

var chatUtil = {
    
    config: undefined,
    exportedVariable: undefined,
    
    getMembersEndpoint: function() {
        var url = ((chatUtil.config || {}).members || {}).endpoint;
        bcUtil.log( function(){return "Members endpoint: " + url;} );
        return url;
    },
    
    getMembersAjaxRequest: function(url) {
        return $.ajax({
            method: "GET",
            url: url,
            dataType: "json",
            cache: false
        });
    },
    
    /**
     * Makes ajax call to the members endpoint. invokes the callback with arguments:
     * chatuser and the json object from the response.
     * @param {string} chatuser
     * @param {function} callback
     * @returns {undefined}
     */
    executeMembersRequest: function(chatuser, callback) {

        bcUtil.log( function(){return "entering executeMembersRequest, chatuser: "+
                    chatuser+", callback: " + typeof(callback);} );

        var url = chatUtil.getMembersEndpoint();
        var req = chatUtil.getMembersAjaxRequest(url);
        req.done(function( data ) {

            bcUtil.log( function(){return "DONE Response: "+JSON.stringify(data)+" from: "+url;} );
            
            if(data) {
                
                callback(chatuser, data);
            }
        }).fail(function( data ) {
            bcUtil.log( function(){return "FAIL Response: "+JSON.stringify(data)+" from: "+url;} );
        });
    },

    ifJoinedToChatUpdateMemberListHtml: function(chatuser) {

        bcUtil.log( function(){return "entering ifJoinedToChatUpdateMemberListHtml, chatuser: "+chatuser;} );

        var onDone = function(chatuser, data){
            
            var chatRooms = data;

            bcUtil.log("Chat rooms: " + JSON.stringify(chatRooms));

            var userRoomName = chatUtil.getUserChatRoomName(chatuser, chatRooms);

            if(userRoomName) {

                var userRoom = chatRooms[userRoomName];

                var htmlText = chatUtil.buildMembersListHtml(chatuser, userRoom);

                chatUtil.updateMemberList(htmlText);
            }
        };
        
        chatUtil.executeMembersRequest(chatuser, onDone);
    },

    ifNotJoinedToChat: function(chatuser, callback) {

        bcUtil.log( function(){return "entering ifNotJoinedToChat, chatuser: "+chatuser;} );
        
        var onDone = function(chatuser, data){
            
            var chatRooms = data;

            bcUtil.log("Chat rooms: " + JSON.stringify(chatRooms));

            var userRoomName = chatUtil.getUserChatRoomName(chatuser, chatRooms);

            if( ! userRoomName) {

                callback();

            }else{

                docUtil.displayInfo("User: " + chatuser + ". already joined to chatroom: " + userRoomName);
            }
        };
        
        chatUtil.executeMembersRequest(chatuser, onDone);
    },
    
    buildMembersListHtml : function(currentUser, users) {

        bcUtil.log( function(){return "User: "+currentUser + ", users: " + users;} );
        
        var result = [];

        $.each(users, function() {
            var toUser = this;
            var toUsername = bcUtil.extractUsernameFromEmail(toUser); 
            if (currentUser === toUser) { 
                result[result.length] = "<span style=\";color: #FF0000;\">" + toUsername + "</span><br>";
            } else { //peer users
                result[result.length] = "<span onclick=\"" + 
                    (chatUtil.exportedVariable ? chatUtil.exportedVariable + '.' : 'javascript:') + 
                    "displayChatWindow('" + currentUser + "', '" + toUser + 
                    "');\" style=\"cursor: pointer;color: #0000FF;\">" + toUsername + "</span><br>";
            }
        });
        
        return result;
    },

    getUserChatRoomName: function(chatuser, chatRooms) {
        
        var result;
        
        for(var roomName in chatRooms) {

            var chatRoom = chatRooms[roomName];
            
            for(var member in chatRoom) {

                if(member === chatuser) {

                    result = roomName;
                    
                    break;
                }
            }
        }
        
        bcUtil.log( function(){return "User chat room: "+result+", user: "+chatuser+", rooms: "+JSON.stringify(chatRooms);} );
        
        return result;
    },

    updateMemberList: function(htmlText) {

        if(htmlText && chatUtil.config.memberListContainerID !== undefined) {
            
            $('#' + chatUtil.config.memberListContainerID).html(htmlText.join("")); 
        }
    },
    
    clearMemberListHtml: function() {
        
        if(chatUtil.config.memberListContainerID !== undefined) {
            
            $('#' + chatUtil.config.memberListContainerID).empty(); 
        }
    },

    init: function(cfg, exportedVariable) {
        chatUtil.config = bcUtil.requireType(cfg, 'object');
//        bcUtil.log("config: " + JSON.stringify(chatUtil.config));
        chatUtil.exportedVariable = bcUtil.requireType(exportedVariable, 'string');
//        bcUtil.log("exportedVariable: " + exportedVariable);
    }
};

module.exports = chatUtil;