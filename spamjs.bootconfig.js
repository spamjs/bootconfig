define({
	name : "spamjs.bootconfig",
	extend : "spamjs.view",
	modules : ["jqrouter"]
}).as(function(bootconfig,jqrouter){
	
	jqrouter.start(bootloader.config().appContext);
	
	return {
		routerBase : "boot",
		routerEvents : {
			"/config" : "loadbootconfig",
			"/module/{moduleName}/*" : "loadModule",
			"/api/{moduleName}/*" : "loadModuleApi"
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
		loadModule : function(e,target,data){
			var SampleModule = module(e.params.moduleName);
			if(SampleModule){
				this.add(SampleModule.instance(data));
			}
		},
		loadModuleApi : function(e,target,data){
			var self = this;
			module(e.params.moduleName,function(SampleModule){
				self.view("module.info.html",{
					
				}).done(function(){
					var TestSampleModule =  module(e.params.moduleName+".test");
					if(TestSampleModule){
						self.add("#testmodule",TestSampleModule.instance(data));
					}					
				});
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
	
	
});