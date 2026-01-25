<template>
  <div
    class="markdown-content"
    v-html="sanitizedHtml"
  ></div>
</template>

<script setup>
import { computed, defineProps } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js/lib/core';

// Import common languages for syntax highlighting
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import sql from 'highlight.js/lib/languages/sql';

// Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sql', sql);

const props = defineProps({
    content: {
        type: String,
        default: ''
    }
});

// Configure marked with syntax highlighting
marked.setOptions({
    highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (error) {
                console.error('Highlight.js error:', error);
            }
        }
        return code;
    },
    breaks: true, // Convert \n to <br>
    gfm: true // GitHub Flavored Markdown
});

const sanitizedHtml = computed(() => {
    if (!props.content) return '';

    try {
        // Parse markdown to HTML
        const html = marked(props.content);

        // Sanitize to prevent XSS attacks
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'p', 'br', 'strong', 'em', 'u', 's', 'del',
                'a', 'code', 'pre', 'blockquote',
                'ul', 'ol', 'li',
                'table', 'thead', 'tbody', 'tr', 'th', 'td',
                'span', 'div'
            ],
            ALLOWED_ATTR: ['href', 'class', 'target', 'rel'],
            ALLOW_DATA_ATTR: false
        });
    } catch (error) {
        console.error('Markdown parsing error:', error);
        return props.content;
    }
});
</script>

<style scoped>
.markdown-content {
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
}

/* Headings */
.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  color: var(--color-text-white);
  font-weight: var(--font-weight-semibold);
  margin-top: var(--spacing-4);
  margin-bottom: var(--spacing-2);
}

.markdown-content :deep(h1) {
  font-size: var(--font-size-3xl);
}

.markdown-content :deep(h2) {
  font-size: var(--font-size-2xl);
}

.markdown-content :deep(h3) {
  font-size: var(--font-size-xl);
}

/* Paragraphs */
.markdown-content :deep(p) {
  margin-bottom: var(--spacing-3);
}

/* Links */
.markdown-content :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
  transition: color 0.2s ease;
}

.markdown-content :deep(a:hover) {
  color: var(--color-primary-light);
}

/* Inline code */
.markdown-content :deep(code:not(pre code)) {
  background: var(--color-white-alpha-10);
  padding: 2px 6px;
  border-radius: var(--radius-base);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  color: var(--color-primary-light);
}

/* Code blocks */
.markdown-content :deep(pre) {
  background: var(--color-bg-secondary);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: var(--spacing-3) 0;
  border: 1px solid var(--color-border);
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
}

/* Blockquotes */
.markdown-content :deep(blockquote) {
  border-left: 4px solid var(--color-primary);
  padding-left: var(--spacing-4);
  margin: var(--spacing-3) 0;
  color: var(--color-text-secondary);
  font-style: italic;
}

/* Lists */
.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: var(--spacing-3) 0;
  padding-left: var(--spacing-6);
}

.markdown-content :deep(li) {
  margin-bottom: var(--spacing-2);
}

/* Tables */
.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: var(--spacing-3) 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  padding: var(--spacing-2) var(--spacing-3);
  border: 1px solid var(--color-border);
  text-align: left;
}

.markdown-content :deep(th) {
  background: var(--color-surface);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-white);
}

/* Text formatting */
.markdown-content :deep(strong) {
  font-weight: var(--font-weight-bold);
  color: var(--color-text-white);
}

.markdown-content :deep(em) {
  font-style: italic;
}

/* Horizontal rule */
.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--spacing-5) 0;
}

/* Highlight.js syntax highlighting styles */
.markdown-content :deep(.hljs-keyword) {
  color: #c678dd;
}

.markdown-content :deep(.hljs-string) {
  color: #98c379;
}

.markdown-content :deep(.hljs-number) {
  color: #d19a66;
}

.markdown-content :deep(.hljs-comment) {
  color: var(--color-text-tertiary);
  font-style: italic;
}

.markdown-content :deep(.hljs-function) {
  color: #61afef;
}

.markdown-content :deep(.hljs-class) {
  color: #e5c07b;
}

.markdown-content :deep(.hljs-built_in) {
  color: #e06c75;
}
</style>
