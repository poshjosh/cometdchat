<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name=viewport content="width=device-width, initial-scale=1"/>
        <style type="text/css">
            body{ font-size:1.5em; }    
        </style>  
        <title>Join Chat Room</title>
    </head>
    
    <body>
        
        <b>Join Chat Room</b>
        
        <form action="${pageContext.request.contextPath}/chat/room.jsp" method="POST">
            
            <label>
                Username: <input type="text" name="chatuser"/>
            </label>
            
            <input type="submit" value="Join">
            
        </form>
        
    </body>
</html>
