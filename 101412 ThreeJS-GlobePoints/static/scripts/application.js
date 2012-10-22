
$( document ).ready( function()	{
	//Call the Google GeoCoder
	window.geocoder = new google.maps.Geocoder()

	setupThree()
	addLights()
	addControls()

	// create a set of coordinate axes to help orient user
	// default size is 100 pixels in each direction; change size by setting scale
	// var axes = new THREE.AxisHelper();
	// axes.scale.set( 1, 1, 1 );
	// scene.add( axes );


	// var materialArray = [];
	// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'media/Space01a.png' ) }));
	// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'media/Space01b.png' ) }));
	// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'media/Space01c.png' ) }));
	// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'media/Space01d.png' ) }));
	// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'media/Space01e.png' ) }));
	// materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'media/Space01f.png' ) }));
	// var galaxyBoxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1, materialArray );
	// var galaxyBox = new THREE.Mesh( galaxyBoxGeom, new THREE.MeshFaceMaterial());
	// galaxyBox.doubleSided = true;
	// // galaxyBox.flipSided = false;
	// galaxyBox.scale.x = -1;
	// scene.add( galaxyBox )
	
	
	var space = new THREE.Mesh(
		new THREE.SphereGeometry( 2500, 300, 300 ),
		new THREE.MeshLambertMaterial({ 
			map: THREE.ImageUtils.loadTexture( 'media/Space02.jpg' )
		})
	)
	space.position.set( 0, 0, 0 )
	space.scale.x = -1;
	space.receiveShadow = true
	space.castShadow = true
	scene.add(space)


	//Create a Group to hold the objects
	window.group = new THREE.Object3D()


	///SETUP TWITTER DATA
	window.tweets        = []
	window.tweetsIndex   = -1 //What is this for?
	window.timePerTweet  = (3).seconds()
	window.tweetApiArmed = false


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
	

//Load Models

var THEMIS

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( 'models/Themis.dae', function ( collada ) {
	THEMIS = collada.scene;
	THEMIS.scale.x =THEMIS.scale.y =THEMIS.scale.z = 10;
	THEMIS.position.x= 110;
	THEMIS.position.y= 110;
	// console.log(THEMIS)
	// group.add(THEMIS)
} );


var ASTRONAUT

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( 'models/Astronaut.dae', function ( collada ) {
	ASTRONAUT = collada.scene;
	ASTRONAUT.scale.x =ASTRONAUT.scale.y =ASTRONAUT.scale.z = 10;
	ASTRONAUT.position.x= -110;
	ASTRONAUT.position.y= -110;
	// group.add(ASTRONAUT)
} );

scene.add( group )


//  But also, did you want to start out looking at a different part of
//  the Earth?

// group.rotation.y = ( -40 ).degreesToRadians()
// group.rotation.z = (  23 ).degreesToRadians()
var stats;

	THREEx.Screenshot.bindKey(renderer);

	if( THREEx.FullScreen.available() ){
							    		THREEx.FullScreen.bindKey();		
										document.getElementById('controls').innerHTML += "- <i>f</i> for fullscreen";
										}

	
	if( tweetApiArmed ) fetchTweets()
	else {
		
		console.log( 'You are not fetching actually tweets, but loading canned tweets from your database.js file.' )
		console.log( 'To change this find the "tweetApiArmed" variable in application.js and set it to true.' )
		importTweets()
	}
	nextTweet()

loop()	


})


