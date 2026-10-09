(function () {
	// simple show/hide helper for the memory page
	// usage: showContent('htmlContent')
	function getAllContentSections() {
		// select sections we use (those with id ending with "Content")
		return Array.from(document.querySelectorAll('div[id$="Content"]'));
	}

	function hideAll() {
		getAllContentSections().forEach(el => {
			el.classList.remove('SHOW');
			el.classList.add('HIDDEN');
			el.setAttribute('hidden', '');
		});
	}

	// expose a global function so inline onclick attributes call it
	window.showContent = function (id) {
		const target = document.getElementById(id);
		if (!target) return;
		hideAll();
		target.classList.remove('HIDDEN');
		target.classList.add('SHOW');
		target.removeAttribute('hidden');

		// show/hide the floating menu button depending on the target
		const menuBtn = document.getElementById('menuBtn');
		if (menuBtn) {
			if (id === 'StartContent') {
				menuBtn.classList.add('HIDDEN');
				menuBtn.classList.remove('SHOW');
				menuBtn.setAttribute('hidden', '');
			} else {
				menuBtn.classList.remove('HIDDEN');
				menuBtn.classList.add('SHOW');
				menuBtn.removeAttribute('hidden');
			}
		}

		// accessibility: focus the heading if present
		const heading = target.querySelector('h1, h2, h3, h4');
		if (heading) {
			heading.tabIndex = -1; // make focusable
			heading.focus();
		}
	};

	// initialize on DOM ready: show the StartContent by default
	document.addEventListener('DOMContentLoaded', function () {
		hideAll();
		const start = document.getElementById('StartContent');
		if (start) {
			start.classList.remove('HIDDEN');
			start.classList.add('SHOW');
			start.removeAttribute('hidden');
		}

		// ensure floating menu is hidden on the start screen
		const menuBtnInit = document.getElementById('menuBtn');
		if (menuBtnInit) {
			menuBtnInit.classList.add('HIDDEN');
			menuBtnInit.setAttribute('hidden', '');
		}

			// normalize console blocks and convert old marker text to styled spans
			function setupConsoleIds() {
                const consoles = Array.from(document.querySelectorAll('div.console, div[id="console"]'));
                consoles.forEach((c, i) => {
                    if (!c) return;
                    c.classList.add('console');
                    if (!c.id || c.id === 'console') {
                        c.id = 'console-' + i;
                    }
                    const codes = Array.from(c.querySelectorAll('code'));
                    codes.forEach(code => {
                        code.innerHTML = code.innerHTML.replace(/&lt;--\s*console\s*--&gt;/gi, '<span class="console-marker">&lt;-- console --&gt;</span>');
                    });
                });
            }

			// add a simple show/hide button per labeled div (under the h2)
			function setupPerDivToggleButtons() {
				const selectors = ['div.HTML', 'div.CSS', 'div.JS', 'div.JavaScript', 'div.Python'];
				const containers = Array.from(document.querySelectorAll(selectors.join(',')));
				containers.forEach(container => {
					if (!container) return;
					const h2 = container.querySelector('h2');
					if (!h2) return;
					// avoid adding duplicate buttons
					if (container.querySelector('.local-toggle-btn')) return;

					const btn = document.createElement('button');
					btn.type = 'button';
					btn.className = 'local-toggle-btn';
					// start collapsed: show the 'Afficher le contenu' button by default
					container.classList.add('local-collapsed');
					btn.textContent = 'Afficher le contenu';
					btn.setAttribute('aria-expanded', 'false');
					h2.insertAdjacentElement('afterend', btn);

					btn.addEventListener('click', function () {
						const collapsed = container.classList.toggle('local-collapsed');
						if (collapsed) {
							btn.textContent = 'Afficher le contenu';
							btn.setAttribute('aria-expanded', 'false');
						} else {
							btn.textContent = 'Masquer le contenu';
							btn.setAttribute('aria-expanded', 'true');
						}
					});
				});
			}

		// per-section collapse buttons
		function setupSectionCollapseButtons() {
			getAllContentSections().forEach(section => {
				if (!section || section.id === 'StartContent') return;
				const heading = section.querySelector('h1, h2, h3, h4');
				const btn = document.createElement('button');
				btn.type = 'button';
				btn.className = 'section-collapse-btn';
				btn.textContent = section.classList.contains('section-collapsed') ? 'Afficher section' : 'Masquer section';
				if (heading) {
					heading.style.position = 'relative';
					heading.appendChild(btn);
				} else {
					section.insertBefore(btn, section.firstChild);
				}

				btn.addEventListener('click', function () {
					const collapsed = section.classList.toggle('section-collapsed');
					if (collapsed) {
						btn.textContent = 'Afficher section';
					} else {
						btn.textContent = 'Masquer section';
					}
				});
			});
		}

		// global toggle for all sections
		function setupGlobalToggleAllButton() {
			const toggleAll = document.getElementById('toggleAllBtn');
			if (!toggleAll) return;
			toggleAll.addEventListener('click', function () {
				const sections = getAllContentSections().filter(s => s.id !== 'StartContent');
				const anyNotCollapsed = sections.some(s => !s.classList.contains('section-collapsed'));
				sections.forEach(s => {
					const collapseBtn = s.querySelector('.section-collapse-btn');
					if (anyNotCollapsed) {
						s.classList.add('section-collapsed');
						if (collapseBtn) collapseBtn.textContent = 'Afficher section';
					} else {
						s.classList.remove('section-collapsed');
						if (collapseBtn) collapseBtn.textContent = 'Masquer section';
					}
				});
				this.textContent = anyNotCollapsed ? 'Afficher tous' : 'Masquer tous';
			});
		}

		setupSectionCollapseButtons();
		setupConsoleIds();
		setupPerDivToggleButtons();
		setupGlobalToggleAllButton();
	});
})();

