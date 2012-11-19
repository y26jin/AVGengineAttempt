var GameEngine = function(){
	var gameEvent = new GameEngineEvent();// initialize events
		// bind events to the event queue
		gameEvent.addEventListener('onLoad',doLoad);// load file or script
		gameEvent.addEventListener('onTransit',doTransit);// jump to a new scene
		gameEvent.addEventListener('onSceneEnd', doSceneEnd);// a scene ends
		gameEvent.addEventListener('onGameEnd', doGameEnd); // game ends
		gameEvent.addEventListener('onRewind', doRewind); // game path rewind
		// event finished
	
	// examine if jQuery has been loaded
	if(typeof $ === 'undefined'){
		alert('jQuery is not loaded.');
	}
	
	// load configuration files
	//var config = loadConfig();
	
	// Get game info
	this.GetInfo = function(){
		alert("1");
		$('.stage').fadeIn('slow');
		$('.stage').append("<li>lmmm</li>");
		
		$('.stage').fadeOut('slow');
		// just attempt to insert stuff in div
		// will update
		};
	
	this.GamePlay = function(){
		var param = '<li>onLoad</li>';
		gameEvent.onLoad(param);
	};
	
	// 	
	function doLoad(param){
		$('.stage').fadeIn('slow');
		$('.stage').append('<li>lmao</li>');
	}
	
	function doTransit(param){
		$('.stage').fadeIn('slow');
		$('.stage').append('<li>doTransit</li>');
	}
	
	function doSceneEnd(param){
		$('.stage').fadeIn('slow');
		$('.stage').append('<li>doSceneEnd</li>');
	}
	
	function doGameEnd(param){
		$('.stage').fadeIn('slow');
		$('.stage').append('<li>doGameEnd</li>');
	}
	
	function doRewind(param){
		$('.stage').fadeIn('slow');
		$('.stage').append('<li>doRewind</li>');
	}
	
	function GameEngineEvent(){
		
		// generate a unique MD5 for each event func call
		this._hashCodeCounter=0;
		this.toHashCode=function(o){
			if(o._hashCode)
				return o._hashCode;
			
			return o._hashCode="_"+(this._hashCodeCounter++).toString(32);
			
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
		this.onTransit = function(param){
			this.dispatchEvent('onTransit', param);
		};
		this.onSceneEnd = function(param){
			this.dispatchEvent('onSceneEnd', param);
		};
		this.onGameEnd = function(param){
			this.dispatchEvent('onGameEnd', param);
		};
		this.onRewind = function(param){
			this.dispatchEvent('onRewind', param);
		};
	}
}