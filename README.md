# cometdchat

### A Java library for integrating Cometd based chat functionality into a Java Web Application

Java-Maven backend and Nodejs-Webpack frontend

## Usage
This will add chat functionality to your existing java web application.
You will be able to chat with any user who browses to your web site directly.

### Setp 1. Clone/download this library and add it to your project.

### Setp 2. Add the xml below to your web.xml

```xml
    <!-- Servlet to query chat members -->
    <servlet>
        <servlet-name>ChatMembers</servlet-name>
        <servlet-class>com.looseboxes.cometd.chat.servlets.ChatMembers</servlet-class>
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
        <title>Chat Page</title>
        <link type="text/css" rel="stylesheet" href="comet.chat.css"/>
    </head>
    <body>
        
        <form>
            <p>
                Username: <input type="text" name="chatuser" id="chatuser"/><span id="chatuserMessage"></span>
            </p>
            <p><input type="button" onclick="joinChatRoom('chatuser');" value="Join Chat"></p>
        </form>

        <div>Online Users <small>(Click a <em>username</em> to chat)</small></div>

        <div id="members"></div>
        
        <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
        <script type="text/javascript" src="main.js"></script>
        <script type="text/javascript">
            
            $(document).ready(function(){ 
                
                var config = {
                    /** 'id' of a 'div' or 'span' tag which keeps list of online users */
                    memberListContainerID: 'members',   /** required = false, text */
                    userDisplayName: 'me',              /** required = false, text */
                    windowBackground: '#31B404',        /** required = false, color */
                    logLevel: 'debug'                   /** required = false, [warn|info|debug], default=info */
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
```

## Building the javascript file from the Nodejs-Webpack frontend

To build a javascript for integrating Cometd based chat functionality into Java Web Apps:

- Open command prompt

- Change to the project folder, e.g:

```
>cd C:\Users\USER\Documents\NetBeansProjects\cometdchat
```

- Install some required scripts

```
npm install jquery
npm install cometd
```

- Run command: npm run build:[ MODE = (dev|prod) ], e.g:

```
C:\Users\USER\Documents\NetBeansProjects\cometdchat>npm run build:dev
```

The npm run build command does the following:

1. Packages script at src/index.js with all dependencies.

2. Minifies the packaged/combined script and saves it to dist/main.js

### Structure of output

- dist
    - index.html
    - main.js
    - sounds
        - beep.m4a
        - beep.mp3
        - beep.ogg
        - beep.wav
- src
    - index.js

### Sample index.html 
Put the link to the script at the bottom of the page, inside the body tag


