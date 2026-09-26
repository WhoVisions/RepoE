document.addEventListener('DOMContentLoaded', () => {
    const scratchArea = document.getElementById('scratchArea');
    const charCount = document.getElementById('charCount');
    const saveStatus = document.getElementById('saveStatus');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const exportBtn = document.getElementById('exportBtn');
    const templateCards = document.querySelectorAll('.template-card');

    const STORAGE_KEY = 'repoe_scratchpad_v1';

    const TEMPLATES = {
        prompt: `# System Prompt & Architecture Contract
You are an autonomous AI specialist in the NouGen ecosystem.
- Role: Precision Code Engineer & System Architect
- Operating Directives: Rule 0.0 (Recall first, delegate heavy lifting, zero hardcoding).
- Non-Negotiables: Bounded timeout patience, zero-window headless execution, hyper-readable deltas.
`,
        pr: `## 📦 Pull Request Summary
- **Type**: Feature / Elevation
- **Scope**: Core Module Hardening
- **Changes**:
  - Implemented resilient API fallback and dynamic environment key resolution.
  - Resolved build and TypeScript strict compiler errors.
- **Verification**:
  - \`npm run build\` passed cleanly with 0 warnings.
`,
        task: `## 🎯 5-Phase Task Execution Plan
1. **INSPECT**: Audit existing file tree, dependencies, and environment constraints.
2. **PLAN**: Draft clean non-destructive patches.
3. **PATCH**: Implement isolated modules avoiding psychedelic airplane traps.
4. **VERIFY**: Run typecheck, unit tests, and build bundle generation.
5. **REPORT**: Deliver concise status report and commit hash.
`
    };

    // Load persisted scratch
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        scratchArea.value = saved;
        updateCounts();
    }

    // Auto-save on input
    scratchArea.addEventListener('input', () => {
        localStorage.setItem(STORAGE_KEY, scratchArea.value);
        updateCounts();
        flashStatus('Saved');
    });

    function updateCounts() {
        const text = scratchArea.value;
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        charCount.textContent = `${chars} chars • ${words} words`;
    }

    function flashStatus(msg) {
        saveStatus.textContent = msg;
        setTimeout(() => { saveStatus.textContent = 'Auto-Saved'; }, 2000);
    }

    // Template inserts
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            const key = card.dataset.template;
            if (TEMPLATES[key]) {
                const current = scratchArea.value;
                scratchArea.value = current ? current + '\n\n' + TEMPLATES[key] : TEMPLATES[key];
                localStorage.setItem(STORAGE_KEY, scratchArea.value);
                updateCounts();
                flashStatus('Template Loaded');
            }
        });
    });

    // Clear
    clearBtn.addEventListener('click', () => {
        if (scratchArea.value && confirm('Clear scratch workspace?')) {
            scratchArea.value = '';
            localStorage.setItem(STORAGE_KEY, '');
            updateCounts();
            flashStatus('Cleared');
        }
    });

    // Copy
    copyBtn.addEventListener('click', () => {
        if (scratchArea.value) {
            navigator.clipboard.writeText(scratchArea.value).then(() => {
                flashStatus('Copied! 📋');
            });
        }
    });

    // Export
    exportBtn.addEventListener('click', () => {
        if (!scratchArea.value) return;
        const blob = new Blob([scratchArea.value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `repoe_scratch_${new Date().toISOString().slice(0, 10)}.md`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        flashStatus('Exported! 📥');
    });
});
