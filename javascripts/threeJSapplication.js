



//  I've created two simple setup functions to get our Three.js animation
//  started. You don't need to worry about what they do yet -- we'll talk
//  about them in class when we do a proper introduction to Three.js. 

setupThree()
addLights()


//  This template includes mouse controls. 
//  Make sure that once you load this file in your browser that the browser 
//  window is in focus. (Just click anywhere on the loaded page.)
//  Hold down 'A' and move your mouse around to rotate around the scene.
//  Hold down 'S' and move your mouse up or down to zoom.
//  Hold down 'D' and move your mouse around to pan.

addControls()




    ////////////////
   //            //
  //   Demo 1   //
 //            //
////////////////


//  I've put a few very simple demos together here and given each a number.
//  To switch between demos just change this number to any integer, 1 to 4.

var demoNumber = 4




//  I've created a simple function called addCube(). It simply adds a cube
//  to our animation scene. (We'll talk more about the particulars in class
//  when we look into Three.js.) The important thing here is that you can
//  easily add a cube.

if( demoNumber === 1 ){

	addCube()
		addCube(100,100,100)
			addCube(6,7,8)
				addCube(9,10,11)
}




    ////////////////
   //            //
  //   Demo 2   //
 //            //
////////////////


//  Our addCube() function accepts optional parameters. This means you can 
//  skip them all (like in the example above), or add some in as you please. 
//  This is done by passing an object literal as the function's argument. 
//  The optional parameters are X, Y, Z, width, height, depth, and color.

//  So how does that all work? Let's place some cubes in space that will 
//  show you how to use the optional parameters and also demonstrate the
//  coordinate system. All of these cubes are the same size, but some will
//  appear larger or smaller because of their position on the Z-axis.
//  NOTE: Our camera has been placed at Z=300 and is looking out toward Z=0
//  and beyond. This means anything where Z > 300 is behind the camera!

//  Each cube has a different color. Notice how JavaScript handles raw
//  hexadecimal values. You know... "hexadecimal" uses the Greek prefix "hex"
//  even though other number system names use the Latin prefix. This is 
//  because the Latin prefix ("sex") seemed too risque for 1950's era haxors.
//  http://en.wikipedia.org/wiki/Hexadecimal

//  Switch the 'demoNumber' variable above to 2 and refresh your page. 
//  Look at where the cubes are appearing in space and check here to see what 
//  coordinates they're using.

if( demoNumber === 2 ){

	addCube({//------------  Green is Front, Left.
		x: -90,
		y:   0,
		z: 120,
		color: 0x00FF00
	})

	addCube({//------------  White is Center on all axes.
		x: 0,
		y: 0,
		z: 0,
		color: 0xFFFFFF
	})

	addCube({//------------  Red is Front, Right.
		x:  90,
		y:   0,
		z: 120,
		color: 0xFF0000
	})

	addCube({//------------  Yellow is Back, Top.
		x:    0,
		y:   90,
		z: -120,
		color: 0xFFFF00
	})

	addCube({//------------  Blue is Back, Bottom.
		x:    0,
		y:  -90,
		z: -120,
		color: 0x0066FF
	})
}




    ////////////////
   //            //
  //   Demo 3   //
 //            //
////////////////


//  It's time to do something a little trickier. 
//  How about a colorful spiral?
//  Set the 'demoNumber' variable above to 3 and refresh your page.

