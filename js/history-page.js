// ============================================================
// HORADRIC AI — HISTORY PAGE ENGINE
// history-page.js v2.0
// Handles: load/render history, search, rarity+grade filters,
//          delete individual items, clear all
// Depends on: layout.js
// ============================================================

const HoradricHistory = {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  history: [],        // full list from localStorage
  filtered: [],       // currently displayed subset

  filters: {
    search: '',
    rarity: '',
    grade:  '',
  },

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  init() {
    this.loadHistory();
    this.cacheElements();
    this.attachEventListeners();
    this.applyFilters();
    console.log('📜 Horadric History v2.0 ready');
  },

  loadHistory() {
    try {
      const raw = localStorage.getItem('horadric_history');
      this.history = raw ? JSON.parse(raw) : [];
    } catch(e) {
      console.error('Failed to load history:', e);
      this.history = [];
    }
  },

  cacheElements() {
    this.el = {
      list:          document.getElementById('history-list'),
      emptyNoHistory:document.getElementById('empty-no-history'),
      emptyNoResults:document.getElementById('empty-no-results'),
      countEl:       document.getElementById('history-count'),
      countPlural:   document.getElementById('history-count-plural'),
      search:        document.getElementById('history-search'),
      filterRarity:  document.getElementById('filter-rarity'),
      filterGrade:   document.getElementById('filter-grade'),
      clearAllBtn:   document.getElementById('clear-all-btn'),
    };
  },

  attachEventListeners() {
    // Search — debounced
    let searchTimer;
    this.el.search?.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        this.filters.search = this.el.search.value.trim().toLowerCase();
        this.applyFilters();
      }, 200);
    });

    // Rarity filter
    this.el.filterRarity?.addEventListener('change', () => {
      this.filters.rarity = this.el.filterRarity.value;
      this.applyFilters();
    });

    // Grade filter
    this.el.filterGrade?.addEventListener('change', () => {
      this.filters.grade = this.el.filterGrade.value;
      this.applyFilters();
    });

    // Clear all
    this.el.clearAllBtn?.addEventListener('click', () => this.clearAll());
  },

  // ----------------------------------------------------------
  // FILTER + RENDER
  // ----------------------------------------------------------
  applyFilters() {
    const { search, rarity, grade } = this.filters;

    this.filtered = this.history.filter(item => {
      // Search match
      if (search) {
        const haystack = `${item.title} ${item.insight} ${item.rarity}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }

      // Rarity match
      if (rarity) {
        const itemRarity = String(item.rarity || '').split(' ')[0].toLowerCase();
        if (itemRarity !== rarity) return false;
      }

      // Grade match
      if (grade) {
        const itemGrade = String(item.score || item.grade || '').toUpperCase().charAt(0);
        if (itemGrade !== grade) return false;
      }

      return true;
    });

    this.updateCount();
    this.renderList();
  },

  updateCount() {
    const total = this.history.length;
    if (this.el.countEl)     this.el.countEl.textContent = total;
    if (this.el.countPlural) this.el.countPlural.textContent = total === 1 ? '' : 's';
  },

  renderList() {
    const list = this.el.list;
    if (!list) return;

    // No history at all
    if (this.history.length === 0) {
      list.innerHTML = '';
      this.el.emptyNoHistory && (this.el.emptyNoHistory.style.display = 'block');
      this.el.emptyNoResults && (this.el.emptyNoResults.style.display = 'none');
      return;
    }

    this.el.emptyNoHistory && (this.el.emptyNoHistory.style.display = 'none');

    // Has history but filters returned nothing
    if (this.filtered.length === 0) {
      list.innerHTML = '';
      this.el.emptyNoResults && (this.el.emptyNoResults.style.display = 'block');
      return;
    }

    this.el.emptyNoResults && (this.el.emptyNoResults.style.display = 'none');

    // Render items
    list.innerHTML = '';
    this.filtered.forEach((item, index) => {
      const el = this.buildHistoryItem(item, index);
      list.appendChild(el);
    });
  },

  buildHistoryItem(item, index) {
    const rarity   = String(item.rarity || 'common').split(' ')[0].toLowerCase();
    const verdict  = String(item.verdict || '').toUpperCase();
    const grade    = String(item.score || item.grade || '').toUpperCase().charAt(0);
    const isKeep   = ['KEEP', 'EQUIP', 'SELL', 'UPGRADE', 'EQUIP NEW', 'SANCTIFY'].includes(verdict);
    const isSalvage = ['SALVAGE', 'DISCARD', 'CHARSI', 'KEEP EQUIPPED'].includes(verdict);
    const verdictClass = isKeep ? 'badge-keep' : isSalvage ? 'badge-salvage' : '';
    const verdictLabel = isKeep ? '✓ Keep' : isSalvage ? '✕ Salvage' : verdict;

    const sanctBadge = item.sanctified
      ? `<span class="badge" style="background:rgba(255,215,0,0.2);color:gold;border:1px solid rgba(255,215,0,0.4);">🦋 Sanctified</span>`
      : '';

    const gradeBadge = grade
      ? `<span class="badge" style="${this._gradeStyle(grade)}">${grade}</span>`
      : '';

    const timestamp = item.timestamp
      ? this._relativeTime(item.timestamp)
      : (item.date || '');

    const snippet = item.insight || item.analysis?.substring(0, 120) || '';

    const div = document.createElement('div');
    div.className = 'history-item';
    div.setAttribute('data-rarity', rarity);
    div.setAttribute('data-id', item.id);
    div.style.animationDelay = `${index * 0.04}s`;
    div.style.animation = 'fadein-up 0.3s ease both';

    div.innerHTML = `
      <div class="history-item-header">
        <div style="flex:1; min-width:0;">
          <div class="history-item-name">${item.title || 'Unknown Item'}${item.sanctified ? ' 🦋' : ''}</div>
          <div class="history-item-time">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            ${timestamp}
          </div>
        </div>
        <button class="history-delete-btn" aria-label="Delete ${item.title}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>

      <div class="history-item-badges">
        <span class="badge badge-rarity">${this._capitalise(rarity)}</span>
        ${verdictClass ? `<span class="badge ${verdictClass}">${verdictLabel}</span>` : ''}
        ${gradeBadge}
        ${sanctBadge}
      </div>

      ${snippet ? `<div class="history-item-analysis">${snippet}</div>` : ''}
    `;

    // Delete button
    div.querySelector('.history-delete-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.deleteItem(item.id, div);
    });

    return div;
  },

  // ----------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------
  deleteItem(id, el) {
    // Animate out
    el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateX(1rem)';

    setTimeout(() => {
      this.history = this.history.filter(i => i.id !== id);
      this._persist();
      this.applyFilters();
      HoradricLayout.showToast('🗑️ Item removed from history');
    }, 200);
  },

  clearAll() {
    if (!confirm('Clear all scan history? This cannot be undone.')) return;
    this.history = [];
    this._persist();
    this.filters = { search: '', rarity: '', grade: '' };
    if (this.el.search)       this.el.search.value = '';
    if (this.el.filterRarity) this.el.filterRarity.value = '';
    if (this.el.filterGrade)  this.el.filterGrade.value = '';
    this.applyFilters();
    HoradricLayout.showToast('🗑️ History cleared');
  },

  _persist() {
    try {
      localStorage.setItem('horadric_history', JSON.stringify(this.history));
    } catch(e) {
      console.error('Failed to save history:', e);
    }
  },

  // ----------------------------------------------------------
  // UTILITIES
  // ----------------------------------------------------------
  _capitalise(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  _relativeTime(timestamp) {
    const diff = Date.now() - timestamp;
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);

    if (mins < 1)   return 'Just now';
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7)   return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  },

  _gradeStyle(grade) {
    const styles = {
      S: 'background:rgba(147,51,234,0.25);color:#d8b4fe;border:1px solid rgba(147,51,234,0.4);',
      A: 'background:rgba(22,163,74,0.25);color:#86efac;border:1px solid rgba(22,163,74,0.4);',
      B: 'background:rgba(37,99,235,0.25);color:#93c5fd;border:1px solid rgba(37,99,235,0.4);',
      C: 'background:rgba(202,138,4,0.25);color:#fde68a;border:1px solid rgba(202,138,4,0.4);',
      D: 'background:rgba(220,38,38,0.25);color:#fca5a5;border:1px solid rgba(220,38,38,0.4);',
    };
    return styles[grade] || '';
  },
};

// ============================================================
// AUTO-INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => HoradricHistory.init());
