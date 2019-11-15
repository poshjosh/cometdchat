<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="/META-INF/tlds/cometdchat" prefix="cometdchat"%>

<!DOCTYPE html>
<html>
    <head>
        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>

        <meta name=viewport content="width=device-width, initial-scale=1"/>

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

    </body>
</html>
