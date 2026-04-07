(function () {
  function isRealHref(value) {
    if (!value) return false;
    const v = value.trim();
    if (!v) return false;
    if (v === '#') return false;
    if (v.toLowerCase().startsWith('javascript:')) return false;
    return true;
  }

  function markElement(el, nav, marker) {
    if (!el || el.classList.contains('interactive-marker')) return;
    el.classList.add('interactive-marker');
    el.dataset.nav = nav;
    el.dataset.marker = marker;
  }

  function markInteractive() {
    document.querySelectorAll('a[href]').forEach((el) => {
      const href = el.getAttribute('href');
      if (!isRealHref(href)) return;

      let nav = 'secondary';
      let marker = 'Клик';

      if (el.classList.contains('btn-red')) {
        nav = 'primary';
        marker = 'Действие';
      } else if (el.classList.contains('back-link')) {
        nav = 'back';
        marker = 'Назад';
      } else if (el.classList.contains('link-action')) {
        nav = 'detail';
        marker = 'Детали';
      } else if (el.closest('.crumbs')) {
        nav = 'secondary';
        marker = 'Навигация';
      } else if (el.classList.contains('nav-item')) {
        nav = 'secondary';
        marker = 'Навигация';
      }

      markElement(el, nav, marker);
    });

    document.querySelectorAll('[data-choice]').forEach((el) => {
      markElement(el, 'secondary', 'Клик');
    });

    document.querySelectorAll('[data-g-category]').forEach((el) => {
      markElement(el, 'secondary', 'Клик');
    });

    document.querySelectorAll('[data-hint-close]').forEach((el) => {
      markElement(el, 'secondary', 'Клик');
    });

    document.querySelectorAll('[data-toggle-item]').forEach((el) => {
      markElement(el, 'secondary', 'Клик');
    });

    document.querySelectorAll('.pill[data-href]').forEach((el) => {
      markElement(el, 'secondary', 'Клик');
    });

    document.querySelectorAll('.click-row[data-href]').forEach((el) => {
      markElement(el, 'detail', 'Детали');
    });

    document.querySelectorAll('.click-card[data-href]').forEach((el) => {
      markElement(el, 'detail', 'Переход');
    });
  }

  function setupRowLinks() {
    document.querySelectorAll('.click-row[data-href]').forEach((row) => {
      row.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        const href = row.getAttribute('data-href');
        if (isRealHref(href)) window.location.href = href;
      });
    });
  }

  function setupCardLinks() {
    document.querySelectorAll('.click-card[data-href]').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        const href = card.getAttribute('data-href');
        if (isRealHref(href)) window.location.href = href;
      });
    });
  }

  function setupPillLinks() {
    document.querySelectorAll('.pill[data-href]').forEach((pill) => {
      pill.addEventListener('click', () => {
        const href = pill.getAttribute('data-href');
        if (isRealHref(href)) window.location.href = href;
      });
    });
  }

  function setupToggleGroups() {
    const groups = document.querySelectorAll('[data-toggle-group]');
    groups.forEach((group) => {
      group.addEventListener('click', (e) => {
        const target = e.target.closest('[data-toggle-item]');
        if (!target) return;
        group.querySelectorAll('[data-toggle-item]').forEach((el) => {
          el.classList.remove('active');
          el.classList.remove('selected');
        });
        target.classList.add('active');
        target.classList.add('selected');
      });
    });
  }

  function setupDemoHints() {
    document.querySelectorAll('[data-hint-close]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const hint = e.target.closest('.demo-hint');
        if (!hint) return;
        hint.classList.add('is-hidden');
      });
    });
  }

  function setupWizard() {
    const wizard = document.querySelector('[data-wizard]');
    if (!wizard) return;

    const state = {
      purpose: 'Для госзакупок',
      line: 'Да',
      mode: 'Самостоятельно онлайн'
    };

    const routeText = document.querySelector('[data-route-text]');
    const routeHint = document.querySelector('[data-route-hint]');
    const routeLink = document.querySelector('[data-route-link]');
    const storageKey = 'guaranteeWizardPurpose';

    function persistPurpose() {
      try {
        window.localStorage.setItem(storageKey, state.purpose);
      } catch (_) {
        // ignore storage errors in static prototype
      }
    }

    function computeRoute() {
      const { purpose, line, mode } = state;

      if (mode === 'Нужна помощь менеджера') {
        return {
          text: 'Рекомендуемый маршрут: assisted-сценарий с менеджером',
          hint: 'Следующий шаг: заявка на консультацию с менеджером.',
          href: '04d-assisted.html'
        };
      }

      if (purpose === 'Для госзакупок' && line !== 'Да') {
        return {
          text: 'Рекомендуемый маршрут: упрощённая гарантия',
          hint: 'Быстрый онлайн-сценарий для типовых госзакупок.',
          href: '04a-uproschennaya.html'
        };
      }

      if (line === 'Да') {
        return {
          text: 'Рекомендуемый маршрут: стандартная гарантия в рамках линии',
          hint: 'Создание заявления в привычной форме с выбранной линией.',
          href: '04b-liniya-form.html'
        };
      }

      return {
        text: 'Рекомендуемый маршрут: стандартная единоразовая гарантия',
        hint: 'Разовый сценарий без действующей гарантийной линии.',
        href: '04c-edinorazovaya.html'
      };
    }

    function renderRoute() {
      const route = computeRoute();
      if (routeText) routeText.textContent = route.text;
      if (routeHint) routeHint.textContent = route.hint;
      if (routeLink) routeLink.setAttribute('href', route.href);
      persistPurpose();
    }

    wizard.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-choice]');
      if (!btn) return;

      const key = btn.getAttribute('data-key');
      const value = btn.getAttribute('data-choice');
      if (!key || !value) return;

      state[key] = value;
      const scope = btn.closest('[data-choice-scope]');
      if (scope) {
        scope.querySelectorAll('[data-choice]').forEach((el) => el.classList.remove('selected'));
      }
      btn.classList.add('selected');
      renderRoute();
    });

    wizard.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      persistPurpose();
    });

    renderRoute();
  }

  function setupGuaranteeClassification() {
    const scope = document.querySelector('[data-guarantee-classification]');
    if (!scope) return;

    const categoryButtons = Array.from(scope.querySelectorAll('[data-g-category]'));
    const viewSelect = scope.querySelector('[data-g-view]');
    const hint = scope.querySelector('[data-g-prefill]');
    const storageKey = 'guaranteeWizardPurpose';

    if (!categoryButtons.length || !viewSelect) return;

    const categoryToViews = {
      'Госзакупки 44-ФЗ': [
        'Тендерная гарантия',
        'Гарантия исполнения контракта',
        'Гарантия возврата аванса',
        'Гарантия исполнения гарантийных обязательств'
      ],
      'Госзакупки 223-ФЗ': [
        'Тендерная гарантия',
        'Гарантия исполнения контракта',
        'Гарантия возврата аванса',
        'Гарантия исполнения гарантийных обязательств'
      ],
      'Налоговая': [
        'Гарантия возмещения НДС/акциза',
        'Гарантия освобождения от уплаты акциза при экспорте',
        'Гарантия освобождения от уплаты авансовых платежей акциза',
        'Гарантия уплаты экологического сбора'
      ],
      'Таможенная': [
        'Гарантия в пользу таможенных органов'
      ],
      'Коммерческая': [
        'Арендная гарантия',
        'Гарантия исполнения контракта',
        'Гарантия возврата аванса',
        'Гарантия обеспечения платежей',
        'Гарантия исполнения гарантийных обязательств'
      ],
      'Иное': [
        'Иное'
      ]
    };

    const purposeToPrefill = {
      'Для госзакупок': { category: 'Госзакупки 44-ФЗ' },
      'Для исполнения контракта': { category: 'Коммерческая', view: 'Гарантия исполнения контракта' },
      'Для возврата аванса': { category: 'Коммерческая', view: 'Гарантия возврата аванса' },
      'Для аренды': { category: 'Коммерческая', view: 'Арендная гарантия' },
      'Для таможенных целей': { category: 'Таможенная', view: 'Гарантия в пользу таможенных органов' },
      'Для налоговых целей': { category: 'Налоговая' },
      'Для обеспечения платежей': { category: 'Коммерческая', view: 'Гарантия обеспечения платежей' },
      'Другое': { category: 'Иное', view: 'Иное' }
    };

    function setActiveCategory(category) {
      categoryButtons.forEach((btn) => {
        const isActive = btn.getAttribute('data-g-category') === category;
        btn.classList.toggle('selected', isActive);
      });
    }

    function renderViews(category, preferredView) {
      const views = categoryToViews[category] || ['Иное'];
      const current = preferredView || viewSelect.value;
      viewSelect.innerHTML = '';
      views.forEach((view) => {
        const option = document.createElement('option');
        option.value = view;
        option.textContent = view;
        viewSelect.appendChild(option);
      });
      if (current && views.includes(current)) {
        viewSelect.value = current;
      }
    }

    function applyCategory(category, preferredView) {
      setActiveCategory(category);
      renderViews(category, preferredView);
    }

    categoryButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-g-category');
        applyCategory(category);
        if (hint) hint.textContent = 'Категория и вид гарантии выбраны вручную.';
      });
    });

    let selectedPurpose = '';
    try {
      selectedPurpose = window.localStorage.getItem(storageKey) || '';
    } catch (_) {
      selectedPurpose = '';
    }

    if (selectedPurpose && purposeToPrefill[selectedPurpose]) {
      const prefill = purposeToPrefill[selectedPurpose];
      applyCategory(prefill.category, prefill.view);
      if (hint) hint.textContent = `Предзаполнено по шагу 1 мастера: «${selectedPurpose}».`;
      return;
    }

    const initiallySelected = categoryButtons.find((btn) => btn.classList.contains('selected'));
    const initialCategory = initiallySelected ? initiallySelected.getAttribute('data-g-category') : 'Госзакупки 44-ФЗ';
    applyCategory(initialCategory);
  }

  setupRowLinks();
  setupCardLinks();
  setupPillLinks();
  setupToggleGroups();
  setupDemoHints();
  setupWizard();
  setupGuaranteeClassification();
  markInteractive();
})();
