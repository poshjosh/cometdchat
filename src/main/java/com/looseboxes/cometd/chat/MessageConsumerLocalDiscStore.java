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

import com.bc.collection.diskbacked.FileBackedCollection;
import com.bc.collection.diskbacked.FileBackedListImpl;
import com.looseboxes.cometd.chat.functions.GetAppDir;
import com.looseboxes.cometd.chat.functions.GetAppName;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletContext;

/**
 * @author Chinomso Bassey Ikwuagwu on May 19, 2018 1:09:27 PM
 */
public class MessageConsumerLocalDiscStore extends MessageConsumerImpl{

    private static final Logger LOG = Logger.getLogger(MessageConsumerLocalDiscStore.class.getName());
    
    private static final class GetMessagesDir {
        
        public File apply(ServletContext context, String name) {
            
            final String appName = new GetAppName().apply(context);
            
            final File appDir = new GetAppDir().apply(context, appName);
            
            final File messagesDir = new File(appDir, name);

            if(!messagesDir.exists()) {
                messagesDir.mkdirs();
            }
            return messagesDir;
        }
    }
    
    private static final class GetChunkSize {
        public int apply(ServletContext context, int outputIfNone) {
            final String sval = context.getInitParameter("fileBasedCollection_chunkSize");
            final int chunkSize = sval == null || sval.isEmpty() ? outputIfNone : Integer.parseInt(sval);
            return chunkSize;
        }
    }

    public MessageConsumerLocalDiscStore(ServletContext context) {
        this(
                new GetMessagesDir().apply(context, "chat_messages").toString(), 
                new GetChunkSize().apply(context, 100)
        );
    }
    
    public MessageConsumerLocalDiscStore(String messagesDir, int chunkSize) {
        super(new HashMap(), (from, to) -> new FileBackedListImpl(messagesDir, from + "=" + to + ".bin", false, chunkSize));
    }

    @Override
    public List remove(String from, String to) {

        final FileBackedCollection fileBasedList = (FileBackedCollection)super.remove(from, to);

        final List output;

        if(fileBasedList == null) {
            output = null;
        }else{
            try {
                if(fileBasedList.isEmpty()) {
                    output = Collections.EMPTY_LIST;
                }else{
                    output = new ArrayList();
                    fileBasedList.forEach((e) -> output.add(e));
                }
            }finally{
                try{
                    fileBasedList.close();
                }catch(IOException e) {
                    LOG.log(Level.WARNING, "Exception closing file based list", e);
                }
            }
        }
        return output;
    }
}
