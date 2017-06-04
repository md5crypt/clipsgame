/*jshint browser: true, jquery: true, devel: true, freeze:true, latedef:true, nocomma:true, nonbsp:true, nonew:true, strict:true, undef:true, unused:true*/
/*globals Module, FS, micromd */
(function(){
"use strict";

var level = null;

function Alert(id){
	var el = $(id);
	this.el = el;
	this.span = el.find('span.alert-msg');
	var type = '';
	el.attr("class").split(/\s+/).forEach(function(o){
		if(o.match(/^alert-/))
			type = o.slice(6);
	});
	this.type = type;
	el.find('button').click(function(){
		el.hide();
	});
}

Alert.prototype.show = function(type,msg){
	if(type != this.type){
		if(this.type)
			this.el.removeClass('alert-'+this.type);
		this.el.addClass('alert-'+type);
		this.type = type;
	}
	this.span.html(msg);
	this.el.show();
};

Alert.prototype.clear = function(){
	this.el.hide();
};

function Clips(){
	this.env = Module.ccall('CreateEnvironment', 'number', [],[]);
	this.ds = Module.ccall('malloc','number', ['number'],[512]);
	this.buffer = [];
	var self = this;
	Module.print = function(str){
		self.buffer.push(str);
	};
}

Clips.prototype.recover = function(){
	Module.ccall('SetEvaluationError', 'number',['number','number'],[this.env,0]);
	Module.ccall('SetHaltExecution', 'number',['number','number'],[this.env,0]);
};

Clips.prototype.eval = function(str){
	this.buffer = [];
	this.recover();
	Module.ccall('EnvEval', 'number', ['number','string','number'],[this.env,str,this.ds]);
	return this.buffer;
};

function Console(id){
	this.el = $(id);
}

Console.prototype.clear = function(){
	this.el.html('');
};

Console.prototype.append = function(o){
	if(o.constructor === String)
		this.el.append('<pre>'+o+'</pre>');
	else if(o.constructor === Array)
		this.el.append(o.map(function(o){return '<pre>'+o+'</pre>';}).join(''));
};

function Level(levels){
	this.console = new Console('#console');
	this.levels = levels;
	this.current = null;
	this.clips = null;
	this.cache = {};
}

Level.prototype.exec = function(cmd,echo){
	if(typeof echo === 'undefined' || echo === true)
		this.console.append('<pre>&gt; '+cmd+'</pre>');
	this.console.append(this.clips.eval(cmd));
};

Level.prototype.reset = function(){
	this.console.clear();
	this.clips.eval('(unwatch facts)');
	this.clips.eval('(unwatch activations)');
	this.clips.eval('(clear)');
	this.clips.eval('(undeffacts initial-fact)');
	this.clips.eval('(reset)');
	this.clips.eval('(watch facts)');
	this.clips.eval('(watch activations)');
	this.exec('(load '+this.current.key+'.clp'+')');
	this.exec('(reset)',false);
	this.exec('(run)',false);
};

Level.prototype.assert = function(fact){
	this.exec('(assert '+fact+')');
	this.exec('(run)',false);
	this.history.push(fact);
};

Level.prototype.undo = function(){
	var fact = this.history.pop();
	this.reset();
	var self = this;
	this.history.forEach(function(fact){
		self.exec('(assert '+fact+')');
		self.exec('(run)',false);
	});
	return fact;
};

Level.prototype.hasFact = function(fact){
	return this.clips.eval('(facts)').join().indexOf(fact) >= 0;
};

Level.prototype.load = function(id,success,fail){
	if(!this.clips)
		this.clips = new Clips();
	var key = this.levels[id];
	if(this.cache.hasOwnProperty(key)){
		this.current = this.cache[key];
		this.history = [];
		this.reset();
		return success();
	}
	var conf = null;
	var clp = null;
	var self = this;
	var p = $.when(
		$.getJSON('levels/'+key+'.json').done(function(data){
			conf = data;
		}),
		$.get('levels/'+key+'.clp').done(function(data){
			clp = data;
		})
	).then(function(){
		conf.clp = clp;
		conf.id = id;
		conf.key = key;
		conf.tabure = conf.tabu.map(function(o){
			return new RegExp('^'+o.replace(/([()])/g,'\\$1').replace(/\?/g,'[^\\s()]+')+'$');			
		});
		self.current = conf;
		FS.createDataFile("/", key+'.clp', clp, true, false);
		self.history = [];
		self.reset();
		self.cache[key] = conf;
		success();
	});
	p.fail(fail);
};

$(function(){
	var alertMsg = new Alert('#msg-alert');
	var alertGlobal = new Alert('#global-alert');
	var clipsLoaded = false;
	function rfail(msg){
		alertGlobal.show('danger','<strong>Connection problem!</strong> '+(msg||'Failed to load a resource.'));
		console.log(arguments);
		throw new Error();
	}
	function emscripten_busywait(callback){
		if(typeof Module !== 'undefined' && Module.calledRun === true)
			callback();
		else{
			setTimeout(function(){
				emscripten_busywait(callback);
			},100);
		}
	}
	function escapeHtml(input){
		return input.replace(/[&<>"']/g,function(m){
			return '&#'+m.charCodeAt(0)+';';
		});
	}
	function colorSyntax(code){
		var last = 'other';
		return code.replace(/(;[^\r\n]*)|(\?[^\s()]*)|\b(defrule|deffacts|assert|retract|not|and|or|forall|exists)\b|((?:[=><()-]+))|([^\s()]+)/g,function(match,comment,variable,keyword,operator){
			var type = 'other';
			if(comment)
				type = 'comment';
			else if(variable)
				type = 'variable';
			else if(keyword)
				type = 'keyword';
			else if(operator)
				type = 'operator';
			else if(last == 'keyword')
				type = 'name';
			last = type;
			return '<span class="clips-'+type+'">'+escapeHtml(match)+'</span>';
		});
	}
	function updateView(){
		alertMsg.clear();
		$('#continue-span').hide().find('a').attr('href','#level-'+(level.current.id+2));
		$('#title').html('Level '+(level.current.id+1)+': '+level.current.title);
		var desc = micromd(level.current.description)+'<h4>Goal</h4>'+micromd(level.current.goalStr);
		if(level.current.tabu && level.current.tabu.length > 0)
			desc += '<h4>Restricted facts</h4><ul>'+level.current.tabu.map(function(a){return '<li><code>'+a+'</code></li>';}).join('')+'</ul>';
		$('#info').html(desc);
		$('#defenitions').html(colorSyntax(level.current.clp));
		updateButtons();
	}
	function updateButtons(){
		if(level.history.length === 0)
			$('#btn_undo').addClass('disabled');
		else
			$('#btn_undo').removeClass('disabled');
		if(level.history.length === level.current.limit)
			$('#btn_assert').addClass('disabled');
		else
			$('#btn_assert').removeClass('disabled');
		if(level.current.limit > 0)
			$('#btn_assert').html('Assert ('+(level.current.limit-level.history.length)+' left)');
		else
			$('#btn_assert').html('Assert');
	}
	function loadClips(callback){
		if(clipsLoaded)
			return callback();
		alertGlobal.show('info','<strong>Loading...</strong> Please wait while the game loads. (fetching clips.js)');
		var script = document.createElement('script');
		script.innerHTML = "code";
		script.onerror = rfail;
		script.src = 'clips/clips.js';
		script.onload = function(){
			clipsLoaded = true;
			alertGlobal.show('info','<strong>Loading...</strong> Please wait while the game loads. (executing clips.js)');
			emscripten_busywait(callback);
		};
		document.body.appendChild(script);
	}
	function loadLevel(id){
		if(id >= level.levels.length || id < 0){
			alertGlobal.show('danger','<strong>No such level!</strong> Level <code>'+(id+1)+'</code> does not exist (yet).');
			return;
		}
		loadClips(function(){
			alertGlobal.show('info','<strong>Loading...</strong> Please wait while the game loads. (loading level)');
			level.load(id,function(){
				alertGlobal.clear();
				updateView();
				$('#level-content').show();
			},rfail);
		});
	}
	$('#input').keyup(function(event){
		if(event.keyCode == 13){
			$("#btn_assert").click();
			event.preventDefault();
		}
	});
	$('#btn_undo').click(function(){
		if(!level || !level.current || level.history.length === 0 || $(this).hasClass('disabled'))
			return;
		$('#continue-span').hide();
		var fact = level.undo();
		updateButtons();
		alertMsg.show('info','<strong>Undo complete!</strong> The fact <code>'+fact+'</code> and all following facts has been removed.');
		$('#input').val(fact);
		window.scrollTo(0,document.body.scrollHeight);
	});
	$('#btn_assert').click(function(){
		var fact = $('#input').val();
		if(!level || !level.current || !fact || $(this).hasClass('disabled'))
			return;
		$('#continue-span').hide();
		if(!fact.match(/^\s*\(\s*[a-zA-Z_][\w-]*(?:\s+[\w-]+)*\s*\)\s*$/)){
			alertMsg.show('danger','<strong>Incorrect fact!</strong> The input <code>'+fact+'</code> has inccorect syntax.');
			window.scrollTo(0,document.body.scrollHeight);
			return;
		}
		fact = fact.replace(/\s+/g,' ').replace(/\s*([()])\s*/g,'$1');
		for(var i=0; i<level.current.tabure.length; i++){
			if(fact.match(level.current.tabure[i])){
				alertMsg.show('danger','<strong>Restricted fact!</strong> The fact <code>'+fact+'</code> is restriced in this level and can not be asserted.');
				window.scrollTo(0,document.body.scrollHeight);
				return;
			}
		}
		if(level.hasFact(fact)){
			alertMsg.show('warning','<strong>Fact reassertion!</strong> The fact <code>'+fact+'</code> is allready in the fact table.');
			window.scrollTo(0,document.body.scrollHeight);
			return;
		}
		level.assert(fact);
		updateButtons();
		$('#input').val('');
		if(level.hasFact(level.current.goal)){
			alertMsg.show('success','<strong>Level cleared!</strong> '+(level.current.successStr?micromd(level.current.successStr):''));
			$('#continue-span').show();
			window.scrollTo(0,document.body.scrollHeight);
			return;
		}
		if(level.history.length == level.current.limit){
			alertMsg.show('warning','<strong>Level failed!</strong> No more facts can be asserted and the goal has not been reached.');
		}else{
			alertMsg.show('info','<strong>Fact asserted.</strong> The fact <code>'+fact+'</code> has been added to the fact table.');
		}
		window.scrollTo(0,document.body.scrollHeight);
	});
	$('.collapsable').click(function(){
		var self = $(this);
		if(self.hasClass('collapsed')){
			self.removeClass('collapsed');
			self.next().removeClass('content-collapsed').slideDown();
		}else{
			self.addClass('collapsed');
			self.next().addClass('content-collapsed').slideUp();
		}
	});
	$(window).on('hashchange',function(){
		$('article').hide();
		window.scrollTo(0,0);
		var hash = document.location.hash || '#level-select';
		if(hash == '#level-select'){
			alertGlobal.clear();
			$('#level-select').show();
		}else if(hash == '#how-to-play'){
			if($('#how-to-play').hasClass('loaded')){
				alertGlobal.clear();
				$('#how-to-play').show();
				return;
			}
			alertGlobal.show('info','<strong>Loading...</strong> Please wait while the game loads. (loading how-to-play)');
			$.get('howtoplay.md').done(function(data){
				$('#how-to-play').addClass('loaded');
				alertGlobal.clear();
				$('#how-to-play').html(micromd(data,false,function(type,code){
					return type=='clips'?colorSyntax(code):escapeHtml(code);
				})).show();
			}).fail(rfail);
		}else if(hash.slice(0,7) == '#level-'){
			loadLevel((hash.slice(7)|0)-1);
		}else{
			rfail('bad url hash');
		}
	});
	$.getJSON('levels/index.json').done(function(data){
		level = new Level(data);
		var str = '';
		for(var i=0; i<data.length; i++)
			str += '<a class="menu-link" href="#level-'+(i+1)+'"><strong>Level '+(i+1)+":</strong> <em>"+data[i]+'.clp</em></a>';
		$('#level-select div').html(str);
		$(window).trigger('hashchange');
	}).fail(rfail);
});

}).call(this);
