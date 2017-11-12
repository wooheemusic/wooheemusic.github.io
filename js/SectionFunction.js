/**
 * querySlector도 지우고 seo도 적용하자
 */

function SectionFunction(name) {

	var that = this;

	var sectionFunctionName = name || "sectionFunction";

	this.getName = function() {
		return sectionFunctionName;
	}

	var sectionColors = {
		"" : "rgba(0, 49, 83, 1)",
		aboutMe : "rgba(0, 49, 83, 1)",
		thisSite : "rgba(0, 49, 83, 1)",
		boards : "rgba(0, 49, 83, 1)",
		services : "rgba(55, 55, 55, 1)",
		/*			aboutMe : "rgba(83,76,0, 1)",
					thisSite : "rgba(55, 55, 55, 1)",
					boards : "rgba(49,83,0, 1)",
					services : "rgba(0, 49, 83, 1)",
		*/"not-found" : "rgba(0, 0, 0, 1)",
	};
	var headerNames = {
		"" : "My Portfolio",
		aboutMe : "About Me",
		thisSite : "The technology specification of this site",
		boards : "Boards",
		services : "Services",
		"not-found" : "Not Found",
	};
	var headerDecriptions = {
		"" : "This site is built to introduce me as a developer. <br>It includes my cover letter and this site's specification.",
		aboutMe : "I really love ... boolean, interfaces, excellence and beauty.",
		thisSite : "built on Spring, Hibernate, SectionFlow(my SPA framework), REST. <br>(well-designed logic architechures, well-normalized relations, compliant with REST... )",
		boards : "All contents are copied and pasted from my evernote. You can see how I study and work.<br><br>An extra feature : Gmail-like asynchronous and background-working multi-file UPLOADER<br>(Please SIGN IN and TRY)",
		services : "not implemented yet.",
		"not-found" : "This application cannot find a page that matches the given URL.",
	};

	var header = document.querySelector("body>header");
	var footer = document.querySelector("body>footer");
	var navTop = document.getElementById("topNavigator");
	var headerH1 = document.querySelector("body>header h1");
	var headerP = document.querySelector("body>header p");

	/*window.addEventListener("scroll", function() {
		if (timeOut === 0) {
			setVisible();
		}
	});*/
	/*window.addEventListener("resize", function() {
		if (timeOut === 0) {
			setVisible();
		}
	});*/

	this.execute = function(sectionName) {
		var color;
		if (color = sectionColors[sectionName]) {
			header.style.backgroundColor = color;
			footer.style.backgroundColor = color;
			navTop.style.backgroundColor = color;
		}
		var name;
		if (name = headerNames[sectionName]) {
			headerH1.innerHTML = name;
		}
		var description;
		if (description = headerDecriptions[sectionName]) {
			headerP.innerHTML = description;
		}
	}
}