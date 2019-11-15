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
import java.util.function.BiFunction;
import org.cometd.bayeux.server.ServerMessage;

/**
 * @author Chinomso Bassey Ikwuagwu on May 19, 2018 5:04:36 PM
 */
public class DefaultMessageFormatter implements Serializable, 
        BiFunction<ServerMessage.Mutable, ServerMessage.Mutable, ServerMessage.Mutable> {

    @Override
    public ServerMessage.Mutable apply(ServerMessage.Mutable message, ServerMessage.Mutable outputIfNone) {
        return message;
    }
}