function loop(){

	//  Let's rotate the entire group a bit.
	//  Then we'll also rotate the cloudsTexture slightly more on top of that.

	group.rotation.y  += ( 0.10 ).degreesToRadians()
	clouds.rotation.y += ( 0.05 ).degreesToRadians()
	
	render()
	controls.update()
	stats.update();
	
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

	markerTip= new THREE.Mesh(
		new THREE.CylinderGeometry(.75, 0,5, 100, 100, false),
		new THREE.MeshBasicMaterial({
	            color: 0x878483
	        })
		);
	marker = new THREE.Mesh(
		new THREE.CylinderGeometry(.75, .75, 10, 100, 100, false),
		new THREE.MeshBasicMaterial({
	            color: 0x878483
	        })
		);

	markerHead= new THREE.Mesh(
		new THREE.SphereGeometry( 3, 32, 32 ),
		new THREE.MeshLambertMaterial({ 
		        color: color
		})
		);

	markerTip.position.y=earthRadius-1
	marker.position.y = markerTip.position.y+7
	markerHead.position.y=marker.position.y+5

	group1.add( marker )
	group1.add( markerTip )
	group1.add( markerHead )
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
	// WIDTH      = 600,
	WIDTH      = window.innerWidth,
	// HEIGHT     = 600,
	HEIGHT     = window.innerHeight,
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
	
	window.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })

	//window.renderer = new THREE.CanvasRenderer({ antialias: true })
	renderer.setSize( WIDTH, HEIGHT )
	renderer.shadowMapEnabled = true
	renderer.shadowMapSoft = true


	//  In previous examples I've used the direct JavaScript syntax of
	//  document.getElementById( 'three' ).appendChild( renderer.domElement )
	//  but now that we're using the jQuery library in this example we can
	//  take advantage of it:	

	$( '#three' ).append( renderer.domElement )

// Add Stats
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	$( '#three' ).append( stats.domElement );

//Resize on window siziechange
	window.addEventListener( 'resize', onWindowResize, false );

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

function moveToPoint( latitude, longitude ) {

		var phi = latitude * Math.PI / 180;
		var theta = longitude * Math.PI / 180;

		target.x = - Math.PI / 2 + theta;
		target.y = phi;
		
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

	

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}

function locateWithGoogleMaps( text ){	


	//  We also need to be wary of exceeding Google’s rate limiting.
	//  But Google seems to be much more forgiving than Twitter.
	//  If you want to be a good citizen you should sign up for a free 
	//  API key and include that key in your HTML file. How? See here:
	//  https://developers.google.com/maps/documentation/javascript/tutorial

	//  For more on the geocoding service that we’re using see here:
	//  https://developers.google.com/maps/documentation/javascript/geocoding
	
	geocoder.geocode( { 'address': text }, function( results, status ){

		if( status == google.maps.GeocoderStatus.OK ){

			console.log( '\nGoogle maps found a result for “'+ text +'”:' )
			console.log( results[0].geometry.location )
			tweets.push({

				latitude:  results[0].geometry.location.lat(),
				longitude: results[0].geometry.location.lng()
			})
		} 
		else {

			console.log( '\nNOPE. Even Google cound’t find “'+ text +'.”' )
			console.log( 'Status code: '+ status )
		}
	})
}


function fetchTweets(){


	//  https://api.twitter.com/1/account/rate_limit_status.json

	console.log( '\n\nFetching fresh tweets from Twitter.' )
	$.ajax({

		url: 'http://search.twitter.com/search.json?geocode=0,0,6400km',

		//  We have to use the datatype 'JSONp' (JavaScript Object Notation with
		//  Padding) in order to safely fetch data that’s not coming from our own
		//  domain name. (Basically, side-stepping a browser security issue.)

		dataType: 'jsonp',
		success: function( data ){

			console.log( 'Received the following data from Twitter:' )
			console.log( data )


			//  If you check the console we’ve just ouput the Twitter data,
			//  and the tweets themselves are stored in the data.results[]
			//  array which we will loop through now:

			data.results.forEach( function( tweet, i ){
				
				console.log( '\nInspecting tweet #'+ (i+1) +' of '+ data.results.length +'.' )
				if( tweet.geo && 
					tweet.geo.coordinates && 
					tweet.geo.coordinates.type === 'Point' ){
					
					console.log( 'YES! Twitter had the latitude and longitude:' )
					console.log( tweet.geo )
					tweets.push({

						latitude:  tweet.geo.coordinates[ 0 ],
						longitude: tweet.geo.coordinates[ 1 ]
					})
				}
				else if( tweet.location ){
					
					console.log( 'Ok. Only found a location name, will try Google Maps for:' )
					console.log( tweet.location )
					setTimeout( function(){
						locateWithGoogleMaps( tweet.location )
					}, i * timePerTweet.divide(2).round() )//Whats going on here?
				}
				else if( tweet.iso_language_code ){
					
					console.log( 'Not good: Resorting to the ISO language code as last hope:' )
					console.log( tweet.iso_language_code )
					setTimeout( function(){
						locateWithGoogleMaps( tweet.iso_language_code )
					}, i * timePerTweet.divide(2).round() )
				}
				else {

					console.log( 'Sad face. We couldn’t find any useful data in this tweet.' )
				}
			})
		},
		error: function(){

			console.log( 'Oops. Something went wrong requesting data from Twitter.' )
		}
	})
}

