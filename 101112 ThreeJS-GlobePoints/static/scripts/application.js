
//  Now that we've included jQuery we can use its syntax for determining if
//  the full HTML page has been loaded. Waiting for the document to be ready
//  helps us avoid strange errors--because if our document is ready that means
//  all of our JavaScript libraries should have properly loaded too!

$( document ).ready( function(){
	

	//  During our last class I spoke about what these functions are doing. 
	//  Have another look at them on your own to jog your memory.

	setupThree()
	addLights()


	//  This template includes mouse controls. 
	//  Make sure that once you load this file in your browser that the browser 
	//  window is in focus. (Just click anywhere on the loaded page.)
	//  Hold down 'A' and move your mouse around to rotate around the scene.
	//  Hold down 'S' and move your mouse up or down to zoom.
	//  Hold down 'D' and move your mouse around to pan.

	addControls()




	//  Let's create a group to collect our objects together in.
	//  This idea of grouping is going to replace the idea of 
	//  pushMatrix() and popMatrix() that you might be familiar with
	//  from Processing: 
	//  We pack everything into a containing group and when we move or
	//  rotate the group all of the group members follow along.

	//  Notice how we're not declaring a new variable, but attaching it to
	//  the global "window" object. If we didn't this poor variable would be
	//  limited to this function's scope only--we'd never be able to access
	//  it elsewhere!

	window.group = new THREE.Object3D()


	//  Now for Earth. We're going to create a Sphere with a specific radius.
	//  The other two params are for segmentsWidth and segmentsHeight.
	//  The higher those values, the higher resolution (smoother) the curves
	//  of your sphere will be. Play with the values and see for yourself.
	//  The other thing to note is that we're going to texture the sphere
	//  with an image. The textures used in this demo come from a VERY
	//  useful resource: http://www.celestiamotherlode.net/catalog/earth.php

	window.earthRadius = 90
	window.earth = new THREE.Mesh(
		new THREE.SphereGeometry( earthRadius, 300, 300 ),
		new THREE.MeshLambertMaterial({ 
			map: THREE.ImageUtils.loadTexture( 'media/earthTexture.png' )
		})
	)
	earth.position.set( 0, 0, 0 )
	earth.receiveShadow = true
	earth.castShadow = true
	group.add( earth )


	//  But what's Earth without a few clouds? Note here how we handle 
	//  transparency (so you can see through the gaps in the clouds down to
	//  Earth's surface) and how we use blending modes to make it happen.
	//  Check out this really useful resource for understanding the blending
	//  modes available in Three.js:
	//	http://mrdoob.github.com/three.js/examples/webgl_materials_blending_custom.html

	window.clouds = new THREE.Mesh(
		new THREE.SphereGeometry( earthRadius + 2, 32, 32 ),
		new THREE.MeshLambertMaterial({ 
			map: THREE.ImageUtils.loadTexture( 'media/cloudsTexture.png' ),
			transparent: true,
			blending: THREE.CustomBlending,
			blendSrc: THREE.SrcAlphaFactor,
			blendDst: THREE.SrcColorFactor,
			blendEquation: THREE.AddEquation
		})
	)
	clouds.position.set( 0, 0, 0 )
	clouds.receiveShadow = true
	clouds.castShadow = true
	group.add( clouds )	
	
	//  Working with latitude and longitude can be tricky at first
	//  because it feels like X and Y have been swapped
	//  and you also have to remember South and West are negative!
	//  Here are the boundaries of the coordinate system:

	//  Latitude	North +90	South -90
	//  Longitude	West -180	East +180

	//  And if you're itching to read more about sphere mapping:
	//  http://en.wikipedia.org/wiki/Longitude
	//  http://en.wikipedia.org/wiki/Latitude

	
	//Marks Points
	
	
	
	group.add( dropPin(//  Nice, France -------------------------------------
	
		43.7082, 
		 7.2692, 
		0xFF0000
	))
	
	group.add( dropPin(//  Hue, Vietnam -------------------------------------
	
		16.4711, 
	   107.5858, 
		0xFFF300
	))
	
	group.add( dropPin(//  St Gallen, Switzerland -------------------------------------
	
		47.4235, 
	     9.3763, 
		0xE82203
	))
	
	group.add( dropPin(//  Bombay, India-------------------------------------
	
		18.9647, 
	     72.8258, 
		0xFFFFFF
	))
	
	group.add( dropPin(//  Istanbul, Turkey-------------------------------------
	
		41.0128, 
		28.9744, 
		0xFF372F
	))


	//  Finally, we add our group of objects to the Scene.

	scene.add( group )


	//  But also, did you want to start out looking at a different part of
	//  the Earth?

	// group.rotation.y = ( -40 ).degreesToRadians()
	// group.rotation.z = (  23 ).degreesToRadians()


	//  Let's get our loop() on. 
	//  We only need to call loop() once and from there it will call itself.
	//  See inside the loop() function for more details.

	loop()	
})


