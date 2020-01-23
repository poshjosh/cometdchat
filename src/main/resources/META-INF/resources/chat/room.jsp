<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="/META-INF/tlds/cometdchat" prefix="cometdchat"%>

<!DOCTYPE html>
<html>
    <head>
        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name=viewport content="width=device-width, initial-scale=1"/>
        <link type="text/css" rel="stylesheet" href="comet.chat.css"/>
        <style type="text/css">
            .larger{ font-size:1.2em; }    
            .marginbottom{ margin-bottom:1em;}
            .spaced{ line-height:1.2em; }
            .bg0{ background-color:#DDEEFF; }
            .bg1{ background-color:#CCCCFF; }
            .border0{ border:0.2em solid #77EEFF; }
            .border1{ border:0.2em solid #33BBCC; }
            .border2{ border:0.2em solid #009999; }
        </style>  
        
        <cometdchat:joinChat chatuser="${param.chatuser}"
                             memberListContainerId="members"
                             loginUserDisplayName="me"/>
  
        <title>Chat</title>
    </head>
    <body>
        
        <div class="larger spaced marginbottom">
            <a href="${pageContext.servletContext.contextPath}">Home</a>
        </div>

        <div class="larger bg0 border0 spaced">
            Online Users <small>(Click a <em>username</em> to chat)</small>
        </div>

        <div id="members" class="larger border0 spaced marginbottom"></div>

        <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" src="main.js"></script>
        <script type="text/javascript">
            
            $(document).ready(function(){ 
                
                // What about port ??? http://localhost:8080 ???
                var baseUrl = location.protocol + "//" + location.host;
                var contextPath = ${pageContext.servletContext.contextPath}; 
                var contextUrl = baseUrl + contextPath;
                
                var config = {
                    /** 'id' of a 'div' or 'span' tag which keeps list of online users */
                    memberListContainerID: 'members',       /** required = false */
                    userDisplayName: 'me',                  /** required = false */
                    windowBackground: '#31B404',            /** required = false */
                    logLevel: 'warn',                       /** required = false, [warn|info|debug], default=info */
                    chat: {channel:'/service/privatechat', room: '/chat/demo', endpoint: contextUrl + "/cometd"},
                    members: {channel:'/service/members', room:'/members/demo', endpoint: contextUrl + "/chatMembers"},
                    soundFiles: {
                        'sounds/beep.ogg' : 'audio/ogg',
                        'sounds/beep.wav' : 'audio/wave',
                        'sounds/beep.mp3' : 'audio/mpeg',
                        'sounds/beep.m4a' : 'audio/mpeg'
                    }
                };
                
                bcCometd.init(config);
                
                var username = ${param.chatuser};
                
                if(!username) {
                    window.alert("Invalid username");
                    return;
                }
                
                bcCometd.joinChat(username, function(){
                    console.log("Successfully joined chat as: " + username);
                });
            });
        </script>
    </body>
</html>
