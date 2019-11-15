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

import com.looseboxes.cometd.chat.functions.DefaultMessageFormatter;
import com.looseboxes.cometd.chat.functions.GetAppDir;
import com.looseboxes.cometd.chat.functions.GetAppName;
import java.io.File;
import java.io.Serializable;
import java.util.Objects;
import java.util.function.BiFunction;
import java.util.logging.Logger;
import javax.servlet.ServletContext;
import org.cometd.bayeux.server.ServerMessage;

/**
 * @author Chinomso Bassey Ikwuagwu on May 19, 2018 7:11:09 PM
 */
public class CometdChat implements Serializable {

    private transient static final Logger LOG = Logger.getLogger(CometdChat.class.getName());
    
    private final String appName;
    
    private final File appDir;

    private final BiFunction<ServerMessage.Mutable, ?, ?> messageFormatter;
    
    private final PrivateMessageConsumer messageConsumer;
    
    public CometdChat(ServletContext context) {
        this(
                context, 
                new DefaultMessageFormatter(), 
                new PrivateMessageConsumerLocalDiscStore(context));
    }

    public CometdChat(
            ServletContext context,
            BiFunction<ServerMessage.Mutable, ?, ?> messageFormatter, 
            PrivateMessageConsumer messageConsumer) {
        this.appName = new GetAppName().apply(context);
        LOG.info(() -> "Initializing chat app named: " + appName);
        this.appDir = new GetAppDir().apply(context, appName);
        this.messageFormatter = Objects.requireNonNull(messageFormatter);
        this.messageConsumer = Objects.requireNonNull(messageConsumer);
        LOG.fine(() -> "Done initializing chat app.");
        
        context.setAttribute(ChatAttributeNames.COMETD_CHAT_APP, CometdChat.this);
    }

    public String getAppName() {
        return appName;
    }

    public File getAppDir() {
        return appDir;
    }

    public BiFunction<ServerMessage.Mutable, ?, ?> getMessageFormatter() {
        return messageFormatter;
    }

    public PrivateMessageConsumer getMessageConsumer() {
        return messageConsumer;
    }
}