if( demoNumber === 3 ){
	
	var
	angle  = 90,
	radius = 90,
	x, y, z

	for( z = -800; z <= 300; z += 3 ){


		//  We'll get to the color below, but for now let's just deal with the
		//  structure of the spiral itself.
		//  First order of business is to increment the angle with every loop
		//  of our for() statement.
		//  The % operator will keep our value between 0 and 360. More info:
		//  http://en.wikipedia.org/wiki/Modular_arithmetic

		angle = ( angle + 6 ) % 360


		//  We've got to use some sine() and cosine() to find the X and Y
		//  values for our spiral. If we weren't changing the value of the Z
		//  axis this would simply draw a circle!

		x = angle.degreesToRadians().cosine() * radius
		y = angle.degreesToRadians().sine() * radius


		//  Let's pick a color based on our angle using the HSV color model.
		//  HSV stands for Hue, Saturation, Value. 
		//  For more information about this color model see this wiki page:
		//  http://en.wikipedia.org/wiki/HSL_and_HSV
		
		//  For now we'll just keep the Saturation and Value at their maximum
		//  of 1.0 but we'll pick a random Hue.

		hue        = angle.normalize( 0, 360 )
		saturation = 1.0,
		value      = 1.0,
		color      = new THREE.Color().setHSV( hue, saturation, value ).getHex()


		//  How does this code below even function?!?
		//  It's because objects are simply keyword-to-value pairs.
		//  The keyword (first element) is always interpreted as a String.
		//  So x: x becomes "x":x and so on.
		//  The value (second element) is interpreted as-is.

		addCube({ 
			x: x, 
			y: y, 
			z: z,
			size: 6,
			color: color
		})
	}
}




    ////////////////
   //            //
  //   Demo 4   //
 //            //
////////////////


//  Ok, it's your turn!
//  Your task is to write your first initial by only creating cubes.
//  Re-write the example below.
//  Bonus points if you use different values for your Z-axis.
//  This example is a drawing of the letter 'Z'.
//  Rotate it around using the mouse controls and see what it looks like
//  from different angles. 
//  Set the 'demoNumber' variable above to 4 and refresh your page.

if( demoNumber === 4 ){

	
	for(var i=0; i<8; i++){
	
		addCube({ 
			x: -250	, 
			y:  -160+40*i, 
			z:   -200, 
			size: 35})
			}
	
	
	for(var j=0; j<4; j++){
		if (j==1){
			addCube({ 
				x: -240+30*j, 
				y: 40*j,
				z:  -200, 
				size: 35})	
		}
		
		else(addCube({ 
			x: -250+30*j, 
			y: 40*j,
			z:  -200+10*j, 
			size: 35}))	
	}
	
	addCube({ 
			x:  -120,  
			y:  140, 
			z:   -160, 
			size: 35})
	
	addCube({ 
			x:  -80,  
			y:  120, 
			z:   -160, 
			size: 35})
		
	for(var l=0; l<3; l++){
		if (l==1){
			addCube({ 
				x: -80+30*l, 
				y: 120-40*l,
				z:  -160-10*l, 
				size: 35})	
		}
	
		else(addCube({ 
			x: -80+30*l, 
			y:  120-40*l,
			z:  -160-10*l, 
			size: 35}))
	}
	
	for(var m=0; m<4; m++){
		if (m==1){
			addCube({ 
				x: 10+30*m, 
				y: 40*m,
				z:  -190+10*m, 
				size: 35})	
		}
		
		else(addCube({ 
			x: 10+30*m, 
			y: 40*m,
			z:  -190+10*m, 
			size: 35}))	
	}
	
	addCube({ 
			x:  140,  
			y:  140, 
			z:   -150, 
			size: 35})
	
	addCube({ 
			x:  180,  
			y:  120, 
			z:   -150, 
			size: 35})
			
	for(var n=0; n<3; n++){
		if (n==1){
			addCube({ 
				x: 180+30*n, 
				y: 120-40*n,
				z:  -150-15*n, 
				size: 35})	
		}

		else(addCube({ 
			x: 180+30*n, 
			y:  120-40*n,
			z:  -150-15*n, 
			size: 35}))
	}
	
	for(var i=0; i<5; i++){
	
		addCube({ 
			x: 240	, 
			y:  -160+40*i, 
			z:   -200, 
			size: 35})
			}
}




    ////////////////
   //            //
  //   Stop !   //
 //            //
////////////////


