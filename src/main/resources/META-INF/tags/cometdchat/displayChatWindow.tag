<%@tag trimDirectiveWhitespaces="true" pageEncoding="UTF-8" 
       description="Add this file just after the 'body' start tag to automatically create a chat window in a page."%>
<%@taglib uri="/META-INF/tlds/cometdchat" prefix="cometdchat"%>

<%@attribute name="loginUserDisplayName" required="false"%>
<%@attribute name="windowBackground" required="false"%>
<%@attribute name="fromChatuser" required="false"%>
<%@attribute name="loginFromChatuser" required="false" description="true or false"%>
<%@attribute name="toChatuser" required="true"%>
<%@attribute name="loginToChatuser" required="true" description="true or false"%>
<%@attribute name="memberListContainerId" required="false"%>

<cometdchat:pageHeadFragment loginUserDisplayName="${loginUserDisplayName}" 
                             windowBackground="${windowBackground}"/> 

<%-- toUser comes first --%>
<cometdchat:joinChatScript chatuser="${toChatuser}" memberListContainerId="${memberListContainerId}"/> 

<cometdchat:joinChatScript chatuser="${fromChatuser}" memberListContainerId="${memberListContainerId}"/> 

<script type="text/javascript">
    $(document).ready(function(){ 
        createWindow('${fromChatuser}', '${toChatuser}');
    });
</script>
