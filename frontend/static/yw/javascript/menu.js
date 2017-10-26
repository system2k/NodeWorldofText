var Menu = (function() {
	function Menu(titleEl, menuEl) {
		var _this = this;
		this.titleEl = titleEl;
		this.menuEl = menuEl;
		this._SPEED = 250;
		this.addOption = function(text, action) {
			var s;
			s = $(document.createElement("div"));
			s.text(text);
			s.click(action);
			s.click(_this.hideNow);
			_this.addEntry(s[0]);
		};
		this.addCheckboxOption = function(text, checkedAction, uncheckedAction, checked) {
			var i;
			var s;
			s = $(document.createElement("div"));
			s.text(text);
			i = document.createElement("input");
			i.type = "checkbox";
			i.checked = !!checked;
			s.prepend(i);
			s[0].checked = !!checked;
			s.click(function(e) {
				if (e.target !== i) {
					i.checked = !i.checked;
				}
				if (i.checked) {
					checkedAction();
				} else {
					uncheckedAction();
				}
			});
			_this.addEntry(s[0]);
		};
		this.hideNow = function() {
			_this.menuEl.slideUp(_this._SPEED);
			_this.titleEl.removeClass("hover");
		};
		this.hide = function() {
			$.data(_this.menuEl, "cancelHide", false);
			setTimeout((function() {
				if (!$.data(_this.menuEl, "cancelHide")) {
					_this.hideNow();
				}
			}), 500);
		};
		this.show = function() {
			$.data(_this.menuEl, "cancelHide", true);
			_this.menuEl.slideDown(_this._SPEED);
			_this.titleEl.addClass("hover");
		};
		this.addEntry = function(liContents) {
			var newItem;
			_this.menuEl.find("ul").append("<li></li>");
			newItem = _this.menuEl.find("li:last");
			newItem.append(liContents);
			newItem.hover(function() {
				$(this).addClass("hover");
				$("> a", this).addClass("hover");
			}, function() {
				$(this).removeClass("hover");
				$("> a", this).removeClass("hover");
			});
		};
		this.menuEl.css("top", this.titleEl.offset().top + this.titleEl.outerHeight());
		this.titleEl.hover(this.show, this.hide);
		this.menuEl.hover(this.show, this.hide);
		this.titleEl.show();
	}
	return Menu;
}());