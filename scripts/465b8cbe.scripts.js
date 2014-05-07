"use strict";var authyApp=angular.module("authyApp",["ngResource","ngSanitize","ngCookies","ui.router","ngTagsInput"]);authyApp.config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/home"),a.state("items",{url:"/items",templateUrl:"templates/items.html",controller:"ItemsController"}).state("details",{url:"/items/:id",templateUrl:"templates/item-details.html",controller:"ItemDetailController"}).state("edit",{url:"/items/edit/:id",templateUrl:"templates/item-edit.html",controller:"ItemEditController"}).state("home",{url:"/home",templateUrl:"templates/home.html",controller:"HomeController"}).state("signin",{url:"/signin",templateUrl:"templates/signin.html",controller:"SignInController"}).state("results",{url:"/search?q",templateUrl:"templates/results.html",controller:"ResultsController"})}]).run(["identityService",function(a){a.checkCookie()}]),angular.module("authyApp").factory("transformRequestAsFormPost",function(){function a(a,c){var d=c();return d["Content-type"]="application/x-www-form-urlencoded; charset=utf-8",b(a)}function b(a){if(!angular.isObject(a))return null===a?"":a.toString();var b=[];for(var c in a)if(a.hasOwnProperty(c)){var d=a[c];b.push(encodeURIComponent(c)+"="+encodeURIComponent(null===d?"":d))}var e=b.join("&").replace(/%20/g,"+");return e}return a}),angular.module("authyApp").controller("HomeController",["$scope","$log",function(){}]),angular.module("authyApp").controller("ItemsController",["$scope","identityService","itemService","$log",function(a,b,c,d){d.info("ItemsController"),c.items().then(function(b){a.items=b},function(b){a.error=b})}]),angular.module("authyApp").controller("SearchController",["$scope","$location","$log",function(a,b){a.search=function(a){console.log("got search! q:"+a),b.path("/search").search({q:a})}}]),angular.module("authyApp").controller("ResultsController",["$scope","$stateParams","$log","searchService",function(a,b,c,d){c.info(b.q);var e={q:"*"};b.q&&(e.q=b.q),a.query=e.q,a.openDataBaseUrl="http://openepa.dcdev.opendata.arcgis.com",d.getDatasets(e).then(function(b){a.results=b.data},function(b){a.error=b})}]),angular.module("authyApp").controller("ItemDetailController",["$scope","$stateParams","itemService","$log",function(a,b,c,d){d.info("ItemDetailController..."),c.item(b.id).then(function(b){d.info("got data"),a.item=b},function(b){a.error=b})}]),angular.module("authyApp").controller("ItemEditController",["$scope","$stateParams","$state","itemService","$log",function(a,b,c,d,e){e.info("ItemEditController..."),d.item(b.id).then(function(b){e.info("got data"),a.item=b},function(b){a.error=b}),a.update=function(b){d.updateItem(b).then(function(b){b.success?(a.success=!0,e.info("update succeeded"),c.go("items")):e.error("Update Failed: "+JSON.stringify(b))})}}]),angular.module("authyApp").controller("AuthNavController",["$scope","identityService","$log",function(a,b){a.isLoggedIn=function(){return b.loggedIn},a.signInPopUp=function(){return b.startAGOOAuth()},a.signOut=function(){return b.signOut()}}]),angular.module("authyApp").controller("SignInController",["$scope","$stateParams","$state","identityService","$location","$log",function(a,b,c,d,e){a.startAuth=function(){window.oauthCallback=angular.bind(d,d.finishAGOOAuth);var a="";80!==e.port()&&(a=":"+e.port()),d.setRedirectUri("http://"+e.host()+a+"/post-signin.html"),d.startAGOOAuth()},a.checkAuth=function(a){if(d.loggedIn)c.go("items");else{var b="";80!==e.port()&&(b=":"+e.port()),d.setRedirectUri("http://"+e.host()+b+"/post-signin.html"),d.startAGOOAuth(a)}}}]),angular.module("authyApp").provider("identityService",function(){var a={clientId:"hhtN8jFtnA0mYWSb",redirectUri:"http://127.0.0.1:9000/post-signin.html",baseUrl:"http://www.arcgis.com/sharing/rest"};this.$get=["$q","$http","$state","$cookieStore","$log",function(b,c,d,e,f){return{setRedirectUri:function(b){a.redirectUri=b},loggedIn:!1,getToken:function(){return this.token?this.token:!1},checkCookie:function(){var a=e.get("authy_auth");a&&new Date(a.tokenExpiresAt)>new Date?(console.log("We have a cookie..."),this.oAuthData=a,this.loggedIn=!0):console.log("No cookie...")},startAGOOAuth:function(){this.signOut();var b="https://www.arcgis.com/sharing/oauth2/authorize?client_id="+a.clientId+"&response_type=token&expiration=20160&redirect_uri="+a.redirectUri;f.info("Opening oAuth url: "+b),window.oauthCallback=angular.bind(this,this.finishAGOOAuth),window.open(b,"oauth-window","height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes")},finishAGOOAuth:function(a){f.info("oAuth Data: "+JSON.stringify(a)),this.oAuthData=a,this.oAuthData.tokenExpiresAt=new Date((new Date).getTime()+1e3*a.expires_in),e.put("authy_auth",this.oAuthData),this.loggedIn=!0,window.oauthCallback&&delete window.oauthCallback,d.go("items")},signOut:function(){delete this.profile,delete this.token,this.loggedIn=!1,e.remove("authy_auth"),d.go("home")}}}]}),angular.module("authyApp").factory("itemService",["$http","$q","identityService","transformRequestAsFormPost","$log",function(a,b,c,d,e){return{contentUrl:"http://www.arcgis.com/sharing/rest/content",items:function(){if(c.loggedIn){var d=this.contentUrl+"/users/"+c.oAuthData.username+"?f=json&token="+c.oAuthData.token,f=b.defer();return a({method:"GET",url:d}).success(function(a,b,c){e.info("itemService.items()",a,b,c()),f.resolve(a.items)}).error(function(a,b,c){e.error(a,b,c()),f.reject(b)}),f.promise}console.log("user is not logged in")},item:function(d){var f=b.defer(),g=this.contentUrl+"/items/"+d+"?f=json&token="+c.oAuthData.token;return a({method:"GET",url:g}).success(function(a,b,c){e.info(a,b,c()),f.resolve(a)}).error(function(a,b,c){e.error(a,b,c()),f.reject(b)}),f.promise},updateItem:function(f){var g=b.defer(),h=this.contentUrl+"/users/"+c.oAuthData.username+"/items/"+f.id+"/update?f=json&token="+c.oAuthData.token;delete a.defaults.headers.post["Content-Type"];var i=a({method:"POST",url:h,transformRequest:d,data:f});return i.success(function(a,b,c){e.info(a,b,c()),g.resolve(a)}).error(function(a,b,c){e.error(a,b,c()),g.reject(b)}),g.promise}}}]),angular.module("authyApp").factory("searchService",["$http","$q","$log",function(a,b,c){return{getDatasets:function(d){c.info("searchService.getDatasets params: "+JSON.stringify(d));var e=b.defer();return a({method:"GET",url:"http://openepa.dcdev.opendata.arcgis.com/datasets.json?q="+d.q}).success(function(a,b,d){c.info(a,b,d()),e.resolve(a)}).error(function(a,b,d){c.error(a,b,d()),e.reject(b)}),e.promise},getDataset:function(d){var e=b.defer();return a({method:"GET",url:"http://openepa.dcdev.opendata.arcgis.com/datasets/"+d+".json"}).success(function(a,b,d){c.info(a,b,d()),e.resolve(a)}).error(function(a,b,d){c.error(a,b,d()),e.reject(b)}),e.promise}}}]),function(){function a(){var a={};return{on:function(b,c){return b.split(" ").forEach(function(b){a[b]||(a[b]=[]),a[b].push(c)}),this},trigger:function(b,c){return angular.forEach(a[b],function(a){a.call(null,c)}),this}}}function b(a,b){return console.log("MAKEOBJARRY key:"+b+" Array:"+JSON.stringify(a)),a=a||[],a.length>0&&!angular.isObject(a[0])&&a.forEach(function(c,d){a[d]={},a[d][b]=c}),a}function c(a,b,c){for(var d=null,e=0;e<a.length;e++)if(a[e][c].toLowerCase()===b[c].toLowerCase()){d=a[e];break}return d}function d(a,b){for(var c=null,d=0;d<a.length;d++)if(a[d].toLowerCase()===b.toLowerCase()){c=a[d];break}return c}function e(a,b,c){var d=b.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1");return a.replace(new RegExp(d,"gi"),c)}var f={backspace:8,tab:9,enter:13,escape:27,space:32,up:38,down:40,comma:188},g=angular.module("ngTagsInput",[]);g.directive("tagsInput",["$timeout","$document","tagsInputConfig","$log",function(b,c,e){function g(a,b){var c,e,f,g={};return c=function(b){return b[a.displayProperty]},e=function(b,c){b[a.displayProperty]=c},f=function(b){return b.length>=a.minLength&&b.length<=(a.maxLength||b.length)&&a.allowedTagsPattern.test(b)&&!d(g.items,b)},g.items=[],g.addText=function(a){return g.add(a)},g.add=function(c){return a.replaceSpacesWithDashes&&(c=c.replace(/\s/g,"-")),f(c)?(g.items.push(c),b.trigger("tag-added",{$tag:c})):b.trigger("invalid-tag",{$tag:c}),c},g.remove=function(a){var c=g.items.splice(a,1)[0];return b.trigger("tag-removed",{$tag:c}),c},g.removeLast=function(){var b,c=g.items.length-1;return a.enableEditingLastTag||g.selected?(g.selected=null,b=g.remove(c)):g.selected||(g.selected=g.items[c]),b},g}return{restrict:"E",require:"ngModel",scope:{tags:"=ngModel",onTagAdded:"&",onTagRemoved:"&"},replace:!1,transclude:!0,templateUrl:"ngTagsInput/tags-input.html",controller:["$scope","$attrs","$element",function(b,c,d){e.load("tagsInput",b,c,{placeholder:[String,"Add a tag"],tabindex:[Number],removeTagSymbol:[String,String.fromCharCode(215)],replaceSpacesWithDashes:[Boolean,!0],minLength:[Number,3],maxLength:[Number],addOnEnter:[Boolean,!0],addOnSpace:[Boolean,!1],addOnComma:[Boolean,!0],addOnBlur:[Boolean,!0],allowedTagsPattern:[RegExp,/.+/],enableEditingLastTag:[Boolean,!1],minTags:[Number],maxTags:[Number],displayProperty:[String,"text"],allowLeftoverText:[Boolean,!1],addFromAutocompleteOnly:[Boolean,!1]}),b.events=new a,b.tagList=new g(b.options,b.events),this.registerAutocomplete=function(){var a=d.find("input");return a.on("keydown",function(a){b.events.trigger("input-keydown",a)}),{addTag:function(a){return b.tagList.add(a)},focusInput:function(){a[0].focus()},getTags:function(){return b.tags},getOptions:function(){return b.options},on:function(a,c){return b.events.on(a,c),this}}}}],link:function(a,d,e,g){var h=[f.enter,f.comma,f.space,f.backspace],i=a.tagList,j=a.events,k=a.options,l=d.find("input");j.on("tag-added",a.onTagAdded).on("tag-removed",a.onTagRemoved).on("tag-added",function(){a.newTag.text=""}).on("tag-added tag-removed",function(){g.$setViewValue(a.tags)}).on("invalid-tag",function(){a.newTag.invalid=!0}).on("input-change",function(){i.selected=null,a.newTag.invalid=null}).on("input-focus",function(){g.$setValidity("leftoverText",!0)}).on("input-blur",function(){k.addFromAutocompleteOnly||(k.addOnBlur&&i.addText(a.newTag.text),g.$setValidity("leftoverText",k.allowLeftoverText?!0:!a.newTag.text))}),a.newTag={text:"",invalid:null},a.getDisplayText=function(a){return a[k.displayProperty].trim()},a.track=function(a){return a[k.displayProperty]},a.newTagChange=function(){j.trigger("input-change",a.newTag.text)},a.$watch("tags",function(b){a.tags=b,i.items=a.tags}),a.$watch("tags.length",function(a){g.$setValidity("maxTags",angular.isUndefined(k.maxTags)||a<=k.maxTags),g.$setValidity("minTags",angular.isUndefined(k.minTags)||a>=k.minTags)}),l.on("keydown",function(b){if(!b.isImmediatePropagationStopped||!b.isImmediatePropagationStopped()){var c,d,e=b.keyCode,g=b.shiftKey||b.altKey||b.ctrlKey||b.metaKey,j={};if(!g&&-1!==h.indexOf(e))if(j[f.enter]=k.addOnEnter,j[f.comma]=k.addOnComma,j[f.space]=k.addOnSpace,c=!k.addFromAutocompleteOnly&&j[e],d=!c&&e===f.backspace&&0===a.newTag.text.length,c)i.addText(a.newTag.text),a.$apply(),b.preventDefault();else if(d){var l=i.removeLast();l&&k.enableEditingLastTag&&(a.newTag.text=l[k.displayProperty]),a.$apply(),b.preventDefault()}}}).on("focus",function(){a.hasFocus||(a.hasFocus=!0,j.trigger("input-focus"),a.$apply())}).on("blur",function(){b(function(){var b=c.prop("activeElement"),e=b===l[0],f=d[0].contains(b);(e||!f)&&(a.hasFocus=!1,j.trigger("input-blur"))})}),d.find("div").on("click",function(){l[0].focus()})}}}]),g.directive("autoComplete",["$document","$timeout","$sce","tagsInputConfig",function(a,d,g,h){function i(a,e){var f,g,h,i={};return g=function(a,b){return a.filter(function(a){return!c(b,a,e.tagsInput.displayProperty)})},i.reset=function(){h=null,i.items=[],i.visible=!1,i.index=-1,i.selected=null,i.query=null,d.cancel(f)},i.show=function(){i.selected=null,i.visible=!0},i.load=function(c,j){return c.length<e.minLength?void i.reset():(d.cancel(f),void(f=d(function(){i.query=c;var d=a({$query:c});h=d,d.then(function(a){d===h&&(a=b(a.data||a,e.tagsInput.displayProperty),a=g(a,j),i.items=a.slice(0,e.maxResultsToShow),i.items.length>0?i.show():i.reset())})},e.debounceDelay,!1)))},i.selectNext=function(){i.select(++i.index)},i.selectPrior=function(){i.select(--i.index)},i.select=function(a){0>a?a=i.items.length-1:a>=i.items.length&&(a=0),i.index=a,i.selected=i.items[a]},i.reset(),i}function j(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}return{restrict:"E",require:"^tagsInput",scope:{source:"&"},templateUrl:"ngTagsInput/auto-complete.html",link:function(b,c,d,k){var l,m,n,o,p,q=[f.enter,f.tab,f.escape,f.up,f.down];h.load("autoComplete",b,d,{debounceDelay:[Number,100],minLength:[Number,3],highlightMatchedText:[Boolean,!0],maxResultsToShow:[Number,10]}),n=b.options,m=k.registerAutocomplete(),n.tagsInput=m.getOptions(),l=new i(b.source,n),o=function(a){return a[n.tagsInput.displayProperty]},b.suggestionList=l,b.addSuggestion=function(){var a=!1;return l.selected&&(m.addTag(l.selected),l.reset(),m.focusInput(),a=!0),a},b.highlight=function(a){var b=o(a);return b=j(b),n.highlightMatchedText&&(b=e(b,j(l.query),"<em>$&</em>")),g.trustAsHtml(b)},b.track=function(a){return o(a)},m.on("tag-added invalid-tag",function(){l.reset()}).on("input-change",function(a){a?l.load(a,m.getTags()):l.reset()}).on("input-keydown",function(a){var c,d;if(-1!==q.indexOf(a.keyCode)){var e=!1;a.stopImmediatePropagation=function(){e=!0,a.stopPropagation()},a.isImmediatePropagationStopped=function(){return e},l.visible&&(c=a.keyCode,d=!1,c===f.down?(l.selectNext(),d=!0):c===f.up?(l.selectPrior(),d=!0):c===f.escape?(l.reset(),d=!0):(c===f.enter||c===f.tab)&&(d=b.addSuggestion()),d&&(a.preventDefault(),a.stopImmediatePropagation(),b.$apply()))}}).on("input-blur",function(){l.reset()}),p=function(){l.visible&&(l.reset(),b.$apply())},a.on("click",p),b.$on("$destroy",function(){a.off("click",p)})}}}]),g.directive("tiTranscludeAppend",function(){return function(a,b,c,d,e){e(function(a){b.append(a)})}}),g.directive("tiAutosize",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){var e,f,g=3;e=angular.element('<span class="input"></span>'),e.css("display","none").css("visibility","hidden").css("width","auto").css("white-space","pre"),b.parent().append(e),f=function(a){var d,f=a;return angular.isString(f)&&0===f.length&&(f=c.placeholder),f&&(e.text(f),e.css("display",""),d=e.prop("offsetWidth"),e.css("display","none")),b.css("width",d?d+g+"px":""),a},d.$parsers.unshift(f),d.$formatters.unshift(f),c.$observe("placeholder",function(a){d.$modelValue||f(a)})}}}),g.provider("tagsInputConfig",function(){var a={},b={};this.setDefaults=function(b,c){return a[b]=c,this},this.setActiveInterpolation=function(a,c){return b[a]=c,this},this.$get=["$interpolate",function(c){var d={};return d[String]=function(a){return a},d[Number]=function(a){return parseInt(a,10)},d[Boolean]=function(a){return"true"===a.toLowerCase()},d[RegExp]=function(a){return new RegExp(a)},{load:function(e,f,g,h){f.options={},angular.forEach(h,function(h,i){var j,k,l,m,n;j=h[0],k=h[1],l=d[j],m=function(){var b=a[e]&&a[e][i];return angular.isDefined(b)?b:k},n=function(a){f.options[i]=a?l(a):m()},b[e]&&b[e][i]?g.$observe(i,function(a){n(a)}):n(g[i]&&c(g[i])(f.$parent))})}}}]}),g.run(["$templateCache",function(a){a.put("ngTagsInput/tags-input-back.html",'<div class="host" tabindex="-1" ti-transclude-append=""><div class="tags" ng-class="{focused: hasFocus}"><ul class="tag-list"><li class="tag-item" ng-repeat="tag in tagList.items track by track(tag)" ng-class="{ selected: tag == tagList.selected }"><span>{{getDisplayText(tag)}}</span> <a class="remove-button" ng-click="tagList.remove($index)">{{options.removeTagSymbol}}</a></li></ul><input class="input" placeholder="{{options.placeholder}}" tabindex="{{options.tabindex}}" ng-model="newTag.text" ng-change="newTagChange()" ng-trim="false" ng-class="{\'invalid-tag\': newTag.invalid}" ti-autosize=""></div></div>'),a.put("ngTagsInput/tags-input.html",'<div class="host" tabindex="-1" ti-transclude-append=""><div class="tags" ng-class="{focused: hasFocus}"><ul class="tag-list"><li class="tag-item" ng-repeat="tag in tagList.items " ng-class="{ selected: tag == tagList.selected }"><span>{{tag}}</span> <a class="remove-button" ng-click="tagList.remove($index)">{{options.removeTagSymbol}}</a></li></ul><input class="input" placeholder="{{options.placeholder}}" tabindex="{{options.tabindex}}" ng-model="newTag.text" ng-change="newTagChange()" ng-trim="false" ng-class="{\'invalid-tag\': newTag.invalid}" ti-autosize=""></div></div>'),a.put("ngTagsInput/auto-complete.html",'<div class="autocomplete" ng-show="suggestionList.visible"><ul class="suggestion-list"><li class="suggestion-item" ng-repeat="item in suggestionList.items track by track(item)" ng-class="{selected: item == suggestionList.selected}" ng-click="addSuggestion()" ng-mouseenter="suggestionList.select($index)" ng-bind-html="highlight(item)"></li></ul></div>')}])}();