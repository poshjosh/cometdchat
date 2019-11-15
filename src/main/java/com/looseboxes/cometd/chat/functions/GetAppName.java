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

import java.io.Serializable;
import java.util.function.Function;
import javax.servlet.ServletContext;
import com.looseboxes.cometd.chat.ChatAttributeNames;

/**
 * @author Chinomso Bassey Ikwuagwu on May 19, 2018 3:05:53 PM
 */
public class GetAppName implements Serializable, Function<ServletContext, String> {

    @Override
    public String apply(ServletContext context) {
        
        final String appName = context.getInitParameter(ChatAttributeNames.APP_NAME) == null ? "chat" : 
                context.getInitParameter(ChatAttributeNames.APP_NAME);
        
        return appName;
    }
}
