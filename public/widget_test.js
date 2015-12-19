       $(document).ready(function(){
        var widgetIframe = document.getElementById('testWidget'),
        widget       = SC.Widget(widgetIframe),
        newSoundUrl = 'http://api.soundcloud.com/tracks/13692671';
        console.log("new widget", widget)
        widget.bind(SC.Widget.Events.READY, function() {
          // load new widget
          console.log("here")
           widget.play();

          widget.bind(SC.Widget.Events.FINISH, function() {
            widget.load(newSoundUrl, {
              show_artwork: false
            })
            console.log("widget!!")
          });
        });
      })