//  You don't have to worry about any of the code below right now;
//  we're just doing a simple assignment this week.
//  But if you want to read ahead here are some helpful links:
//  MAIN PAGE: http://mrdoob.github.com/three.js/
//  DOC PAGES: http://mrdoob.github.com/three.js/docs/51/
//  LIGHTS AND SHADOWS: http://learningthreejs.com/blog/2012/01/20/casting-shadows/


//  The last thing to do to get started is run our animation loop...

loop()




function setupThree(){
	
	
	//  First let's create a Scene object.
	//  This is what every other object (like shapes and even lights)
	//  will be attached to.
	//  Notice how our scope is inside this function, setupThree(),
	//  but we attach our new variable to the Window object
	//  in order to make it global and accessible to everyone.

	//  An alterative way to do this is to declare the variables in the 
	//  global scope--which you can see in the example here:
	//  https://github.com/mrdoob/three.js/
	//  But this feels more compact and contained, no?
	
	window.scene = new THREE.Scene()


	//  And now let's create a Camera object to look at our Scene.
	//  In order to do that we need to think about some variable first
	//  that will define the dimensions of our Camera's view.
	
	var
	WIDTH      = 600,
	HEIGHT     = 353,
	VIEW_ANGLE = 45,
	ASPECT     = WIDTH / HEIGHT,
	NEAR       = 0.1,
	FAR        = 1000
	
	canvas.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR )
	camera.position.set( 0, 0, 300 )
	camera.lookAt( scene.position )
	scene.add( camera )


	//  Finally, create a Renderer to render the Scene we're looking at.
	//  A renderer paints our Scene onto an HTML5 Canvas from the perspective 
	//  of our Camera.
	
	window.renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize( WIDTH, HEIGHT )
	renderer.shadowMapEnabled = true
	renderer.shadowMapSoft = true
	document.getElementById( 'three' ).appendChild( renderer.domElement )
}




function addControls(){

	window.controls = new THREE.TrackballControls( camera )

	controls.rotateSpeed = 1.0
	controls.zoomSpeed   = 1.2
	controls.panSpeed    = 0.8

	controls.noZoom = false
	controls.noPan  = false
	controls.staticMoving = true
	controls.dynamicDampingFactor = 0.3
	controls.keys = [ 65, 83, 68 ]//  A, S, D

	controls.addEventListener( 'change', render )
}




function addLights(){
	
	
	//  Let's create a directional light for our scene.
	
	var light = new THREE.DirectionalLight( 0xFFFFFF )
	light.castShadow = true	
	scene.add( light )


	//  Now those lines above are enough to create a working light.
	//  But we just can't leave well enough alone.
	//  Check out some of these options properties we can play with.

	light.position.set( 100, 200, 300 )
	light.target.position.copy( scene.position )
	light.shadowCameraTop     =  600
	light.shadowCameraRight   =  600
	light.shadowCameraBottom  = -600
	light.shadowCameraLeft    = -600
	light.shadowCameraNear    =  600
	light.shadowCameraFar     = -600
	light.shadowBias          =   -0.0001
	light.shadowDarkness      =    0.2
	light.shadowMapWidth      = light.shadowMapHeight = 2048
	//light.shadowCameraVisible = true
}




function addCube( dimensions ){
	
	dimensions = dimensions || {}
	
	var
	x = dimensions.x || 0,
	y = dimensions.y || 0,
	z = dimensions.z || 0,

	size  = dimensions.size  || 20,
	color = dimensions.color || 0xFFFFFF,
	
	geometry = new THREE.CubeGeometry( size, size, size ),
	material = new THREE.MeshLambertMaterial({ color: color }),
	cube     = new THREE.Mesh( geometry, material )

	cube.position.set( x, y, z )
	cube.receiveShadow = true
	cube.castShadow = true
	scene.add( cube )
}




function loop(){

	window.requestAnimationFrame( loop )
	render()
	controls.update()
}




function render(){
	
	renderer.render( scene, camera )
}



