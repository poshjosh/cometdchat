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

import com.looseboxes.cometd.chat.ChatMessageDataNames;
import java.io.Serializable;
import java.util.Map;
import java.util.function.BiFunction;

/**
 * @author Chinomso Bassey Ikwuagwu on May 19, 2018 4:00:15 PM
 */
public class GetChatFromMessageData implements Serializable, BiFunction<Map, String, String> {

    @Override
    public String apply(Map dataMap, String outputIfNone) {
        
        final Object chat = dataMap.get(ChatMessageDataNames.CHAT);
        
        return chat == null ? outputIfNone : chat.toString();
    }
}
