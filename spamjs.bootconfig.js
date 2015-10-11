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
      "/modules" : "loadModuleList",
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
    loadModuleList : function(){
      var ModuleS = [];
      var bundles = bootloader.config().resource.bundles;
      for(var pck in bundles){
        var js = bundles[pck].js;
        for(var file in js){
          if(js[file].indexOf(".test.js")>0){
            var modPath = js[file].replace(".test.js","").split("/");
            ModuleS.push({ name : modPath[modPath.length-1], packageInfo : bundles[pck].packageInfo});
          }
        }
      }
      this.$$.loadTemplate(
        this.path("app.html"), { modules : ModuleS}
      );
    },
		loadModule : function(e,target,data){
			var SampleModule = module(e.params.moduleName);
			if(SampleModule){
				this.add(SampleModule.instance(data));
			}
		},
		loadModuleApi : function(e,target,data){
			var self = this;
			_importStyle_("jqtags/jq-tab","jqtags/jq-tab/css","spamjs/bootconfig","spamjs/bootconfig/css");
      console.error(e,target,data)
			module(e.params.moduleName,function(SampleModule){
				self.view("module.info.html",{
					
				}).done(function(){
					var $demoCode = self.$$.find("[tab=demo-code]");
					module(e.params.moduleName+".test", function(TestSampleModule){
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
              self.$$.find("pre[code]").each(function(i,elem){
                hljs.highlightBlock(elem);
              });
            });
          });
					module("showdown", function(showdown){
						var converter = new showdown.Converter();
						fileUtil.get(SampleModule.path("README.md")).done(function(resp){
							jQuery("[tab=info]").html(converter.makeHtml(resp));
							self.$$.find("pre code").each(function(i,elem){
								hljs.highlightBlock(elem);
							});
						});
					});
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