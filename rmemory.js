(() => {
    'use strict';
    const courses = [
        { id: 'htmlContent', name: 'HTML', icon: '</>', color: '#ff9966', tag: 'STRUCTURER', description: 'Du document aux formulaires. Donne du sens à chaque élément.' },
        { id: 'cssContent', name: 'CSS', icon: '#', color: '#75aaff', tag: 'METTRE EN FORME', description: 'Cascade, Flexbox, Grid. Comprends ce qui fait tenir une interface.' },
        { id: 'jsContent', name: 'JavaScript', icon: 'JS', color: '#ffe254', tag: 'FAIRE INTERAGIR', description: 'Fonctions, événements et promesses. Fais vivre tes idées.' },
        { id: 'jsComplexContent', name: 'Front / Back', icon: '{ }', color: '#bc96ff', tag: 'CONNECTER', description: 'React, Express et SQL. Suis les données de la vue à la base.' },
        { id: 'pythonContent', name: 'Python', icon: 'Py', color: '#79e59c', tag: 'EXPLORER', description: 'Des collections aux API. Retrouve les bons réflexes.' },
        { id: 'ahkContent', name: 'AutoHotkey', icon: '⌘', color: '#ff8db9', tag: 'AUTOMATISER', description: 'Raccourcis et scripts v2. Une action claire, un geste de moins.' },
        { id: 'luauContent', name: 'Luau / Roblox', icon: '◇', color: '#62e7ff', tag: 'NOUVEAU', description: 'Crée des mondes. Typage, réseau et architecture Roblox.' },
        { id: 'c++Content', name: 'C++', icon: 'C+', color: '#acbdf1', tag: 'À VENIR', description: 'Une prochaine étape. Le parcours sera construit plus tard.', soon: true },
        { id: 'verseContent', name: 'Verse', icon: 'V.', color: '#c5e96c', tag: 'À VENIR', description: 'Un emplacement réservé pour une prochaine exploration.', soon: true },
        {"id": "goContent", "name": "Go", "icon": "Go", "color": "#53d3ca", "tag": "À VENIR", "description": "Go : types, fonctions et concurrence. Le cours sera ajouté ultérieurement.", "soon": true},
        {"id": "shellContent", "name": "PowerShell & CMD", "icon": "PS", "color": "#8f9fff", "tag": "À VENIR", "description": "Deux interpréteurs de commandes distincts. Le futur cours séparera leurs syntaxes.", "soon": true},
        {"id": "kotlinContent", "name": "Kotlin", "icon": "Kt", "color": "#f7a9df", "tag": "À VENIR", "description": "Kotlin : bases, types et programmation orientée objet. Cours à venir.", "soon": true},
        {"id": "pythonAIContent", "name": "Python : programmer une IA", "icon": "IA", "color": "#ffc571", "tag": "À VENIR", "description": "Un futur parcours consacré à la création de systèmes d’IA avec Python. Aucun service ni clé API n’est utilisé ici.", "soon": true},
        {"id": "asmContent", "name": "Assembleur", "icon": "ASM", "color": "#d6a1fc", "tag": "À VENIR", "description": "Le cours précisera une architecture et un assembleur avant les exemples. Parcours à venir.", "soon": true},
        {"id": "brainfuckContent", "name": "Brainfuck", "icon": "BF", "color": "#f68f84", "tag": "À VENIR", "description": "Un futur détour par un langage ésotérique aux instructions minimales. Pas encore de cours.", "soon": true},
        {"id": "ookContent", "name": "Ook!", "icon": "Ook", "color": "#99e1c4", "tag": "À VENIR", "description": "Un futur parcours ésotérique autour des paires de mots Ook. Pas encore de cours.", "soon": true}
    ];
    const sections = () => [...document.querySelectorAll('div[id$="Content"]')];
    const storage = {
        get(key) { try { return localStorage.getItem(key); } catch { return null; } },
        set(key, value) { try { localStorage.setItem(key, value); } catch { /* Reading works without persistence. */ } }
    };
    const status = message => { document.getElementById('app-status').textContent = message; };
    let searchIndex = [];
    let lastFocus = null;
    let searchTimer;

    function closeMenu() {
        document.body.classList.remove('nav-open');
        document.getElementById('mobile-menu').setAttribute('aria-expanded', 'false');
        syncMenuVisibility();
    }

    function syncMenuVisibility() {
        const mobile = window.matchMedia('(max-width: 850px)').matches;
        document.getElementById('language-nav').inert = mobile && !document.body.classList.contains('nav-open');
    }

    window.showContent = function (id, { focus = true } = {}) {
        const target = document.getElementById(id);
        if (!target || !sections().includes(target)) return;
        for (const section of sections()) {
            const active = section === target;
            section.hidden = !active;
            section.classList.toggle('SHOW', active);
            section.classList.toggle('HIDDEN', !active);
        }
        const home = id === 'StartContent';
        document.querySelector('.skip-link').href = '#' + id;
        document.getElementById('resume-reading').hidden = !storage.get('rmemory:last');
        document.getElementById('menuBtn').hidden = home;
        document.getElementById('menuBtn').classList.toggle('HIDDEN', home);
        for (const button of document.querySelectorAll('[data-section]')) {
            if (button.dataset.section === id) button.setAttribute('aria-current', 'page');
            else button.removeAttribute('aria-current');
        }
        const homeLink = document.querySelector('.nav-home');
        if (home) homeLink.setAttribute('aria-current', 'page');
        else homeLink.removeAttribute('aria-current');
        document.title = home ? 'Rmemory — BIBLIOTHÈQUE de code' : (courses.find(course => course.id === id)?.name ?? 'Rmemory') + ' — Rmemory';
        if (!home) storage.set('rmemory:last', '#' + id);
        closeMenu();
        if (focus) {
            const heading = target.querySelector('h1');
            heading.tabIndex = -1;
            heading.focus({ preventScroll: true });
        }
    };

    let scrollRequest = 0;
    function alignReading(target) {
        const request = ++scrollRequest;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            if (request !== scrollRequest || !target.isConnected) return;
            const heading = document.querySelector('.site-header');
            const offset = (heading ? heading.getBoundingClientRect().bottom : 0) + 16;
            window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - offset, behavior: 'instant' });
        }));
    }
    function closeReading(detail) {
        detail.open = false;
        for (const child of detail.querySelectorAll('details[open]')) child.open = false;
    }
    function openReading(detail) {
        for (const sibling of detail.parentElement.children) {
            if (sibling !== detail && sibling.tagName === 'DETAILS') closeReading(sibling);
        }
        detail.open = true;
    }

    function reveal(hash, { scroll = true } = {}) {
        let id;
        try { id = decodeURIComponent(hash.replace(/^#/, '')); } catch { return; }
        if (!id) id = 'StartContent';
        const target = document.getElementById(id);
        if (!target) { window.showContent('StartContent', { focus: false }); return; }
        const section = target.matches('div[id$="Content"]') ? target : target.closest('div[id$="Content"]');
        if (!section) return;
        window.showContent(section.id, { focus: false });
        let node = target;
        while (node && node !== section) {
            if (node.tagName === 'DETAILS') openReading(node);
            node = node.parentElement;
        }
        const focusTarget = target.tagName === 'DETAILS' ? target.querySelector('summary') : target.querySelector('h1');
        if (focusTarget) {
            focusTarget.tabIndex = -1;
            focusTarget.focus({ preventScroll: true });
        }
        if (section.id !== 'StartContent') storage.set('rmemory:last', '#' + id);
        if (scroll) {
            if (target === section) window.scrollTo({ top: 0, behavior: 'instant' });
            else alignReading(target);
        }
    }

    function navigate(hash) {
        if (location.hash === hash) reveal(hash);
        else location.hash = hash;
    }

    function normalizeCode(block) {
        const lines = block.textContent.replace(/\r\n/g, '\n').replace(/^\s*\n/, '').replace(/\n\s*$/, '').split('\n');
        const margins = lines.filter(line => line.trim()).map(line => line.match(/^ */)[0].length);
        const margin = margins.length ? Math.min(...margins) : 0;
        block.textContent = lines.map(line => line.slice(margin)).join('\n');
    }

    function buildCards() {
        const grid = document.getElementById('course-grid');
        let chapterTotal = 0;
        for (const course of courses) {
            const section = document.getElementById(course.id);
            section.style.setProperty('--course', course.color);
            const navigationButton = document.querySelector('[data-section="' + course.id + '"]');
            navigationButton?.style.setProperty('--course', course.color);
            const chapters = section.querySelectorAll(':scope > details[id]').length;
            const episodes = section.querySelectorAll('.guided-step').length;
            chapterTotal += chapters;
            const card = document.createElement('a');
            card.className = 'course-card';
            card.href = '#' + course.id;
            card.style.setProperty('--course', course.color);
            if (course.soon) card.dataset.soon = '';
            const icon = document.createElement('span');
            icon.className = 'course-icon';
            icon.textContent = course.icon;
            icon.setAttribute('aria-hidden', 'true');
            const tag = document.createElement('span');
            tag.className = 'course-tag';
            tag.textContent = course.tag;
            const title = document.createElement('h3');
            title.textContent = course.name;
            const description = document.createElement('p');
            description.textContent = course.description;
            const footer = document.createElement('div');
            footer.className = 'course-card-footer';
            const count = document.createElement('span');
            count.textContent = course.soon ? 'Parcours à venir' : chapters + ' chapitres · ' + episodes + ' épisodes';
            const arrow = document.createElement('span');
            arrow.textContent = '↗';
            arrow.setAttribute('aria-hidden', 'true');
            footer.append(count, arrow);
            card.append(icon, tag, title, description, footer);
            grid.append(card);
        }
        document.getElementById('chapter-count').textContent = chapterTotal;
        document.getElementById('course-count').textContent = courses.filter(course => !course.soon).length;
    }

    function prepareLessons() {
        for (const course of courses) {
            const section = document.getElementById(course.id);
            if (course.soon) continue;
            const kicker = document.createElement('p');
            kicker.className = 'reader-kicker';
            kicker.textContent = 'BIBLIOTHÈQUE / ' + course.name;
            section.prepend(kicker);
            for (const [index, chapter] of [...section.querySelectorAll(':scope > details')].entries()) {
                if (!chapter.id) chapter.id = course.id.replace('Content', '') + '-references-' + index;
                for (const [episodeIndex, episode] of [...chapter.querySelectorAll('details')].entries()) {
                    if (!episode.id) episode.id = chapter.id + '-episode-' + (episodeIndex + 1);
                }
            }
            for (const detail of section.querySelectorAll('details:not(.lesson-reference):not(.demo-fixture)')) {
                const summary = detail.querySelector(':scope > summary');
                if (!summary) continue;
                const title = summary.textContent.trim();
                const chapter = detail.parentElement.closest('details');
                const paragraph = detail.querySelector(':scope > p:not(.py-source):not(.lesson-source)');
                searchIndex.push({
                    id: detail.id,
                    title,
                    course: course.name,
                    context: chapter?.querySelector(':scope > summary')?.textContent.trim() ?? 'Chapitre',
                    text: normalizeSearch(title + ' ' + course.name + ' ' + (paragraph?.textContent ?? '') + ' ' + (detail.querySelector('code')?.textContent ?? ''))
                });
            }
        }
        document.querySelectorAll('.lesson-code code, .py-code code, .lesson-output, .py-output, .demo-source, .demo-markup').forEach(normalizeCode);
        document.querySelectorAll('.console').forEach((box, index) => {
            const code = box.querySelector('code');
            if (!code) return;
            box.id ||= 'code-block-' + index;
            const toolbar = document.createElement('div');
            toolbar.className = 'code-toolbar';
            const language = document.createElement('span');
            language.className = 'code-language';
            language.textContent = code.dataset.language ?? 'code';
            const copy = document.createElement('button');
            copy.type = 'button';
            copy.className = 'copy-code';
            copy.textContent = 'Copier';
            copy.setAttribute('aria-label', 'Copier cet exemple ' + language.textContent);
            copy.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(code.textContent);
                    copy.textContent = 'Copié ✓';
                    status('Exemple copié.');
                } catch {
                    copy.textContent = 'Sélectionner le code';
                    const range = document.createRange();
                    range.selectNodeContents(code);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    status('Copie indisponible. Code sélectionné pour copie manuelle.');
                }
                setTimeout(() => { copy.textContent = 'Copier'; }, 2000);
            });
            toolbar.append(language, copy);
            box.prepend(toolbar);
        });
    }

    function normalizeSearch(value) {
        return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    function prepareAccordions() {
        for (const detail of document.querySelectorAll('div[id$="Content"] details')) {
            const summary = detail.querySelector(':scope > summary');
            summary.addEventListener('click', event => {
                if (event.defaultPrevented || event.target.closest('a, button, input')) return;
                event.preventDefault();
                if (detail.open) {
                    ++scrollRequest;
                    closeReading(detail);
                } else {
                    openReading(detail);
                    alignReading(detail);
                }
            });
            detail.addEventListener('toggle', () => {
                if (detail.open) openReading(detail);
            });
        }
    }

    function preparePreviews() {
        function load(box) {
            if (box.dataset.ready) return;
            box.dataset.ready = 'true';
            const markup = box.querySelector('.demo-source').textContent.trim();
            const css = box.dataset.previewKind === 'css'
                ? box.closest('.guided-step').querySelector('.lesson-code code').textContent : '';
            const frame = document.createElement('iframe');
            frame.className = 'example-frame';
            frame.title = 'Aperçu : ' + box.closest('.guided-step').querySelector('summary').textContent;
            frame.setAttribute('sandbox', '');
            frame.referrerPolicy = 'no-referrer';
            const head = `<meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:"><style>${css}</style>`;
            frame.srcdoc = /<html[\s>]/i.test(markup)
                ? markup.replace(/<head>/i, '<head>' + head)
                : '<!doctype html><html lang="fr"><head>' + head + '</head><body>' + markup + '</body></html>';
            box.append(frame);
        }
        for (const box of document.querySelectorAll('.lesson-preview')) {
            const episode = box.closest('details.guided-step');
            episode.addEventListener('toggle', () => { if (episode.open) load(box); });
            if (episode.open) load(box);
        }
    }

    function renderSearch() {
        const input = document.getElementById('global-search');
        const query = normalizeSearch(input.value.trim());
        const tokens = query.split(/\s+/).filter(Boolean);
        const list = document.getElementById('search-results');
        list.replaceChildren();
        const found = tokens.length ? searchIndex.filter(item => tokens.every(token => item.text.includes(token))) : [];
        const matches = found.slice(0, 24);
        document.getElementById('search-status').textContent = !tokens.length ? 'Cherche dans les chapitres et les épisodes.' : found.length ? found.length + ' résultat' + (found.length > 1 ? 's' : '') + (found.length > 24 ? ' · 24 premiers affichés' : '') : 'Aucune notion trouvée. Essaie un autre mot.';
        for (const item of matches) {
            const row = document.createElement('li');
            const link = document.createElement('a');
            link.className = 'search-result';
            link.href = '#' + item.id;
            const context = document.createElement('small');
            context.textContent = item.course + ' / ' + item.context;
            const title = document.createElement('span');
            title.textContent = item.title;
            link.append(context, title);
            link.addEventListener('click', event => {
                event.preventDefault();
                document.getElementById('search-dialog').close();
                navigate(link.hash);
            });
            row.append(link);
            list.append(row);
        }
    }

    function openSearch() {
        lastFocus = document.activeElement;
        const dialog = document.getElementById('search-dialog');
        dialog.showModal();
        document.getElementById('global-search').focus();
        renderSearch();
    }

    function init() {
        buildCards();
        prepareLessons();
        prepareAccordions();
        preparePreviews();
        document.querySelectorAll('[data-section]').forEach(button => button.addEventListener('click', () => navigate('#' + button.dataset.section)));
        document.getElementById('menuBtn').addEventListener('click', () => navigate('#StartContent'));
        document.getElementById('mobile-menu').addEventListener('click', () => {
            const open = document.body.classList.toggle('nav-open');
            document.getElementById('mobile-menu').setAttribute('aria-expanded', String(open));
            syncMenuVisibility();
        });
        document.addEventListener('click', event => {
            if (document.body.classList.contains('nav-open') && !event.target.closest('#language-nav, #mobile-menu')) closeMenu();
            const anchor = event.target.closest('a[href^="#"]');
            if (!anchor || anchor.closest('#search-results')) return;
            if (!document.getElementById(decodeURIComponent(anchor.hash.slice(1)))) return;
            event.preventDefault();
            navigate(anchor.hash);
        });
        const searchDialog = document.getElementById('search-dialog');
        document.getElementById('search-open').addEventListener('click', openSearch);
        document.getElementById('search-close').addEventListener('click', () => searchDialog.close());
        searchDialog.addEventListener('close', () => {
            if (lastFocus?.isConnected && !lastFocus.closest('[hidden]')) lastFocus.focus();
        });
        document.getElementById('global-search').addEventListener('input', () => {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(renderSearch, 100);
        });
        document.addEventListener('keydown', event => {
            const editing = event.target.closest('input, textarea, select, [contenteditable="true"]');
            if (event.key === '/' && !editing && !searchDialog.open && !event.ctrlKey && !event.metaKey && !event.altKey) {
                event.preventDefault();
                openSearch();
            }
            if (event.key === 'Escape') closeMenu();
        });
        const resume = document.getElementById('resume-reading');
        resume.hidden = !storage.get('rmemory:last');
        resume.addEventListener('click', () => {
            const last = storage.get('rmemory:last');
            if (last) navigate(last);
        });
        window.matchMedia('(max-width: 850px)').addEventListener('change', closeMenu);
        syncMenuVisibility();
        const top = document.getElementById('back-to-top');
        const updateTop = () => { top.hidden = window.scrollY < 500; };
        window.addEventListener('scroll', updateTop, { passive: true });
        top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
        window.addEventListener('hashchange', () => reveal(location.hash));
        reveal(location.hash, { scroll: Boolean(location.hash) });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
    else init();
})();

