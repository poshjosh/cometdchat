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

import java.io.File;
import java.io.Serializable;
import java.nio.file.Paths;
import java.util.function.BiFunction;
import javax.servlet.ServletContext;

/**
 * @author Chinomso Bassey Ikwuagwu on May 19, 2018 3:03:39 PM
 */
public class GetAppDir implements Serializable, BiFunction<ServletContext, String, File> {

    @Override
    public File apply(ServletContext context, String app_name) {
        
        final File appDir = Paths.get(System.getProperty("user.home"), app_name).toFile();
        
        if(!appDir.exists()) {
            appDir.mkdirs();
        }
        
        return appDir;
    }
}
