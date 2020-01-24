/**
 * http://www.newyyz.com/blog/2014/05/28/playing-sounds-in-all-browsers-on-all-platforms/
 * https://gist.github.com/framerate/3941315
 */
var soundPlayer = {
    
    myAudioContext : null, 
    myBuffers : {}, 
    mySource : null,
    mp3SoundSource: null,

    setMp3Source: function (mp3SoundSource) { 
//        window.alert("Mp3 sound source: " + mp3SoundSource);
        if ('webkitAudioContext' in window) { 
            soundPlayer.myAudioContext = new webkitAudioContext(); 
            soundPlayer.fetchSounds(mp3SoundSource); 
            soundPlayer.mp3SoundSource = mp3SoundSource;
        } 
    }, 
            
    fetchSounds: function(mp3SoundSource) { 
//        window.alert("Fetching: " + mp3SoundSource);
        var request = soundPlayer.newXmlHttpRequest(); 
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
        var buffer = soundPlayer.myAudioContext.createBuffer(request.response, false); 
        soundPlayer.myBuffers['beep'] = buffer; 
    },
    
    playSound: function() { 
        var source = soundPlayer.myAudioContext.createBufferSource(); 
        source.buffer = soundPlayer.myBuffers['beep']; 
        source.loop = false; 
        source.connect(soundPlayer.myAudioContext.destination); 
        source.noteOn(0); 
        soundPlayer.mySource = source; 
    },
    
    play: function(audioElementId) { 
        if ('webkitAudioContext' in window) { 
            playSound(); 
        } else { 
            var snd = soundPlayer.getElementById(audioElementId); 
            snd.play(); 
        } 
    }, 

    playAny: function(obj) { 
        if ('webkitAudioContext' in window) { 
            playSound(); 
        } else { 
            var snd = soundPlayer.buildAudioElement(obj);
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
    },

    beep: function(soundFiles) {

        if (soundPlayer.mp3SoundSource && 'webkitAudioContext' in window) { 

            soundPlayer.playSound();

        } else if(soundFiles && soundFiles !== null){ 

            soundPlayer.playAny(soundFiles);
        } 
    }
};

module.exports = soundPlayer;

