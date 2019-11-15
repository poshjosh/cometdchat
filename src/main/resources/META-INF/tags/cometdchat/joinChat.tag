<%@tag trimDirectiveWhitespaces="true" pageEncoding="UTF-8" 
       description="Add this file just after the 'body' start tag to automatically join the user to chat."%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="/META-INF/tlds/cometdchat" prefix="cometdchat"%>

<%@attribute name="loginUserDisplayName" required="false"%>
<%@attribute name="windowBackground" required="false"%>
<%@attribute name="chatuser" required="false"%>
<%@attribute name="memberListContainerId" required="false"%>

<cometdchat:pageHeadFragment loginUserDisplayName="${loginUserDisplayName}" 
                             windowBackground="${windowBackground}"/> 

<c:set var="pagejcJoinChat" value="true" scope="request"/>
<c:if test="${chatMembers != null && not empty chatMembers}">
    <c:forEach var="mapEntry_roomNameToRoomMembersMap" items="${chatMembers}">
        <c:forEach var="mapEntry_roomUserToClientId" items="${mapEntry_roomNameToRoomMembersMap.value}">
            <c:if test="${chatuser == mapEntry_roomUserToClientId.key}">
                <c:set var="pagejcJoinChat" value="false" scope="request"/>
            </c:if>
        </c:forEach>
    </c:forEach> 
</c:if>

<c:if test="${pagejcJoinChat}">
    <cometdchat:joinChatScript chatuser="${chatuser}" memberListContainerId="${memberListContainerId}"/> 
</c:if>

