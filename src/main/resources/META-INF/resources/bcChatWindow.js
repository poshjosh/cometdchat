var bcChatWindow = {
    
    chatWindowArray : [],

    getChatWindowByUserPair: function(loginUserName, peerUserName) {

        var chatWindow;

        for(var i = 0; i < this.chatWindowArray.length; i++) {
            var windowInfo = this.chatWindowArray[i];
            if (windowInfo.loginUserName === loginUserName && 
                windowInfo.peerUserName === peerUserName) {
                chatWindow =  windowInfo.windowObj;
            }
        }

        return chatWindow;
    },
    
    createChatWindow: function(loginUserName, peerUserName, loginUserDisplayName, windowBackground) {
        
        if(!loginUserDisplayName) {
            loginUserDisplayName = 'me';
        }
        
        if(windowBackground) {
            windowBackground = '#31B404';
        }

        var chatWindow = getChatWindowByUserPair(loginUserName, peerUserName);

        if (chatWindow === null) { //Not chat window created before for this user pair.
            chatWindow = new ChatWindow(); //Create new chat window.

            chatWindow.initWindow({
                    loginUserName : loginUserName, 
                    peerUserName : peerUserName,
                    loginUserDisplayName : loginUserDisplayName,
                    windowBackground : windowBackground,
                    windowArray : this.chatWindowArray});

            //collect all chat windows opended so far.
            var chatWindowInfo = { peerUserName:peerUserName, 
                                           loginUserName:loginUserName,
                                           windowObj:chatWindow};

            this.chatWindowArray.push(chatWindowInfo);
        }

        chatWindow.show();

        return chatWindow;
    },

    beep: function() {

        if ('webkitAudioContext' in window) { 

            bcSoundPlayer.playSound();

        } else { 

            var cfg = {
                'sounds/beep.ogg' : 'audio/ogg',
                'sounds/beep.wav' : 'audio/wave',
                'sounds/beep.mp3' : 'audio/mpeg',
                'sounds/beep.m4a' : 'audio/mpeg'
            };

            bcSoundPlayer.playAny(cfg);
        } 
    }
};

bcSoundPlayer.addLoadEvent(bcSoundPlayer.setMp3Source('sounds/beep.mp3'));