function loop(){

	//  Let's rotate the entire group a bit.
	//  Then we'll also rotate the cloudsTexture slightly more on top of that.

	group.rotation.y  += ( 0.10 ).degreesToRadians()
	clouds.rotation.y += ( 0.05 ).degreesToRadians()

	render()
	controls.update()
	
	
	//  This function will attempt to call loop() at 60 frames per second.
	//  See  this Mozilla developer page for details:
	//  https://developer.mozilla.org/en-US/docs/DOM/window.requestAnimationFrame
	//  And also note that Three.js modifies this function to account for
	//  different browser implementations.
	
	window.requestAnimationFrame( loop )
}




//  Nesting rotations correctly is an exercise in patience.
//  Imagine that our marker is standing straight, from the South Pole up to
//  the North Pole. We then move it higher on the Y-axis so that it peeks
//  out of the North Pole. Then we need one container for rotating on latitude
//  and another for rotating on longitude. Otherwise we'd just be rotating our
//  marker shape rather than rotating it relative to the Earth.

function dropPin( latitude, longitude, color ){

	var 
	group1 = new THREE.Object3D(),
	group2 = new THREE.Object3D(),
	markerLength = 36,
	marker = new THREE.Mesh(
		new THREE.CubeGeometry( 2, markerLength, 2 ),
		new THREE.MeshBasicMaterial({ 
			color: color
		})
	)
	marker.position.y = earthRadius

	group1.add( marker )
	group1.rotation.x = ( 90 - latitude  ).degreesToRadians()

	group2.add( group1 )
	group2.rotation.y = ( 90 + longitude ).degreesToRadians()

	return group2
}


//  Why separate this simple line of code from the loop() function?
//  So that our controls can also call it separately.

function render(){

	renderer.render( scene, camera )
}


//  I'll leave this in for the moment for reference, but it seems to be
//  having some issues ...

// function surfacePlot( params ){

// 	params = cascade( params, {} )
// 	params.latitude  = cascade( params.latitude.degreesToRadians(),  0 )
// 	params.longitude = cascade( params.longitude.degreesToRadians(), 0 )
// 	params.center    = cascade( params.center, new THREE.Vector3( 0, 0, 0 ))
// 	params.radius    = cascade( params.radius, 60 )

// 	var
// 	x = params.center.x + params.latitude.cosine() * params.longitude.cosine() * params.radius,
// 	y = params.center.y + params.latitude.cosine() * params.longitude.sine()   * params.radius,
// 	z = params.center.z + params.latitude.sine()   * params.radius

// 	return new THREE.Vector3( x, y, z )
// }


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
	HEIGHT     = 600,
	VIEW_ANGLE = 45,
	ASPECT     = WIDTH / HEIGHT,
	NEAR       = 0.1,
	FAR        = 10000
	
	window.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR )
	camera.position.set( 0, 0, 300 )
	camera.lookAt( scene.position )
	scene.add( camera )


	//  Finally, create a Renderer to render the Scene we're looking at.
	//  A renderer paints our Scene onto an HTML5 Canvas from the perspective 
	//  of our Camera.
	
	window.renderer = new THREE.WebGLRenderer({ antialias: true })
	//window.renderer = new THREE.CanvasRenderer({ antialias: true })
	renderer.setSize( WIDTH, HEIGHT )
	renderer.shadowMapEnabled = true
	renderer.shadowMapSoft = true


	//  In previous examples I've used the direct JavaScript syntax of
	//  document.getElementById( 'three' ).appendChild( renderer.domElement )
	//  but now that we're using the jQuery library in this example we can
	//  take advantage of it:	

	$( '#three' ).append( renderer.domElement )
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
	controls.keys = [ 65, 83, 68 ]//  ASCII values for A, S, and D

	controls.addEventListener( 'change', render ) // on a change call render
}




function addLights(){
	
	var
	ambient,
	directional
	
	
	//  Let's create an Ambient light so that even the dark side of the 
	//  earth will be a bit visible. 
	
	ambient = new THREE.AmbientLight( 0x666666 )
	scene.add( ambient )	
	
	
	//  Now let's create a Directional light as our pretend sunshine.
	
	directional = new THREE.DirectionalLight( 0xCCCCCC )
	directional.castShadow = true	
	scene.add( directional )


	//  Those lines above are enough to create another working light.
	//  But we just can't leave well enough alone.
	//  Check out some of these options properties we can play with.

	directional.position.set( 100, 200, 300 )
	directional.target.position.copy( scene.position )
	directional.shadowCameraTop     =  600
	directional.shadowCameraRight   =  600
	directional.shadowCameraBottom  = -600
	directional.shadowCameraLeft    = -600
	directional.shadowCameraNear    =  600
	directional.shadowCameraFar     = -600
	directional.shadowBias          =   -0.0001
	directional.shadowDarkness      =    0.3
	directional.shadowMapWidth      = directional.shadowMapHeight = 2048
	//directional.shadowCameraVisible = true
}




