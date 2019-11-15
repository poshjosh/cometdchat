<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="/WEB-INF/cometdchat" prefix="cometdchat"%>
<!DOCTYPE html>
<html>
    <head>
        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        
        <c:choose>
            <c:when test="${User.name == null || User.name == ''}">
                <%-- Username will be automatically generated (guest user) --%>
                <cometdchat:displayChatWindow toChatuser="BuzzWears" loginToChatuser="true"/>
            </c:when>
            <c:otherwise>
                <cometdchat:displayChatWindow fromChatuser="${User.name}" loginFromChatuser="true"
                                              toChatuser="BuzzWears" loginToChatuser="true"/>
            </c:otherwise>
        </c:choose>
        
        <title>Auto Create Window Example</title>
        
    </head>
    <body>
        
        <h2>Auto Create Window Example</h2>
        
    </body>
</html>
