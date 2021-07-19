/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * @param  {string} d input year in yyyy-mm-dd format
 * @return {string} output in mmm yyyy format
 */
export function monthYear(d) {
  const da = new Date(d);
  return MONTHS[da.getMonth()] + ' ' + da.getFullYear();
}

/**
 * @param  {string} str string to capitalize
 * @return {string} capitalized string
 */
export function capitalize(str) {
  const sub = str.split(' ');
  const caps = [];
  for (let i = 0; i < sub.length; i++) {
    caps[i] = sub[i].charAt(0).toLocaleUpperCase() + sub[i].slice(1);
  }
  return caps.join(' ');
}

export function justifyCenter(text) {
  const s = (100 - text.length) / 2;
  return ' '.repeat(s) + text;
}

export function wrapWithEscapeCodes(color, text) {
  return getTerminalCodes(color) + text + getTerminalCodes('reset');
}

export function getTerminalCodes(codeName) {
  switch (codeName) {
    // Font colors
    case 'red':
      return '\x1b[1;31m';
    case 'green':
      return '\x1b[1;32m';
    case 'lightblue':
      return '\x1b[1;36m';
    case 'magenta':
      return '\x1b[1;35m';
    case 'darkblue':
      return '\x1b[1;34m';
    case 'black':
      return '\x1b[1;30m';
    case 'yellow':
      return '\u001B[33m';
    case 'white':
      return '\x1b[1;37m';
    case 'reset':
      return '\u001b[0m';

      // BG colors
    case 'bgred':
      return '\u001b[41m';
    case 'bggreen':
      return '\u001b[42m';
    case 'bglightblue':
      return '\u001b[46m';
    case 'bgdarkblue':
      return '\u001b[44m';
    case 'bgblack':
      return '\u001b[40m';
    case 'bgmagenta':
      return '\u001b[45m';
    case 'bgwhite':
      return '\u001b[47m';

      // Text decoration
    case 'bold':
      return '\u001B[1m';
    case 'italic':
      return '\u001B[3m';
    case 'under':
      return '\u001B[4m';

      // Symbols
    case 'dot':
      return '\u25CF ';

      // Cursor sequences
    case 'clearLine':
      return '\u001B[2K';

    default:
      // default color is black
      return '\x1b[1;30m';
  }
}

export function writeEmpty(term, times = 1) {
  for (let i = 0; i < times; i++) {
    term.writeln('');
  }
}

export function colHeader(string, maxLen = 10) {
  const spaces = ' '.repeat((maxLen - string.length >= 0 ? (maxLen - string.length) : 0));
  return getTerminalCodes('magenta') + string + spaces + ': ' + getTerminalCodes('reset');
}


export function wordWrap(s, len = 90) {
  // Word wraps and appends \n for the number of characters asked and returns list of lines split by '\n'
  // Credits: https://stackoverflow.com/a/51506718/1190270
  return s.replace(/(?![^\n]{1,90}$)([^\n]{1,90})\s/g, '$1\n').split('\n');
}

export function sectionHeader(term, str) {
  writeEmpty(term, 2);
  term.writeln(wrapWithEscapeCodes('lightblue', capitalize(str)));
}

export function autoCompleteCommand(term, cmd, sections) {
  const matchingSections = [];
  for (let i = 0; i < sections.length; i++) {
    const element = sections[i];
    if (element.startsWith(cmd)) {
      matchingSections.push(element);
    }
  }

  if (!matchingSections) {
    return;
  }

  if (matchingSections.length == 1) {
    term.write(matchingSections[0].slice(cmd.length));
    return matchingSections[0];
  } else {
    writeEmpty(term);
    matchingSections.forEach((element) => {
      term.write(element + ' '.repeat(3));
    });
    writeEmpty(term);
    prompt(term);
    term.write(cmd);
  }
}

export function prompt(term, newLine = true) {
  if (newLine) {
    term.write('\r\n$ ');
  } else {
    term.write('\r$ ');
  }
}
