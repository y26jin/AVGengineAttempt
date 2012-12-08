var GameEngine = function(){
	var gameEvent = new GameEngineEvent();// initialize events
		// bind events to the event queue
		gameEvent.addEventListener('onLoad',doLoad);// load the game
		gameEvent.addEventListener('onNextLine', doNextLine);// move to next line
		gameEvent.addEventListener('onTransit',doTransit);// jump to a new scene
		gameEvent.addEventListener('onSceneEnd', doSceneEnd);// a scene ends
		gameEvent.addEventListener('onGameEnd', doGameEnd); // game ends
		gameEvent.addEventListener('onReview', doReview); // game path Review
		// event finished
	
	// examine if jQuery has been loaded
	if(typeof $ === 'undefined'){
		alert('jQuery is not loaded.');
	}
	
	// current script number
	var scriptNo = 1;
	// current scene number
	var sceneNo = 1;
	// current line number 
	var lineNo = 0;
	// history lines
	var historyLines = new Array();
	
	
	// Get game info
	this.GetInfo = function(){
		alert("1");
		$('.comment').fadeIn('slow');
		$('.comment').append("<li>lmmm</li>");
		
		$('.comment').fadeOut('slow');
		// just attempt to insert stuff in div
		// will update
		};
	
	// load external file via ajax.
	// in most cases those loaded files are JSON
	function loadfile(requestURL, type){
		var file = (function(){
				var jsonValue = null;
				$.ajax({
					async: false,
					url: requestURL,
					dataType: type,
					success: function(data){
						jsonValue = data;
					},
					error: function(response, errorThrow){
									alert(errorThrow);
							}
				});
				return jsonValue;
				})();
		
		if(!file) alert('Error!The requested file cannot be opened.');
		
		return file;
	}
	
	// Enable settings and initialize scenes 
	this.GamePlay = function(){
		// Load the game script and parse
		var script = loadfile("./scripts/test2.json", "json");
		if(!script){
			alert('The script was not successfully loaded.');
			return;
		}
		
		var title = script.title;
		var settings = script.settings;
		var charaters = script.charaters;
		var story = script.story;
		
		// if everything is alright, send the onload event to initialize the game
		gameEvent.onLoad("Start!");
		// bind mouse event to the gameplay body
		// every click leads to one line in the script showing up
		// if the script goes to a jump/end point, send the corresponding event
		// else, just go to the next line
	    var currentLine = lineNo;
		var $engine = $(document);
		// bind mouse left click
		$engine.click(function(){
			if(currentLine < story.length){
				// move to next line in the current scene
				gameEvent.onNextLine(story[currentLine].words);
				currentLine++;
			}
			else{
				alert("yo");
			}
			
		});
		// bind keyboard enter press
		$engine.keyup(function(e){
			if(e.which === 13){// enter button(normal mode, line by line)
				if(currentLine < story.length){
				// move to next line in the current scene
					gameEvent.onNextLine(story[currentLine].words, currentLine);
					currentLine++;
				}
				else{
					alert("yo");
				}
			}
		});
		$engine.keydown(function(e){
			if(e.which === 17){// ctrl (able to forward content)
				if(currentLine < story.length){
				// move to next line in the current scene
					gameEvent.onNextLine(story[currentLine].words);
					currentLine++;
					lineNo = currentLine;
				}
				else{
					alert("yo");
				}
			}
			else if(e.which === 16){
				if(currentLine >= 0 && currentLine <= story.length){
					gameEvent.onReview(story[currentLine].words);
					currentLine--;
				}
			}
		});
		
		
	};
	
	// 	
	function doLoad(param){
		$('.comment').append(param);
		$('.comment').fadeOut('slow');
	}
	
	function doNextLine(param){
		historyLines.push(param);
		$('.stage').append('<b>');
		$('.stage').append(param);
		$('.stage').append('</b>');
	}
	
	function doTransit(param){
		$('.comment').fadeIn('slow');
		$('.comment').append('<li>doTransit</li>');
	}
	
	function doSceneEnd(param){
		$('.comment').fadeIn('slow');
		$('.comment').append('<li>doSceneEnd</li>');
	}
	
	function doGameEnd(param){
		$('.comment').fadeIn('slow');
		$('.comment').append('<li>doGameEnd</li>');
	}
	
	function doReview(param){
		alert(param);
		var WIDTH = 400, HEIGHT = 300;
		var VIEWANGLE = 45, ASPECT = WIDTH/HEIGHT, NEAR = 0.1, FAR = 10000;
		var $container = $('.stage');
		
		var renderer = new THREE.WebGLRenderer();
		var camera = new THREE.PerspectiveCamera(VIEWANGLE, ASPECT, NEAR, FAR);
		var scene = new THREE.Scene();
		scene.add(camera);
		camera.position.z = 300;
		renderer.setSize(WIDTH, HEIGHT);
		$container.append(renderer.domElement);
		
		var radius = 50, segments = 16, rings = 16;
		var sphere = new THREE.Mesh(
			new THREE.SphereGeometry(
				radius,
				segments,
				rings),
			sphereMaterial
		);
		var sphereMaterial = new THREE.MeshLambertMaterial({
				color: 0xCC0000	
		});
		scene.add(sphere);
		
		var light = new THREE.SpotLight();
		light.position.set(400,300,0);
		scene.add(light);
		
		var litCube = new THREE.Mesh(
			new THREE.CubeGeometry(30, 30, 30),
			new THREE.MeshLambertMaterial({color: 0xFFFFFF}));
		litCube.position.y = 60;
		
		renderer.shadowMapEnabled = true;
		light.castShadow = true;
		litCube.castShadow = true;
		litCube.receiveShawdo = true;
		
		
		scene.add(litCube);	
	
		// add a plane for rotation
		var planeGeo = new THREE.PlaneGeometry(400,200,10,10);
		var planeMat = new THREE.MeshLambertMaterial({color:0xFFFFFF});
		var plane = new THREE.Mesh(planeGeo, planeMat);
		//plane.rotation.x = - Math.PI/2;
		plane.position.y = 0;
		plane.receiveShadow = true;
		scene.add(plane);
		
		
		renderer.render(scene,camera);
		
		
		var paused = false;
		function animate(t){
			if(!paused){
				litCube.position.x = Math.cos(t/600)*85;
				litCube.position.y = 40;
				litCube.position.z = Math.sin(t/600)*85;
				litCube.rotation.x = t/500;
				litCube.rotation.y = t/800;
				camera.position.set(
					Math.sin(t/1000)*300, 150, Math.cos(t/1000)*300
				);
				renderer.clear();
				camera.lookAt(scene.position);
				renderer.render(scene, camera);
			}
			window.requestAnimationFrame(animate, renderer.domElement);
		};
		animate(new Date().getTime());
	}
	
	function GameEngineEvent(){
		
		// generate a unique MD5 for each event func call
		this._hashCodeCounter=0;
		this.toHashCode=function(param){
			if(param._hashCode)
				return param._hashCode;
			
			return param._hashCode="_"+(this._hashCodeCounter++).toString(32);
			
		};
		
		// add event to the listener queue
		this._listeners = {};
		this.addEventListener = function(eventType, func){
			if('function' != typeof func){
				return;
			}
			else{
				var listener = this._listeners[eventType];
				if(!listener){
						this._listeners[eventType] = {};
						listener = this._listeners[eventType];
				}
				listener[this.toHashCode(func)] = func;
			}
		};
		
		// dispatch function def
		this.dispatchEvent=function(sType,param){
			if(!this._listeners[sType])
				return;
			for(var hashfun in this._listeners[sType]){
				this._listeners[sType][hashfun].call(this,param);
			}
		};
		
		// pull the method off from event queue
		this.onLoad = function(param){
			this.dispatchEvent('onLoad', param);
		};
		this.onNextLine = function(param){
			this.dispatchEvent('onNextLine', param);
		};
		this.onTransit = function(param){
			this.dispatchEvent('onTransit', param);
		};
		this.onSceneEnd = function(param){
			this.dispatchEvent('onSceneEnd', param);
		};
		this.onGameEnd = function(param){
			this.dispatchEvent('onGameEnd', param);
		};
		this.onReview = function(param){
			this.dispatchEvent('onReview', param);
		};
	}
}