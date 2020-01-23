<%@page contentType="text/html" pageEncoding="UTF-8"%>
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
  
        <title>Chat</title>
    </head>
    <body>
        
        <div class="larger spaced marginbottom">
            <a href="${pageContext.servletContext.contextPath}">Home</a>
        </div>

        <form>
            <b>Join Chat</b>
            <p>
                <label for="chatuser">Username: </label>
                <input type="text" name="chatuser" id="chatuser"/>
                <small>Your ID which will appear to others</small>
                <br/><span id="chatuserMessage"></span>
            </p>
            <p><input type="button" onclick="joinChatRoom('chatuser');" value="Join Chat"></p>
        </form>
        
        <div class="larger bg0 border0 spaced">
            Online Users <small>(Click a <em>username</em> to chat)</small>
        </div>

        <div id="members" class="larger border0 spaced marginbottom"></div>

        <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" src="main.js"></script>
        <script type="text/javascript">
            
            $(document).ready(function(){ 
                
                var config = {
                    /** 'id' of a 'div' or 'span' tag which keeps list of online users */
                    memberListContainerID: 'members',   /** required = false, text */
                    userDisplayName: 'me',              /** required = false, text */
                    windowBackground: '#31B404',        /** required = false, color */
                    logLevel: 'info'                    /** required = false, [warn|info|debug], default=info */
                };
                
                bcCometd.init(config);
            });
            
            function joinChatRoom(usernameElemId) {
                
                var username = $('#' + usernameElemId).val();
                
                if(!username) {
                    
                    $("#" + usernameElemId + "Message").css("color", "red").val("Invalid username");

                }else{
                
                    bcCometd.joinChat(username, function(){

                        $("#" + usernameElemId + "Message").css("color", "green").val("Successfully joined chat as: " + username);
                    });
                }
            }
        </script>
    </body>
</html>
