//I've created this seperated JS file for use at markbreneman.github.com.visulizing-JS

//SETTING UP THE SCENE:THIS IS NOT NECESSARY...JUST A STEWART CONVENTION
var background = new Path.Rectangle( view.center, view.bounds.width )
background.fillColor = 'black'
background.position = view.center
project.activeLayer.insertChild( 0, background )

//CREATE TIMING TEXT FOR SETUP
var durationSeconds = 60
var running = true

var timeText = new PointText(view.center);
    timeText.paragraphStyle.justification = 'center';
    timeText.characterStyle.fontSize = 20;
    timeText.fillColor = 'gray';
    timeText.position=view.size/2;

var frameCountText = timeText.clone();
    frameCountText.position.y+=30;
    frameCountText.fillColor = 'white';

var DiagnosticText = timeText.clone();
        DiagnosticText.position.y+=60;
        DiagnosticText.fillColor = 'whites';


	
var squareside=60;

var square1 = new Path.Rectangle(view.bounds.bottomLeft-squareside,squareside);
    square1.fillColor = 'white';
    // square1.selected=true;
    square1.position.y -=20;
    // console.log("square1s position is "+ square1.position);

var square2 = new Path.Rectangle(square1.bounds.bottomLeft-squareside,squareside);
    square2.fillColor = 'white';
    square2.position.x -=10;
    // square2.selected=true
    // console.log("square2's position is "+ square2.position);

var square3 = new Path.Rectangle(square2.bounds.bottomLeft-squareside,squareside);
    square3.fillColor = 'white';
    square3.position.x -=10;
    // square3.selected=true
    // console.log("square3s position is "+ square3.position);

var square4 = new Path.Rectangle(square3.bounds.bottomLeft-squareside,squareside);
    square4.fillColor = 'white';
    square4.position.x -=10;
    // square4.selected=true

var square5 = new Path.Rectangle(square3.bounds.bottomLeft-squareside,squareside);
    square5.fillColor = 'white';
    square5.position.x -=10;
    // square4.selected=true
    square5.opacity = 0;



    
var destination1;
var destination2;
var destination3;
var destination4;
var vector1;
var vector2;
var vector3;
var vector4;

var theta=90;
var angle = function(){
            var increment=180;
            theta+=increment;
            return theta;
        }

var walk = function(item, event, direction){
        var passedEvent = event;
        var dir=direction;
            item.position += new Point(5*dir,0 );
            // //item.rotate(Math.sin(theta)*10*dir);
            // 
            // item.? += 0.01
            // var walkRotation = ?.sine().scale( 0, TAU, 0, 30 )*??
            item.rotate( Math.sin(theta)*10*dir );
        }   
        
var moveUp = function(item,event){
        var passedEvent = event;
        if(event.count%5===0){
        item.position.y += 10;
        }  
}

var moveDown = function(item,event){
        var passedEvent = event;
        if(event.count%5===0){
        item.position.y -= 10;    
    }
}

// var moveRight = function(item,event){
//         var passedEvent = event;
//         if(event.count%5===0){
//         item.position.x += 30;
//         }  
// }
// 
// var moveLeft = function(item,event){
//         var passedEvent = event;
//         if(event.count%5===0){
//         item.position.x -= 30;    
//     }
// }

var cruise = function(item, event, vector, destination,speed){
        var passedEvent = event;
        var movVector=vector;
        var div=speed
        var finalDestination=destination;
        item.position += movVector/div;
        var arrived=false
             // if(movVector.length<=10){
             //                 item.position=finalDestination;
             //                 arrived = true; 
             //                     }
}


