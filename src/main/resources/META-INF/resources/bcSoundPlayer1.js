/**
 * http://www.newyyz.com/blog/2014/05/28/playing-sounds-in-all-browsers-on-all-platforms/
 * https://gist.github.com/framerate/3941315
 */
var bcSoundPlayer = {
    
    myAudioContext : null, 
    myBuffers : {}, 
    mySource : null,

    addLoadEvent: function(func) {
//window.alert("#addLoadEvent. Function: "+func);    
        var oldonload = window.onload;
//window.alert("#addLoadEvent. OLD Function: "+oldonload);    
        if (typeof window.onload != 'function') {
            window.onload = func;
        }else{
            window.onload = function() {
                if (oldonload) {
                    oldonload();
                }
                func();
            };
        }
    },
    
    setMp3Source: function (mp3SoundSource) { 
//        window.alert("Mp3 sound source: " + mp3SoundSource);
        if ('webkitAudioContext' in window) { 
            bcSoundPlayer.myAudioContext = new webkitAudioContext(); 
            bcSoundPlayer.fetchSounds(mp3SoundSource); 
        } 
    }, 
            
    fetchSounds: function(mp3SoundSource) { 
//        window.alert("Fetching: " + mp3SoundSource);
        var request = bcSoundPlayer.newXmlHttpRequest(); 
        request.open('GET', mp3SoundSource, true); 
        request.responseType = 'arraybuffer'; 
        request.addEventListener('load', bufferSound, false); 
        request.send(); 
    }, 
    
    newXmlHttpRequest: function (){
        var mReq;  
        try{
            mReq = new XMLHttpRequest(); // code for IE7+, Firefox, Chrome, Opera, Safari
        }catch (e){ // IE5 & IE6
            try{mReq = new ActiveXObject("Msxml2.XMLHTTP");}catch (e) {
                try{mReq = new ActiveXObject("Microsoft.XMLHTTP");}catch (e){return null;}
            }
        }
        return mReq;
    },
    
    bufferSound: function(event) { 
//        window.alert("Buffering");
        var request = event.target; 
        var buffer = bcSoundPlayer.myAudioContext.createBuffer(request.response, false); 
        bcSoundPlayer.myBuffers['beep'] = buffer; 
    },
    
    playSound: function() { 
        var source = bcSoundPlayer.myAudioContext.createBufferSource(); 
        source.buffer = bcSoundPlayer.myBuffers['beep']; 
        source.loop = false; 
        source.connect(bcSoundPlayer.myAudioContext.destination); 
        source.noteOn(0); 
        bcSoundPlayer.mySource = source; 
    },
    
    play: function(audioElementId) { 
        if ('webkitAudioContext' in window) { 
            playSound(); 
        } else { 
            var snd = bcSoundPlayer.getElementById(audioElementId); 
            snd.play(); 
        } 
    }, 

    playAny: function(obj) { 
        if ('webkitAudioContext' in window) { 
            playSound(); 
        } else { 
            var snd = bcSoundPlayer.buildAudioElement(obj);
            snd.play(); 
        } 
    }, 

    buildAudioElement: function(obj) { 
        var audioElement = document.createElement('audio');
        var sb = '';
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                sb += '<source src="' + key + '" type="' + obj[key] + '"/>';
            }
        }
        audioElement.innerHTML = sb;
        return audioElement;
    }, 

    getElementById: function (x){
        if(document.getElementById) {
            return document.getElementById(x);
        }else if(document.all) {
            return document.all(x);
        } else {
            return null;
        }
    }
};

