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

package com.looseboxes.cometd.chat;

import com.looseboxes.cometd.chat.functions.GetChatFromMessageData;
import java.io.Serializable;
import java.util.Map;
import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.BiPredicate;
import java.util.function.Predicate;
import java.util.logging.Logger;
import org.cometd.bayeux.server.BayeuxServer;
import org.cometd.bayeux.server.ServerMessage;
import org.cometd.bayeux.server.ServerSession;

/**
 * @author Chinomso Bassey Ikwuagwu on May 18, 2018 6:48:50 PM
 */
public class BayeuxServerExtensionForCollectingMessages<M>
        extends BayeuxServer.Extension.Adapter 
        implements Serializable {

    private transient static final Logger LOG = 
            Logger.getLogger(BayeuxServerExtensionForCollectingMessages.class.getName());
    
    private final Predicate<String> messageTest;
    
    private final BiPredicate<String, String> usersTest;
    
    private final BiFunction<ServerMessage.Mutable, M, M> messageFormatter;
    
    private final MessageConsumer<M> messageConsumer;
    
    private final BiFunction<Map, String, String> getChatFromMessageData;

    public BayeuxServerExtensionForCollectingMessages(
            Predicate<String> messageTest,
            BiPredicate<String, String> usersTest,
            BiFunction<ServerMessage.Mutable, M, M> messageFormatter,
            MessageConsumer<M> messageConsumer) {
        this.messageTest = Objects.requireNonNull(messageTest);
        this.usersTest = Objects.requireNonNull(usersTest);
        this.messageFormatter = Objects.requireNonNull(messageFormatter);
        this.messageConsumer = Objects.requireNonNull(messageConsumer);
        this.getChatFromMessageData = new GetChatFromMessageData();
        LOG.fine(() -> "MessageConsumer: " + this.messageConsumer);
    }

    @Override
    public boolean rcv(ServerSession from, ServerMessage.Mutable message) {
        
        final Object data = message.get("data");
        
        if(data instanceof Map) {
            
            final Map dataMap = (Map)data;

            final String chatStr = this.getChatFromMessageData.apply(dataMap, null);
            
            if(this.messageTest.test(chatStr)) {
                
                final Object user = dataMap.get(ChatMessageDataNames.USER);
                final String sender = user == null ? null : user.toString();
                final Object peer = dataMap.get(ChatMessageDataNames.PEER);
                final String recipient = peer == null ? null : peer.toString();
                
                if(this.usersTest.test(sender, recipient)) {
                    
                    LOG.finer(() -> "From: " + sender + ", to: " + recipient + ", message: " + message);
                    
                    final M toAdd = this.messageFormatter.apply(message, null);
                    
                    if(toAdd != null) {
                    
                        this.messageConsumer.accept(sender, recipient, toAdd);
                    }
                }
            }
        }
        
        return true;
    }
}
