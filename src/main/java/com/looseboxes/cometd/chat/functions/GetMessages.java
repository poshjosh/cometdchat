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

package com.looseboxes.cometd.chat.functions;

import com.looseboxes.cometd.chat.PrivateMessageStore;
import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;
import javax.servlet.ServletContext;
import com.looseboxes.cometd.chat.ChatAttributeNames;
import com.looseboxes.cometd.chat.CometdChat;

/**
 * @author Chinomso Bassey Ikwuagwu on May 19, 2018 5:17:13 PM
 */
public class GetMessages implements Serializable, BiFunction<String, String, Map> {

    private final PrivateMessageStore<?> messageStore;

    public GetMessages(ServletContext context) {
        this(((CometdChat)context.getAttribute(ChatAttributeNames.COMETD_CHAT_APP)).getMessageStore());
    }
    
    public GetMessages(PrivateMessageStore<?> messageStore) {
        this.messageStore = messageStore;
    }
    
    @Override
    public Map apply(String sender, String recipient) {

        final Map output;
        
        if(messageStore == null) {
            
            output = Collections.singletonMap("error", "No Message Store");
            
        }else if(sender == null || sender.isEmpty() || recipient == null || recipient.isEmpty()) {    
            
            output = Collections.singletonMap("error", "Invalid parameters");
            
        }else{
            
            List messageList = messageStore.get(sender, recipient);
            
            if(messageList == null || messageList.isEmpty()) {
                
                messageList = Collections.EMPTY_LIST;
            }

            output = Collections.singletonMap("user="+sender+"&peer="+recipient, messageList);
        }
        
        return output;
    }
}
