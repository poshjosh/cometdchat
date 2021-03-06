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

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.function.BiFunction;
import java.util.logging.Logger;

/**
 * @author Chinomso Bassey Ikwuagwu on May 18, 2018 11:07:15 PM
 */
public class PrivateMessageConsumerImpl<M> 
        implements Serializable, PrivateMessageConsumer<M>,
        PrivateMessageStore<M> {

    private transient static final Logger LOG = 
            Logger.getLogger(PrivateMessageConsumerImpl.class.getName());
    
    private final Lock lock = new ReentrantLock();
    
    private final Map<Map.Entry<String, String>, List<M>> messageCache;
    
    private final BiFunction<String, String, List<M>> listSupplier;

    public PrivateMessageConsumerImpl() {
        this(new HashMap(), (from, to) -> new ArrayList());
    }
    
    public PrivateMessageConsumerImpl(
            Map<Map.Entry<String, String>, List<M>> messageCache,
            BiFunction<String, String, List<M>> listSupplier) {
        this.messageCache = Collections.synchronizedMap(messageCache);
        this.listSupplier = Objects.requireNonNull(listSupplier);
    }
    
    @Override
    public boolean accept(String from, String to, M message) {
        try{

            lock.lock();
            
            LOG.finer(() -> "Adding:: From: " + from + ", to: " + to + ", message: " + message);

            return this.getCachedMessages(from, to, true).add(message);

        }finally{
            lock.unlock();
        }
    }

    @Override
    public PrivateMessageStore<M> getStore() {
        return this;
    }
    
    public List<M> remove(String from, String to) {
        final Map.Entry<String, String> key = this.toEntry(from, to);
        try{
            
            lock.lock();

            final List<M> removed = messageCache.remove(key);
            
            LOG.fine(() -> "Removed: " + key + " = " + removed);
            
            return removed;

        }finally{
            lock.unlock();
        }
    }
    
    @Override
    public List<M> get(String from, String to) {
        final List<M> output = this.getCachedMessages(from, to, false);
        return output == null || output.isEmpty() ? Collections.EMPTY_LIST : Collections.unmodifiableList(output);
    }
    
    private List<M> getCachedMessages(String from, String to, boolean createIfNone) {
        final Map.Entry<String, String> key = this.toEntry(from, to);
        List<M> cachedMessages = this.messageCache.get(key);
        if(cachedMessages == null && createIfNone) {
            cachedMessages = listSupplier.apply(from, to);
            LOG.fine(() -> "Created new message list for: " + key);
            this.messageCache.put(key, cachedMessages);
        }
        return cachedMessages;
    }
    
    protected Map.Entry<String, String> toEntry(String from, String to) {
        return new MapEntryImpl(from, to);
    }
}
