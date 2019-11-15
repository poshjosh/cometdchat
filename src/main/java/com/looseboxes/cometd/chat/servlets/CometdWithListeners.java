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

import java.util.Queue;
import java.util.function.Supplier;
import java.util.logging.Logger;
import org.cometd.bayeux.Message;
import org.cometd.bayeux.Session;
import org.cometd.bayeux.server.BayeuxServer;
import org.cometd.bayeux.server.ConfigurableServerChannel;
import org.cometd.bayeux.server.ServerChannel;
import org.cometd.bayeux.server.ServerMessage;
import org.cometd.bayeux.server.ServerSession;
import org.cometd.server.BayeuxServerImpl;

/**
 * @author Chinomso Bassey Ikwuagwu on May 18, 2018 6:38:35 PM
 */
public class CometdWithListeners extends CometdWithMessageConsumer 
    implements ServerSession.DeQueueListener, 
        ServerSession.Extension, ServerSession.MaxQueueListener,
        ServerSession.MessageListener, ServerSession.RemoveListener,
        BayeuxServer.ChannelListener, BayeuxServer.Extension, 
        BayeuxServer.SessionListener, BayeuxServer.SubscriptionListener{

    private transient static final Logger LOG = Logger.getLogger(CometdWithListeners.class.getName());

    private final boolean addMessageToQueueEvenThoughQueueIsMaxed = true;

    public CometdWithListeners() { }

    @Override
    protected BayeuxServerImpl newBayeuxServer() {

        final BayeuxServerImpl bayeuxServer = super.newBayeuxServer();
        
        bayeuxServer.addExtension(this);
        bayeuxServer.addListener((BayeuxServer.ChannelListener)this);
        bayeuxServer.addListener((BayeuxServer.SessionListener)this);
        bayeuxServer.addListener((BayeuxServer.SubscriptionListener)this);
        
        bayeuxServer.addListener(new BayeuxServer.SessionListener(){
            @Override
            public void sessionAdded(ServerSession session) {
                final CometdWithListeners ref = CometdWithListeners.this;
                session.addExtension(ref);
                session.addListener((ServerSession.DeQueueListener)ref);
                session.addListener((ServerSession.MaxQueueListener)ref);
                session.addListener((ServerSession.MessageListener)ref);
                session.addListener((ServerSession.RemoveListener)ref);
            }
            @Override
            public void sessionRemoved(ServerSession session, boolean timedout) { }
        });
        
        return bayeuxServer;
    }

    @Override
    public void deQueue(ServerSession session, Queue<ServerMessage> queue) { }

    @Override
    public boolean rcv(ServerSession session, ServerMessage.Mutable message) {
        return true;
    }

    @Override
    public boolean rcvMeta(ServerSession session, ServerMessage.Mutable message) {
        return true;
    }

    @Override
    public ServerMessage send(ServerSession to, ServerMessage message) {
        return message;
    }

    @Override
    public boolean sendMeta(ServerSession session, ServerMessage.Mutable message) {
        return true;
    }

    @Override
    public boolean queueMaxed(ServerSession session, Session from, Message message) { 
        return this.addMessageToQueueEvenThoughQueueIsMaxed;
    }

    @Override
    public boolean onMessage(ServerSession to, ServerSession from, ServerMessage message) { 
        return true;
    }

    @Override
    public void removed(ServerSession session, boolean timeout) { 
        log(() -> "#removed. Session: " + session);
    }

    @Override
    public void channelAdded(ServerChannel channel) { 
        log(() -> "#channelAdded. Channel: " + channel);
    }

    @Override
    public void channelRemoved(String channelId) { 
        log(() -> "#channelRemoved. Channel: " + channelId);
    }

    @Override
    public void configureChannel(ConfigurableServerChannel channel) { }

    @Override
    public boolean send(ServerSession from, ServerSession to, ServerMessage.Mutable message) { 
        return true;
    }

    @Override
    public void sessionAdded(ServerSession session) { 
        log(() -> "#sessionAdded. Session: " + session);
    }

    @Override
    public void sessionRemoved(ServerSession session, boolean timedout) { 
        log(() -> "#sessionRemoved. Session: " + session);
    }

    @Override
    public void subscribed(ServerSession session, ServerChannel channel) { 
        log(() -> "#subscribed. Session: " + session + ", channel: " + channel);
    }

    @Override
    public void unsubscribed(ServerSession session, ServerChannel channel) { 
        log(() -> "#unsubscribed. Session: " + session + ", channel: " + channel);
    }
    
    private void log(Supplier<String> msgSupplier) {
        LOG.finer(msgSupplier);
    }
}
