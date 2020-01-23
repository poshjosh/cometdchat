/*
 * Copyright 2018 NUROX Ltd.
 *
 * Licensed under the NUROX Ltd Software License (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.looseboxes.com/legal/licenses/software.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.looseboxes.cometd.chat.servlets;

import com.looseboxes.cometd.chat.BayeuxServerExtensionForCollectingMessages;
import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.BiPredicate;
import java.util.function.Predicate;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.cometd.annotation.AnnotationCometdServlet;
import org.cometd.bayeux.server.ServerMessage;
import org.cometd.server.BayeuxServerImpl;
import com.looseboxes.cometd.chat.ChatAttributeNames;
import com.looseboxes.cometd.chat.CometdContext;
import com.looseboxes.cometd.chat.MessageConsumer;

/**
 * @author Chinomso Bassey Ikwuagwu on May 18, 2018 5:53:46 PM
 */
public class CometdWithMessageConsumer extends AnnotationCometdServlet {

    private transient static final Logger LOG = Logger.getLogger(CometdWithMessageConsumer.class.getName());

    public CometdWithMessageConsumer() {  }

    @Override
    protected BayeuxServerImpl newBayeuxServer() {

        final BayeuxServerImpl bayeuxServer = super.newBayeuxServer();
        
        try{

            final CometdContext chatapp = (CometdContext)this.getServletContext()
                    .getAttribute(ChatAttributeNames.COMETD_CONTEXT);
                
            final MessageConsumer messageConsumer = chatapp.getMessageConsumer();

            if(messageConsumer != null) {
                
                final BiFunction<ServerMessage.Mutable, ?, ?> messageFormatter = 
                        chatapp.getMessageFormatter();
                
                Objects.requireNonNull(messageFormatter);

                final Predicate<String> hasValue = (msg) -> msg != null && !msg.isEmpty();

                final BiPredicate<String, String> usersTest = (sender, recipient) -> {
                    return hasValue.test(sender) && hasValue.test(recipient);
                };

                bayeuxServer.addExtension(new BayeuxServerExtensionForCollectingMessages(
                        hasValue, usersTest, messageFormatter, messageConsumer)
                );
            }
            
        }catch(RuntimeException e) {
            
            LOG.log(Level.WARNING, "Chat messages will NOT be collected, due to the following exception!", e);
        }
        
        return bayeuxServer;
    }
}
/**
 * 
@WebServlet(
        name = "cometd", 
        urlPatterns = {"/cometd/*"}, 
        loadOnStartup = 1,
        initParams = {
                @WebInitParam(name = "timeout", value = "20000"),
                @WebInitParam(name = "interval", value = "0"),
                @WebInitParam(name = "maxLazyTimeout", value = "5000"),
                @WebInitParam(name = "long-polling.multiSessionInterval", value = "2000"),
                @WebInitParam(name = "logLevel", value = "0"),
                @WebInitParam(name = "transports", value = "org.cometd.websocket.server.WebSocketTransport"),
                @WebInitParam(name = "services", value = "com.semika.cometd.ChatService")
        }
)
 * 
 */