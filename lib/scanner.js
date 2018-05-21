'use strict';

module.exports = class Scanner {
  constructor(string) {
    this.string = string;
    this.index = 0;
  }

  get current() {
    return this.string[this.index];
  }

  get length() {
    return this.string.length;
  }

  get atEnd() {
    return this.index >= this.maxIndex;
  }

  get maxIndex() {
    return this.length - 1;
  }

  peek() {
    if (this.index + 1 === this.maxIndex) {
      return null;
    }
    return this.string[this.index + 1];
  }

  behind() {
    if (this.index - 1 < 0) {
      return null;
    }
    return this.string[this.index - 1];
  }

  rewind(amount) {
    this.index -= amount;
  }

  wind(amount) {
    this.index += amount;
  }

  arg() {
    const word = this.word();
    if (word.startsWith('"')) {
      this.rewind(word.length);
      const phrase = this.gatherUntil('"');
      // skip spaces after a quoted phrase
      if (!this.atEnd && this.current === ' ') {
        this.index++;
      }
      return phrase;
    }
    return word;
  }

  word() {
    return this.gatherUntil(' ');
  }

  gatherUntil(_predicate, { skipAfter = true } = {}) {
    const predicate = typeof _predicate === 'string'
      ? (char) => char !== _predicate
      : _predicate;

    let buffer = '';
    while (predicate(this.current) && this.index !== this.length) {
      buffer += this.string[this.index++];
    }

    if (skipAfter) {
      this.index++;
    }
    return buffer;
  }
};
