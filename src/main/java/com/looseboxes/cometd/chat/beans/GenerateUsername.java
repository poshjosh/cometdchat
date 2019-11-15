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

package com.looseboxes.cometd.chat.beans;

import java.io.Serializable;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.logging.Logger;

/**
 * @author Chinomso Bassey Ikwuagwu on May 19, 2018 6:08:21 PM
 */
public class GenerateUsername implements Serializable {

    private transient static final Logger LOG = Logger.getLogger(GenerateUsername.class.getName());
    
    private final long offsetTime_doNotEdit = ZonedDateTime
            .of(2018, 4, 17, 0, 0, 0, 0, ZoneId.of("UTC")).toInstant().toEpochMilli();

    private String prefix;
    
    private String suffix;

    public GenerateUsername() { }

    public String getUsername() {
        final StringBuilder builder = new StringBuilder();
        if(prefix != null) {
            builder.append(prefix);
        }
        builder.append(Long.toHexString(System.currentTimeMillis()-offsetTime_doNotEdit));
        if(suffix != null) {
            builder.append(suffix);
        }
        
        final String output = builder.toString();
        
        LOG.finer(() -> "Generated username: " + output);
        
        return output;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }
}
