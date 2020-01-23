package com.looseboxes.cometd.chat;

import java.io.IOException;
import java.io.Serializable;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.Map;

/**
 * @author Josh
 * @param <E>
 */
public class JsonBuilder<E extends Appendable> implements Serializable {
    
    private final boolean tidyOutput;
    
    private final boolean escapeOutput;
    
    private int depth;
    
    private final String indent;
    
    public JsonBuilder() {
        this(false);
    }

    public JsonBuilder(boolean tidyOutput) {
        this(tidyOutput, true);
    }
    
    public JsonBuilder(boolean tidyOutput, boolean escapeOutput) {
        this(tidyOutput, escapeOutput, "  ");
    }
    
    public JsonBuilder(boolean tidyOutput, boolean escapeOutput, String indent) {
        this.tidyOutput = tidyOutput;
        this.escapeOutput = escapeOutput;
        this.indent = indent;
    }
    
    public void appendJSONString(Map m, E appendTo) throws IOException {
        
        if(m == null) {
            
            appendTo.append("null");
            
            return;
        }    

        boolean first = true;
	Iterator iter = m.entrySet().iterator();
        
        appendTo.append('{');
        
        ++depth;
        
        while(iter.hasNext()){
            
            if(first) {
                first = false;
            }else{
                appendTo.append(',');
            }
            
            this.appendNewline(depth, appendTo);
            
            Map.Entry entry=(Map.Entry)iter.next();
            appendJSONPair(String.valueOf(entry.getKey()),entry.getValue(), appendTo);
	}
        
        --depth;
        this.appendNewline(depth, appendTo);
        
        appendTo.append('}');
    }

    /**
     * Given key: <tt>name</tt> and value: <tt>Ada Rekiya Titi</tt>
     * output is <tt>{"name":"Ada Rekiya Titi"}</tt>
     * @param key
     * @param value
     * @param appendTo 
     */
    public void appendJSONString(String key, Object value, E appendTo) throws IOException {
        Map<String, Object> map = Collections.singletonMap(key, value);
        this.appendJSONString(map, appendTo);
    }
    
    /**
     * Given key: <tt>name</tt> and value: <tt>Ada Rekiya Titi</tt>
     * output is <tt>"name":"Ada Rekiya Titi"</tt>
     * @param key
     * @param value
     * @param appendTo 
     * @throws java.io.IOException 
     */
    public void appendJSONPair(String key, Object value, E appendTo) throws IOException {
        
        appendTo.append('\"');
        if(key == null) {
            appendTo.append("null");
        }else{
//            if(this.isEscapeOutput()) {
//                this.escape(key, appendTo);
//            }else{
                appendTo.append(key);
//            }
        }    
        appendTo.append('\"').append(':');

        this.appendJSONString(value, appendTo);
    }

    /**
     * Convert an array to JSON text. 
     * 
     * @param arr
     * @param appendTo
     */
    public void appendJSONString(Object [] arr, E appendTo) throws IOException {
        
        this.appendJSONString(arr == null ? null : Arrays.asList(arr), appendTo);
    }
    
    /**
     * Convert a collection to JSON text. 
     * 
     * @param list
     * @param appendTo
     */
    public void appendJSONString(Collection list, E appendTo) throws IOException {
        
        if(list == null) {
            appendTo.append("null");
            return;
        }    

        boolean first = true;

        appendTo.append('[');
        
        for(Object value:list){

            if(first) {
                first = false;
            }else{
                appendTo.append(',');
            }    
        
            if(value == null){
                appendTo.append("null");
                continue;
            }
            
            this.appendJSONString(value, appendTo);
        }
            
        appendTo.append(']');
    }
    
    /**
     * Convert an object to JSON text and appends it to the Buffer
     * DO NOT call this method from appendJSONPair() of a class that implements Map or List with 
     * "this" as the parameter, use JSONObject.appendJSONPair(Map) or JSONArray.appendJSONPair(List) instead. 
     * 
     * @see org.json.simple.JSONObject#appendJSONString(Map)
     * @see org.json.simple.JSONArray#appendJSONString(List)
     * @see org.json.simple.JSONValue#appendJSONString(java.lang.Object) 
     */
    public void appendJSONString(Object value, E appendTo) throws IOException {
        
        if(value == null) {
            appendTo.append("null");
        }else        
        if(value instanceof String) {
            appendTo.append('\"');
            String sval = String.valueOf(value);
            if(this.isEscapeOutput()) {
                escape(sval, appendTo);
            }else{
                appendTo.append(sval);
            }    
            appendTo.append('\"');
        }else     
        if(value instanceof Double){
            appendTo.append(String.valueOf(value));
        }else
        if(value instanceof Float){
            appendTo.append(String.valueOf(value));
        }else		
        if(value instanceof Number) {
            appendTo.append(String.valueOf(value));
        }else        
        if(value instanceof Boolean) {
            appendTo.append(String.valueOf(value));
        }else     
//        if((value instanceof JSONAware)) {
//            appendTo.append(((JSONAware)value).toJSONString());
//            return;
//        }else      
        if(value instanceof Map) {
            appendJSONString((Map)value, appendTo);
        }else        
        if(value instanceof Collection) {
            appendJSONString((Collection)value, appendTo);
        }else
        if(value instanceof Object[]) {
            appendJSONString((Object[])value, appendTo);
        }else {
            appendTo.append('\"');
            appendTo.append(String.valueOf(value));
            appendTo.append('\"');
        }
    }
    
    /**
     * Escape quotes, \, /, \r, \n, \b, \f, \t and other control characters (U+0000 through U+001F).
     */
    public void escape(CharSequence s, E appendTo) throws IOException {
        for(int i=0;i<s.length();i++){
            char ch=s.charAt(i);
            this.escape(ch, appendTo);
        }//for
    }
    
    public void escape(char ch, E appendTo) throws IOException {
        switch(ch){
        case '"':
                appendTo.append("\\\"");
                break;
        case '\\':
                appendTo.append("\\\\");
                break;
        case '\b':
                appendTo.append("\\b");
                break;
        case '\f':
                appendTo.append("\\f");
                break;
        case '\n':
                appendTo.append("\\n");
                break;
        case '\r':
                appendTo.append("\\r");
                break;
        case '\t':
                appendTo.append("\\t");
                break;
        case '/':
                appendTo.append("\\/");
                break;
        default:
//Reference: http://www.unicode.org/versions/Unicode5.1.0/
                if((ch>='\u0000' && ch<='\u001F') || (ch>='\u007F' && ch<='\u009F') || (ch>='\u2000' && ch<='\u20FF')){
                        String ss=Integer.toHexString(ch);
                        appendTo.append("\\u");
                        for(int k=0;k<4-ss.length();k++){
                                appendTo.append('0');
                        }
                        appendTo.append(ss.toUpperCase());
                }
                else{
                        appendTo.append(ch);
                }
        }
    }
    
    private void appendNewline(int depth, E appendTo) throws IOException {
        if(!this.isTidyOutput()) {
            return;
        }
        appendTo.append('\n');
        for(int i=0; i<depth; i++) {
            appendTo.append(indent);
        }
    }

    public final boolean isEscapeOutput() {
        return escapeOutput;
    }

    public final boolean isTidyOutput() {
        return tidyOutput;
    }

    public final String getIndent() {
        return indent;
    }
}
