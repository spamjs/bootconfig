define({
	name : "bootconfig",
	extend : "spamjs.view",
	modules : ["jqrouter"]
}).as(function(bootconfig,jqrouter){
	
	jqrouter.start(bootloader.config().appContext);
	
	return {
		routerEvents : {
			"/bootconfig" : "loadbootconfig"
		},
		_init_ : function(){
			this.router = jqrouter.instance(this);
			//this.loadbootconfig();
		},
		loadbootconfig : function(){
			config = JSON.parse(JSON.stringify(bootloader.config()));
			delete config.resource;
			var config = JSON.stringify(config,null, "\t");
			this.view("bootconfig.html",{
				config : config
			});
		},
		_remove_ : function(){
			this.router.off();
		}
	};
	
})