// convert the positions from a lat, lon to a position on a sphere.
function latLongToVector3(latitude, longitude, radius, height) {
	var phi = (latitude)*Math.PI/180;
	var theta = (longitude-180)*Math.PI/180;

	var x = -(radius+height) * Math.cos(phi) * Math.cos(theta);
	var y = (radius+height) * Math.sin(phi);
	var z = (radius+height) * Math.cos(phi) * Math.sin(theta);

	return new THREE.Vector3(x,y,z);
}

function connectLine(positionVector1, positionVector2){

			var material = new THREE.LineBasicMaterial({
                            color: 0x74ffa3,
                            linewidth: 1
                            });

	

			// SCALED POINTS APPROACH
			vector21 = new THREE.LineCurve(positionVector2,positionVector1)
        	var points = vector21.getPoints();
            var spacedPoints = vector21.getSpacedPoints( 50 );
            

            for(var i=0; i<spacedPoints.length-1; i++){
             normalizedVector211 = new THREE.Vector3()
             normalizedVector212 = new THREE.Vector3()
             normalizedVector211.copy(spacedPoints[i])
             normalizedVector212.copy(spacedPoints[i+1])

             
             normalizedVector211.normalize().multiplyScalar( earthRadius+2)
             normalizedVector212.normalize().multiplyScalar( earthRadius+2)
            

             var geometry = new THREE.Geometry();
            geometry.vertices.push(normalizedVector211);
			geometry.vertices.push(normalizedVector212);
			var line = new THREE.Line(geometry, material, THREE.LineStrip);	
			group.add(line);
           }


}

function nextTweet(){
	
	if( tweetsIndex + 1 < tweets.length ){

		tweetsIndex ++

		//  Ideas for you crazy kids to spruce up your homework:
		//  1. Only shine the sun on the part of Earth that is actually
		//     currently experience daylight!
		//  2. Rotate the globe to face the tweet you’re plotting.
		//  3. Don’t just place the pin, but animate its appearance;
		//     maybe it grows out of the Earth?
		//  4. Display the contents of the tweet. I know, I know. We haven’t
		//     even talked about text in Three.js yet. That’s why you’d get
		//     über bragging rights.

		group.add( dropPin(

			tweets[ tweetsIndex ].latitude,
			tweets[ tweetsIndex ].longitude,
			0Xff0e28
		))

		if(tweetsIndex>0){
		tweet1 = latLongToVector3(tweets[ tweetsIndex ].latitude, tweets[ tweetsIndex ].longitude, earthRadius, 1)
		tweet2 = latLongToVector3(tweets[ tweetsIndex-1 ].latitude,tweets[ tweetsIndex-1 ].longitude, earthRadius, 1 )
		connectLine(tweet2,tweet1)
		}

		//  I’m trying to be very mindful of Twitter’s rate limiting.
		//  Let’s only try fetching more tweets only when we’ve exhausted our
		//  tweets[] array supply.
		//  But leave this commented out when testing!
		
		//if( tweetsIndex === tweets.length - 1 ) fetchTweets()
	}	
	setTimeout( nextTweet, timePerTweet )
}


function exportTweets(){


	//  Another way to be mindful of rate limiting is to PLAN AHEAD.
	//  Why not save out this data you’ve already acquired?
	//  This will dump your tweet data into the console for you
	//  so you can copy + paste it into your /scripts/database.js file.

	var data = 'database = database.concat(['
	tweets.forEach( function( tweet, i ){

		data += '\n	{'
		data += '\n		latitude:  '+ tweet.latitude +','
		data += '\n		longitude: '+ tweet.longitude
		data += '\n	}'
		if( i < tweets.length - 1 ) data += ','
	})
	data += '\n])'
	console.log( data )
}




function importTweets(){

	//  Did you save any tweets to your /scripts/database.js file?
	//  If so, you can add those right in!

	tweets = tweets.concat( database )
}

