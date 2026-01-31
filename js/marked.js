/**
 * HORADRIC AI - LIGHTWEIGHT MARKDOWN PARSER
 * Optimized for AI JSON responses.
 * Handles: **Bold**, *Italic*, Bullet points, Headers, Newlines
 */

const marked = {
    parse: function(text) {
        if (!text) return '';

        // 1. Escape HTML (Safety First)
        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // 2. Headers (### Header)
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // 3. Bold (**text**)
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // 4. Italic (*text*)
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // 5. Bullet Points
        // Matches lines starting with * or - and wraps them
        // This is a simple regex approach sufficient for simple lists
        html = html.replace(/^\s*[\-\*]\s+(.*)$/gm, '<li>$1</li>');
        
        // Wrap adjacent <li> in <ul> (Basic implementation)
        // If the AI outputs complex nested lists, this might need expansion,
        // but for item tooltips, this is usually sufficient.
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>'); 

        // 6. Fix List Wrapping (Simple heuristic to group LIs)
        // Note: A true parser uses a state machine. This regex replaces strictly adjacent LIs.
        html = html.replace(/<\/li>\n<li>/g, '</li><li>');
        
        // 7. Newlines to <br> (but not inside lists or headers)
        // We split by tags to avoid adding <br> inside HTML tags
        const parts = html.split(/(<[^>]+>)/);
        html = parts.map(part => {
            if (part.startsWith('<')) return part;
            return part.replace(/\n/g, '<br>');
        }).join('');

        // 8. Clean up extra BRs after headers
        html = html.replace(/<\/h[1-3]><br>/g, (match) => match.replace('<br>', ''));
        html = html.replace(/<\/ul><br>/g, '</ul>');

        return html;
    }
};

// Export for module systems if needed, otherwise it's global
if (typeof module !== 'undefined') module.exports = marked;