var onFrame = function(event){
        // timeText.content = Math.round(event.time);
        // frameCountText.content = Math.round(event.count);
        
        
        //KEEPING TRACK OF TIME    
            if( event.time > durationSeconds && running === true ){

             running = false
             square1.remove()
             square2.remove()
             square3.remove()
             square5.remove()
             background.remove()
             // document.title = 'Paper finished.'
            }

            // else if( running === true ) {
            //         
            //          document.title = 'Animation at '+ event.time.floor().toPaddedString( 2 ) +' seconds.'
            //         }    
            // timeText.content = Math.round(event.time) + " seconds";
            //         frameCountText.content = Math.round(event.count) + " frames";

            // DiagnosticText.content = ;        
    
        
        angle();
        // //ENTRANCE AND ADJUST
            if (event.time<6 && event.time<15 && square1.position.x < view.size.width/2 && event.count%5===0){
                walk(square1, event, 1)}
            
            if (event.time<6 && square2.position.x <= view.size.width/2-squareside*.65 && event.count%5===0){
                        walk(square2,event,1)} 
             else if (event.time>6 && event.time<15 && square2.position.x> square1.bounds.bottomLeft.x-10-squareside/2 && event.count%5===0){
            //         //square2 reverse
            //             if (square2.position.x> square1.bounds.bottomLeft.x-10-squareside/2 && square2.position.x <500 ){
                        walk(square2, event, -1); 
                      square2.rotate(Math.sin(theta)*10);     }
            
            if (event.time<6.5 && event.time<15 && square3.position.x <= view.size.width/2-squareside*2*.85 && event.count%5===0){
                        walk(square3,event,1)}
                        
            else if (event.time>6 && event.time<15 && square3.position.x> square2.bounds.bottomLeft.x-10-squareside/2 && event.count%5===0){
                      //square3reverse
                          
                          walk(square3, event, -1);
                          square3.rotate(Math.sin(theta)*40);            
                          }     
                 
           if (event.time<6.5 && event.time<7 && square4.position.x <= view.size.width/2-squareside*3*.85 && event.count%5===0){
               walk(square4,event,1)}
        
           else if (event.time>7 && event.time<8.15 && square4.position.x> square4.bounds.bottomLeft.x-10-squareside/2 && event.count%5===0){
                     //square4reverse
                    walk(square4, event, -1);
                         }

        
        //ANGER PASSING
        if (event.time>8 && event.time<10 && event.count%2==0)
                        {
                        moveUp(square1,event);}
        else if(event.time>8 && event.time<10){moveDown(square1,event);}
        
        if (event.time>10 && event.time<12 && event.count%2==0)
                        {moveUp(square2,event);}
                        else if(event.time>10 && event.time<12){moveDown(square2,event);}
                        
        if (event.time>12 && event.time<15 && event.count%2==0)
                        {moveUp(square3,event);}
                        else if(event.time>12 && event.time<15){moveDown(square3,event);}
            
        if (Math.round(event.time)>=13 && Math.round(event.time) <= 15 && event.count%60==0){
            square4.scale(.85);
            square4.opacity -= 0.1;
            }
        
        //SEPARATION
        if (event.time>15 && event.time<29){
            destination1=new Point(view.size.width-squareside, squareside+20);
            destination2=new Point(view.size.width-(squareside*2+10), squareside+20);
            destination3=new Point(view.size.width-(squareside), squareside*2+30);
            vector1 = destination1 - square1.position;
            vector2 = destination2 - square2.position;
            vector3 = destination3 - square3.position;
            cruise(square1,event,vector1,destination1,185);
            cruise(square2,event,vector2,destination2,185);
            cruise(square3,event,vector3,destination3,185);
        }
        //EXCLUDED TEXT
        // if(event.time>25 && event.time<28){
        //       excludedText.content = "excluded...";
        //        }
        // else{excludedText.content = "";}
        
        //FRUSTRATION and PANIC
       if (event.time>16 && event.time<18 && event.count%2==0)
                           {moveUp(square4,event);}
       else if(event.time>16 && event.time<18){moveDown(square4,event);}
        
        if (event.time>26 && event.time<28 && event.count%2==0)
                            {moveUp(square4,event);}
        else if(event.time>26 && event.time<28){moveDown(square4,event);}
        
        if (event.time>29 && event.time<29.5 ){
           destination4=new Point(view.size.width-squareside*3, view.size.height-squareside/2);
           vector4 = destination4 - square4.position;
           cruise(square4,event,vector4,destination4,10)
           }
       if (event.time>29.5 && event.time<30 ){
          destination4=new Point(view.size.width-squareside*9, view.size.height-squareside/2);
          vector4 = destination4 - square4.position;
          cruise(square4,event,vector4,destination4,10)
          }
          
      if (event.time>30 && event.time<30.5 ){
         destination4=new Point(view.size.width-squareside*3, view.size.height-squareside/2);
         vector4 = destination4 - square4.position;
         cruise(square4,event,vector4,destination4,10)
         }
         
         if (event.time>30.5 && event.time<32 ){
               destination4=new Point(view.size.width-squareside*9, view.size.height-squareside/2);
               vector4 = destination4 - square4.position;
               cruise(square4,event,vector4,destination4,10)
               }
      //THINKING and RUNAWAY
      if (event.time>32 && event.time<34 && event.count%5===0){
          if (square4.position.x < view.size.width/2 && event.count%2==0){
          walk(square4, event, 1);}
        }   
     if (event.time>34 && event.time<37 && event.count%5===0){
          if (square4.position.x < view.size.width/2-20 && event.count%2==0){
          walk(square4, event, -1);}
        }
     if (event.time>38 && event.time<40 && event.count%2==0){moveUp(square4,event);}
     else if(event.time>38 && event.time<40){moveDown(square4,event)}
     
     if (event.time>39 && event.time<40){square4.rotate(1)}
     
     if(event.time>40 && event.time<50){
          destination4=new Point(view.size.width-squareside*3, view.size.height-squareside/2);
          vector4 = destination4 - square4.position;
          cruise(square4,event,vector4,destination4,300)
          square4.rotate(6);     
     }    
          // if(event.time>42 && event.time<48 &&event.count%120==0){
          // square4.scale(1.15)}

            
      if (event.time>45 && event.time<49){
          destination1=new Point(Math.floor((Math.random()*100)+1), Math.floor((Math.random()*1200)+1));
          destination2=new Point(Math.floor((Math.random()*200)+1), Math.floor((Math.random()*1000)+1));
          destination3=new Point(Math.floor((Math.random()*300)+1), Math.floor((Math.random()*1110)+1));
          vector1 = destination1 - square1.position;
          vector2 = destination2 - square2.position;
          vector3 = destination3 - square3.position;
          cruise(square1,event,vector1,destination1,10);
          cruise(square2,event,vector2,destination2,10);
          cruise(square3,event,vector3,destination3,10);
      }
      
      if (event.time>43 && event.time<50 && event.count%120==0){
          destination4=new Point(view.width/2-squareside, view.width/2-squareside)
           vector4 = destination4 - square4.position;
           cruise(square4,event,vector4,destination4,10)
           } 
           
       if(event.time>42 && event.time<45){
                  square4.scale(.99)}
     
      if (event.time>49 && event.time<60){
           destination1=view.center-(squareside/2+10);
           destination2=new Point(square1.position.x+(squareside+20), square1.position.y);
           destination3=new Point(square1.position.x-5, square1.position.y+(squareside+10));
           vector1 = destination1 - square1.position;
           vector2 = destination2 - square2.position;
           vector3 = destination3 - square3.position;
           cruise(square1,event,vector1,destination1,70);
           cruise(square2,event,vector2,destination2,70);
           cruise(square3,event,vector3,destination3,70);
       }

        if(event.time>48 && event.time<60){
            square5.position=view.center+squareside/2;
            square5.opacity+=.0125; 
			
                                 }

		if(event.time>60){
		            DiagnosticText.content ="Fin." ;  
                                 }


                        
};