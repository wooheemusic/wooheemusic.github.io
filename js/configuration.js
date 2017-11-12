/**
 * 
 */
var loggingLevel = "trace";

(function() {
	
	var myApp = new SinglePageApplicationInitializer();
	if (location.origin === "https://wooheemusic.github.io"){
		myApp.setCrossOrigin("http://220.85.205.251:8000"); // denied with Mixed Content message.
	}

	var sectionFlow = new SectionFlow("sectionFlow");
	sectionFlow.appendPseudoSectionTree("boards.spring", "boards.hibernate", "boards.java", "boards.sectionflow", "boards.guest");
	myApp.setWebFlowManager(sectionFlow);

	var spaLinkManager = new SpaLinkManager("spaLinkManager");
	spaLinkManager.setSeoExclusion("/rest/articles", "/rest/articleFiles"); // if these uris are used for <a href=""></a>, they will not be regarded as popstate event publishers.
	myApp.setSpaLinkManager(spaLinkManager);

	var accountManager = new AccountManager("accountManager");
	accountManager.setAccountConstructor(AccountSummary);
	accountManager.setAccoutUri("/rest/session");
	accountManager.setCheckInterval(5);
	myApp.setAccountManager(accountManager);
	myApp.addBean(new ClassBasedAccountEventListerner("account"));

	
	var dialogLogIn = new Dialog("dialog-login");
	myApp.addBean(dialogLogIn);
	var logInForm = new BasicForm("log-in-form", "account", "PUT", "/rest/session/{account.email}", "account.password", false);
	myApp.addBean(logInForm);
	dialogLogIn.bind(logInForm);
	logInForm.setCallBackFunction(accountCallBack);

	var dialogSignin = new Dialog("dialog-signin");
	myApp.addBean(dialogSignin);
	var signInForm = new BasicForm("sign-in-form", "account", "PUT", "/rest/accounts/{account.email}", "account", false);
	myApp.addBean(signInForm);
	dialogSignin.bind(signInForm);
	signInForm.setCallBackFunction(accountCallBack);

	function accountCallBack() {
		if (this.readyState === 4) {
			if (isLogEnabled) {
				console.log("account callback received the response", this);
			}
			switch (this.status) {
			case 204:
				this.bean.cancel();
				break;
			case 200:
			case 201:
				try {
					this.bean.setAccount(JSON.parse(this.response));
				} catch (e) {
					console.log(e);
					this.bean.setAccount(null);
				}
				this.bean.cancel();
				break;
			}
			if (this.status >= 400) {
				if (this.status === 401) {
					this.bean.publishEvent("unauthorized");
				}
				WhUtils.showXhttpMessage(this);
				this.bean.retry();
			}
		}
	}

	myApp.addBean(new Dialog("dialog-account"));
	var ajaxDelete = new AjaxDelete("ajax-delete");
	ajaxDelete.appendReadyStateChangeFunction("logOut", function (){
		if(this.readyState === 4 && this.status === 204){
			this.bean.publishEvent("log-out");
		}
	});
	myApp.addBean(ajaxDelete);

	var dialogEditor = new Dialog("dialog-editor")
	dialogEditor.setShadowTrigger(false);
	myApp.addBean(dialogEditor);
	var editor = new PreuploadBoardEditor("editor", "article");
	editor.setContentSize(1, 50000);
	editor.setArticleUriMapping("/rest/articles/{article.category}/{article.articleId}");
	editor.setPreuploadUriMapping("/rest/articleFiles/{article.articleFiles.i.articleFileId}");
	editor.setUploadUriMapping("/rest/articles/{article.category}/{article.articleId}/articleFiles/{article.articleFiles.i.articleFileId}")
	editor.setLocationMapping("/boards/{article.category}/{article.articleId}"); // for redirect on succeeded 201
	myApp.addBean(editor);
	dialogEditor.bind(editor);

	var board = new Board("board", "article", "articles");
	board.setArticleUriMapping("/rest/articles/{location.pathname.1}/{location.pathname.2}?pageNum={location.search.page}&pageSize={location.search.size}");
	board.setSearchPageIdentifier("page");
	board.setCountMapping("/rest/articles/{location.pathname.1}/count");
	board.setLocationMapping("/boards/{location.pathname.1}?page={location.search.page}&size={location.search.size}");
	board.setAccountPropertySequence("article.account");
	board.setEditor(editor);
	myApp.addBean(board);


	myApp.addBean(new Renderer("renderer"));
	myApp.addBean(new ImageManager("imageopen", 24, 300));
	
	var navDrawer = new Dialog("nav-drawer", 16);
	myApp.addBean(navDrawer);
	var iconMenu = new MenuIcon("icon-menu", "orange", "orange", 400);
	myApp.addBean(iconMenu);
	navDrawer.bind(iconMenu);

	myApp.addBean(new Scroller("scroller", 80, "none", 500, 700));
	myApp.addBean(new Rippler("ripple", "orange", 500));
	myApp.addBean(new TopNavigator("topNavigator"));
	//myApp.addBean(new TopNavigator("icon-menu"));
	myApp.addBean(new AjaxGet("ajax-get"));
	
	var sectionFunction = new SectionFunction();
	myApp.addBean(sectionFunction, "sectionFunction");
	sectionFlow.appendFlowFunction(sectionFunction.execute.bind(sectionFunction));
	var bottomFooter = new BottomFooter("bottomFooter");
	myApp.addBean(bottomFooter);
	sectionFlow.appendFlowFunction(bottomFooter.execute.bind(bottomFooter));

	if (isLogEnabled){
		console.log("The configuration has been completed...");
	}

})();
