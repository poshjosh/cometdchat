# cometdchat

### A Java library for integrating Cometd based chat functionality into a Java Web Application

## Usage
This will add chat functionality to your existing java web application.
You will be able to chat with any user who browses to your web site directly.

### Setp 1. Clone/download this library and add it to your project.

### Setp 2. Add the xml below to your web.xml

```xml
    <!-- Servlet to query chat members -->
    <servlet>
        <servlet-name>ChatMembers</servlet-name>
        <servlet-class>com.looseboxes.cometd.chat.web.ChatMembers</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>ChatMembers</servlet-name>
        <url-pattern>/chatMembers</url-pattern>
    </servlet-mapping>
    <!-- Servlet to query cometd chat messages -->
    <servlet>
        <servlet-name>messages</servlet-name>
        <servlet-class>com.looseboxes.cometd.chat.servlets.Messages</servlet-class>
        <async-supported>true</async-supported>
    </servlet>
    <servlet-mapping>
        <servlet-name>messages</servlet-name>
        <url-pattern>/chat/messages</url-pattern>
    </servlet-mapping>
    <!-- CometdChat WebApp Config -->
    <context-param>
        <param-name>cometdChatAppName</param-name>
        <param-value>[PUT A NAME HERE]</param-value>
    </context-param>
    <filter>
        <filter-name>continuation</filter-name>
        <filter-class>org.eclipse.jetty.continuation.ContinuationFilter</filter-class>
        <async-supported>true</async-supported>
    </filter>
    <filter-mapping>
        <filter-name>continuation</filter-name>
        <url-pattern>/cometd/*</url-pattern>
    </filter-mapping>
    <!-- Cometd Servlet -->
    <servlet>
        <servlet-name>cometd</servlet-name>
        <servlet-class>com.looseboxes.cometd.chat.servlets.CometdWithMessageConsumer</servlet-class>
        <async-supported>true</async-supported>
        <init-param>
            <param-name>transports</param-name>
            <param-value>org.cometd.websocket.server.WebSocketTransport</param-value>
        </init-param>
        <init-param>
            <param-name>services</param-name>
            <param-value>com.looseboxes.cometd.chat.ChatService</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>cometd</servlet-name>
        <url-pattern>/cometd/*</url-pattern>
    </servlet-mapping>
```

### Setp 3. Add the code below to any ServletContextListener's contextInitialized(ServletContextEvent) method       

```java
public void contextInitialized(ServletContextEvent servletContextEvent) {

    final ServletContext servletContext = servletContextEvent.getServletContext();    

    final CometdContext cometdChat = new CometdContextImpl(servletContext);
}
```

### Setp 4. Add to HTML Page

Sample HTML page incorporating the chat functionality

- comet.chat.css : The CSS file
- main.js        : The javascript file     

```html
<!DOCTYPE html>
<html>
    <head>
        <link type="text/css" rel="stylesheet" href="comet.chat.css"/>
        <title>Chat</title>
    </head>
    <body>
        
        <form>
            <b>Join Chat</b>
            <p>
                Username: <input type="text" name="chatuser" id="chatuser"/>
                <div id="chatuserMessage"></div>
            </p>
            <p><input type="button" onclick="joinChatRoom();" value="Join Chat"></p>
        </form>

        <div>Online Users <small>(Click a <em>username</em> to chat)</small></div>

        <div id="members" class="larger border0 spaced marginbottom"></div>

        <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" src="main.js"></script>
        <script type="text/javascript">
            
            $(document).ready(function(){ 
                
                var baseUrl = location.protocol + "//" + location.host;
                var contextPath = ''; 
                var contextUrl = baseUrl + contextPath;
                
                var config = {
                    /** 'id' of a 'div' or 'span' tag which keeps list of online users */
                    memberListContainerID: 'members',       /** required = false */
                    userDisplayName: 'me',                  /** required = false */
                    windowBackground: '#31B404',            /** required = false */
                    logLevel: 'warn',                       /** required = false, [warn|info|debug], default=info */
                    chat: {channel:'/service/privatechat', room: '/chat/demo', endpoint: contextUrl + "/cometd"},
                    members: {channel:'/service/members', room:'/members/demo', endpoint: contextUrl + "/chatMembers"}
                };
                
                bcCometd.init(config);
                
                var username = $('#chatuser').val();
                
                if(!username) {
                    $('#chatuser').html("Invalid username: " + username);
                    return;
                }
                
                bcCometd.joinChat(username, function(){
                    window.alert("Successfully joined chat as: " + username);
                });
            });
        </script>
    </body>
</html>
```

