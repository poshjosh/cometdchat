function chatInfo(){
    
    var _self = this;
    
    this.chatInfoArray = [];

    this.get = function(fromUser, toUser, offset) {

        var result;

        if( ! offset) {
            offset = 0;
        }

        for(var index = offset; index < _self.chatInfoArray.length; index++) {
            
            var chatInfo = _self.chatInfoArray[index];
            
            if (chatInfo.user === fromUser && chatInfo.peer === toUser) {
                result =  chatInfo;
                break;
            }
        }

        return result;
    };

    this.indexOf = function(fromUser, toUser, offset) {

        var result = -1;
        
        if( ! offset) {
            offset = 0;
        }

        for(var index = offset; index < _self.chatInfoArray.length; index++) {
            
            var chatInfo = _self.chatInfoArray[index];
            
            if (chatInfo.user === fromUser && chatInfo.peer === toUser) {
                result =  index;
                break;
            }
        }

        return result;
    };

    this.indexOfChatInfo = function(chatInfo) {
        
        return _self.indexOf(chatInfo.user, chatInfo.peer);
    };

    this.addChatInfo = function(chatInfo) {
        
        _self.chatInfoArray.push(chatInfo);
    };

    this.addChatInfoIfNone = function(chatInfo) {
        
        var index = _self.indexOfChatInfo(chatInfo);
        
        if(index === -1) {
            
            _self.addChatInfo(chatInfo);
            
            return true;
        }
        
        return false;
    };

    this.removeFirst = function(fromUser, toUser) {
      
        var index = _self.indexOf(fromUser, toUser);
        
        if(index > -1) {
            
            _self.chatInfoArray.splice(index, 1);
            
            return true;
        }
        
        return false;
    };

    this.removeAll = function(fromUser, toUser) {
      
        var count = 0;
        var removed;
        do{
            removed = _self.removeFirst(fromUser, toUser);
            if(removed) {
                ++count;
            }
        }while(removed);
        
        return count;
    };

    this.getData = function(fromUser, toUser, resultIfNone) {
        
        var chatInfo = _self.get(fromUser, toUser);
                
        return (!chatInfo || chatInfo === null) ? resultIfNone : chatInfo.data;
    };
    
    this.addIfNone = function(fromUser, toUser, data) {
        
        var chatInfo = _self.toChatInfo(fromUser, toUser, data);
        
        _self.addChatInfoIfNone(chatInfo);
    };

    this.add = function(fromUser, toUser, data) {
        
        var chatInfo = _self.toChatInfo(fromUser, toUser, data);
        
        _self.addChatInfo(chatInfo);
    };

    this.toChatInfo = function(fromUser, toUser, data) {
        
        var chatInfo = {user:fromUser, peer:toUser, data: data};
        
        return chatInfo;
    };

    this.getArray = function() {
        
        return _self.getChatInfotoArray();
    };
    
    this.getChatInfotoArray = function() {
        
        return _self.chatInfoArray;
    };
}

module.exports = chatInfo;

