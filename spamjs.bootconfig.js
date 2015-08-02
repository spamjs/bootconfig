define({
	name : "spamjs.bootconfig",
	extend : "spamjs.view",
	modules : ["jqrouter","jqtags.tab","jsutils.file"]
}).as(function(bootconfig,jqrouter,tab,fileUtil){
	
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
			_importStyle_("jqtags/jq-tab","spamjs/bootconfig");
			module(e.params.moduleName,function(SampleModule){
				self.view("module.info.html",{
					
				}).done(function(){
					var $demoCode = self.$$.find("[tab=demo-code]");
					var TestSampleModule =  module(e.params.moduleName+".test");
					if(TestSampleModule){
						data.id = "testmodule";
						self.add(TestSampleModule.instance(data));
						var dff = [];
						var srcFiles = [TestSampleModule.__file__];
						srcFiles = srcFiles.concat(TestSampleModule.src);
						for(var i in srcFiles){
							(function(file){
								if(file){
									dff.push(fileUtil.get(TestSampleModule.path(file)).done(function(resp){
										$demoCode.append("<h5>File: "+file+"</h5>");
										var $newBlock =jQuery('<pre code></pre>');
										$newBlock.text(resp);
										$demoCode.append($newBlock);//.replace("\n", "<br />","g"));	
									}));
								}
							})(srcFiles[i]);
						}
						jQuery.when.apply(jQuery,dff).done(function(){
							console.log(self.$$.find("pre[code]"));
							self.$$.find("pre[code]").each(function(i,elem){
								hljs.highlightBlock(elem);
							});
						});
						
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