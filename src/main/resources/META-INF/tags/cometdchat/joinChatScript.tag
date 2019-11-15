<%@tag trimDirectiveWhitespaces="true" pageEncoding="UTF-8" 
       description="Add this file just after the 'body' start tag to automatically join the user to chat. Required include: /WEB-INF/jspf/cometdchat/pageHeadFragment.jspf"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<%@attribute name="chatuser" required="false"%>
<%@attribute name="memberListContainerId" required="false"%>

<c:if test="${chatuser == null || chatuser == ''}">
    <jsp:useBean id="GenerateUsername" scope="page" 
                 class="com.looseboxes.cometd.chat.beans.GenerateUsername"/>
    <jsp:setProperty name="GenerateUsername" property="prefix" value="guest"/>
    <c:set var="chatuser" value="${GenerateUsername.username}" scope="session"/>
</c:if>

<script type="text/javascript">
    $(document).ready(function(){ 
        $.cometChat.onLoad({memberListContainerID:'${memberListContainerId}'});
        join('${chatuser}');
    });
</script>

