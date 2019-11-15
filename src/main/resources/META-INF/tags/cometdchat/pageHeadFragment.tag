<%@tag trimDirectiveWhitespaces="true" pageEncoding="UTF-8" description="Include this in head part of your pages."%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<%@attribute name="loginUserDisplayName" required="false"%>
<%@attribute name="windowBackground" required="false"%>

<c:if test="${windowBackground == null || windowBackground == ''}">
    <c:set var="windowBackground" value="#31B404"/>
</c:if>

<%-- In javascript: Did not work when '==' was changed to '===' --%>
<script type="text/javascript" src="${pageContext.request.contextPath}/org/cometd.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/org/cometd/AckExtension.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/org/cometd/ReloadExtension.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/jquery/jquery-1.8.2.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/jquery/jquery.cookie.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/jquery/jquery.cometd.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/jquery/jquery.cometd-reload.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/chat.window3.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/comet.chat1.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/bcDocumentUtils.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/bcSoundPlayer1.js"></script>
<script type="text/javascript">
    var cometdchatMessageBeep = {

        play: function() {

            if ('webkitAudioContext' in window) { 

                bcSoundPlayer.playSound();

            } else { 

                var cfg = {
                    '${pageContext.request.contextPath}/sounds/beep.ogg' : 'audio/ogg',
                    '${pageContext.request.contextPath}/sounds/beep.wav' : 'audio/wave',
                    '${pageContext.request.contextPath}/sounds/beep.mp3' : 'audio/mpeg',
                    '${pageContext.request.contextPath}/sounds/beep.m4a' : 'audio/mpeg'
                };

                bcSoundPlayer.playAny(cfg);
            } 
        }
    };

    bcSoundPlayer.addLoadEvent(bcSoundPlayer.setMp3Source('${pageContext.request.contextPath}/sounds/beep.mp3'));
</script>
<script type="text/javascript">

    var chatWindowArray = [];

    var config = {
        contextPath: '${pageContext.request.contextPath}'
    };

    function getChatWindowByUserPair(loginUserName, peerUserName) {

        var chatWindow;

        for(var i = 0; i < chatWindowArray.length; i++) {
            var windowInfo = chatWindowArray[i];
            if (windowInfo.loginUserName == loginUserName && 
                windowInfo.peerUserName == peerUserName) {
                chatWindow =  windowInfo.windowObj;
            }
        }

        return chatWindow;
    }

    function createWindow(loginUserName, peerUserName) {

        var chatWindow = getChatWindowByUserPair(loginUserName, peerUserName);

        if (chatWindow == null) { //Not chat window created before for this user pair.
            chatWindow = new ChatWindow(); //Create new chat window.
            
            chatWindow.initWindow({
                    loginUserName:loginUserName, 
                    peerUserName:peerUserName,
                    loginUserDisplayName:'${loginUserDisplayName}',
                    windowBackground:'${windowBackground}',
                    windowArray:chatWindowArray});

            //collect all chat windows opended so far.
            var chatWindowInfo = { peerUserName:peerUserName, 
                                           loginUserName:loginUserName,
                                           windowObj:chatWindow};

            chatWindowArray.push(chatWindowInfo);
        }

        chatWindow.show();

        return chatWindow;
    }

    function join(userName){
        $.cometChat.join(userName);
    }
</script>

<link type="text/css" rel="stylesheet" href="${pageContext.request.contextPath}/comet.chat.css"/>


