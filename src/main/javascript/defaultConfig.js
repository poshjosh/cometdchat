var defaultConfig = {
    
    getUrl: function() {
//        location.protocol + "//" + location.host;
        var getUrl = window.location;
        return getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    },
    
    update: function(cfg) {

        if( ! cfg.hasOwnProperty('userDisplayName')) {
            cfg['userDisplayName'] = 'me';
        }
        
        var contextUrl = defaultConfig.getUrl();
        
        var _channel = 'channel';
        var _room = 'room'; 
        var _endpoint = 'endpoint';
        
        var chatChannel = '/service/privatechat';
        var chatRoom = '/chat/demo';
        var chatEndpoint = contextUrl + "/cometd";

        if( ! cfg.hasOwnProperty('chat')) {
            cfg['chat'] = {channel:chatChannel, room:chatRoom, endpoint:chatEndpoint};
        }else{
            if( ! cfg.chat.hasOwnProperty(_channel)) {
                cfg.chat[_channel] = chatChannel;
            }
            if( ! cfg.chat.hasOwnProperty(_room)) {
                cfg.chat[_room] = chatRoom;
            }
            if( ! cfg.chat.hasOwnProperty(_endpoint)) {
                cfg.chat[_endpoint] = chatEndpoint;
            }
        }
        
        var membersChannel = '/service/members';
        var membersRoom = '/members/demo';
        var membersEndpoint = contextUrl + "/chatMembers";
        if( ! cfg.hasOwnProperty('members')) {
            cfg['members'] = {channel:membersChannel, room:membersRoom, endpoint:membersEndpoint};
        }else{
            if( ! cfg.members.hasOwnProperty(_channel)) {
                cfg.members[_channel] = membersChannel;
            }
            if( ! cfg.members.hasOwnProperty(_room)) {
                cfg.members[_room] = membersRoom;
            }
            if( ! cfg.members.hasOwnProperty(_endpoint)) {
                cfg.members[_endpoint] = membersEndpoint;
            }
        }
        
        if( ! cfg.hasOwnProperty('logLevel')){
            cfg['logLevel'] = 'info';
        }
        
        if( ! cfg.hasOwnProperty('soundFiles')) {
            cfg['soundFiles'] = {
                'sounds/beep.ogg' : 'audio/ogg',
                'sounds/beep.wav' : 'audio/wave',
                'sounds/beep.mp3' : 'audio/mpeg',
                'sounds/beep.m4a' : 'audio/mpeg'
            };
        }

        return cfg;
    }
};

module.exports = defaultConfig;

