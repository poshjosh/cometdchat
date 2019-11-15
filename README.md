# cometdchat

### A Java library for integrating Cometd based chat functionality into a Java Web Application

## Usage
This will add chat functionality to your existing java web application.
You will be able to chat with any user who browses to your web site directly.

### Setp 1. Clone/download this library and add it to your project.

### Setp 2. Add the xml below to your web.xml

```xml
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

    final CometdChat cometdChat = new CometdChat(servletContext);
}
```

### Setp 4. Add this to the head section of any jsp or jspf page you want chat to be available from

```xml
<%@taglib uri="/META-INF/tlds/cometdchat" prefix="cometdchat"%>
<cometdchat:joinChat loginUserDisplayName="me" windowBackground="navy"/>
```

