/**
 * Custom SplitText utility for GSAP animations
 * Splits text into characters, words, or lines for staggered animations
 */

export class SplitText {
  constructor(element, options = {}) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    this.options = {
      type: 'chars,words', // chars, words, lines
      charsClass: 'split-char',
      wordsClass: 'split-word',
      linesClass: 'split-line',
      ...options
    };

    this.chars = [];
    this.words = [];
    this.lines = [];
    this.originalHTML = '';

    if (this.element) {
      this.split();
    }
  }

  split() {
    this.originalHTML = this.element.innerHTML;
    const text = this.element.textContent;
    const types = this.options.type.split(',').map(t => t.trim());

    // Clear element
    this.element.innerHTML = '';

    // Split into words first
    const wordTexts = text.split(/(\s+)/);

    wordTexts.forEach((wordText) => {
      if (wordText.match(/^\s+$/)) {
        // Preserve whitespace
        this.element.appendChild(document.createTextNode(wordText));
        return;
      }

      if (!wordText) return;

      const wordSpan = document.createElement('span');
      wordSpan.className = this.options.wordsClass;
      wordSpan.style.display = 'inline-block';
      wordSpan.style.position = 'relative';

      if (types.includes('chars')) {
        // Split word into characters
        const chars = wordText.split('');
        chars.forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.className = this.options.charsClass;
          charSpan.style.display = 'inline-block';
          charSpan.style.position = 'relative';
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
          this.chars.push(charSpan);
        });
      } else {
        wordSpan.textContent = wordText;
      }

      this.element.appendChild(wordSpan);

      if (types.includes('words')) {
        this.words.push(wordSpan);
      }
    });

    // Handle lines if needed
    if (types.includes('lines')) {
      this.splitLines();
    }

    return this;
  }

  splitLines() {
    // Get all word elements
    const wordElements = this.element.querySelectorAll(`.${this.options.wordsClass}`);
    if (wordElements.length === 0) return;

    let currentLine = [];
    let currentTop = null;

    wordElements.forEach((word) => {
      const rect = word.getBoundingClientRect();

      if (currentTop === null) {
        currentTop = rect.top;
      }

      if (Math.abs(rect.top - currentTop) > 5) {
        // New line detected
        if (currentLine.length > 0) {
          this.wrapLine(currentLine);
        }
        currentLine = [word];
        currentTop = rect.top;
      } else {
        currentLine.push(word);
      }
    });

    // Wrap last line
    if (currentLine.length > 0) {
      this.wrapLine(currentLine);
    }
  }

  wrapLine(words) {
    const lineSpan = document.createElement('span');
    lineSpan.className = this.options.linesClass;
    lineSpan.style.display = 'block';
    lineSpan.style.position = 'relative';
    lineSpan.style.overflow = 'hidden';

    const parent = words[0].parentNode;
    parent.insertBefore(lineSpan, words[0]);

    words.forEach((word) => {
      lineSpan.appendChild(word);
      // Add space between words in line
      lineSpan.appendChild(document.createTextNode(' '));
    });

    this.lines.push(lineSpan);
  }

  revert() {
    if (this.element && this.originalHTML) {
      this.element.innerHTML = this.originalHTML;
    }
    this.chars = [];
    this.words = [];
    this.lines = [];
  }
}

/**
 * Helper function to split multiple elements
 */
export const splitTextAll = (selector, options = {}) => {
  const elements = document.querySelectorAll(selector);
  return Array.from(elements).map(el => new SplitText(el, options));
};

export default SplitText;
