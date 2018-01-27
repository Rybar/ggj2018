states.loading = {

    init: function(dt){
      
    },
    step: function(dt) {
 
    },

    render: function(dt) {
      renderTarget = SCREEN; clear(0);

      text([
              "LOADING...",
              WIDTH/2,
              128 + Math.sin(t) * 20,
              3,
              2,
              'center',
              'top',
              3,
              9,
            ]);

    } //end render;

}; //end loading state
