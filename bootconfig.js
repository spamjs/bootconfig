define({
	name : "bootconfig",
	extend : "spamjs.view",
	modules : ["jqrouter"]
}).as(function(bootconfig,jqrouter){
	
	jqrouter.start(bootloader.config().appContext);
	
	return {
		routerBase : "boot",
		routerEvents : {
			"/config" : "loadbootconfig"
		},
		events : {
			"click #saveConfig" : "saveConfig"
		},
		_init_ : function(){
			if(this.options.routerBase){
				this.routerBase = this.options.routerBase;
				this.router = jqrouter.instance(this);
			} else {
				this.loadbootconfig();
			}
		},
		loadbootconfig : function(){
			var config  = JSON.parse(window.localStorage.getItem("bootConfig"));
			if(!config){
				config = JSON.parse(JSON.stringify(bootloader.config()));
			}
			delete config.resource;
			config = JSON.stringify(config,null, "\t");
			this.view("bootconfig.html",{
				config : config
			});
		},
		saveConfig : function(){
			var config = jQuery("#configInput").val();
			config = JSON.stringify(JSON.parse(config));
			window.localStorage.setItem("bootConfig",config);
		},
		_remove_ : function(){
			this.router.off();
		}
	};
	
})