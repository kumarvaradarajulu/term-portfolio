/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import {capitalize, colHeader, getTerminalCodes,
  justifyCenter, monthYear, sectionHeader,
  wordWrap, wrapWithEscapeCodes, writeEmpty} from './utils';


export function displayAvatar(term, profileImageText) {
  term.writeln('');
  term.writeln('');

  profileImageText.split('\n').
      forEach((el) => term.writeln(getTerminalCodes('bgbalck') +
          getTerminalCodes('green') + justifyCenter(el)));
  term.write(getTerminalCodes('reset'));
  term.writeln('');
  term.writeln('');
}

export function grepSections(term, params) {

}


export function displayHelp(term, commands) {
  sectionHeader(term, 'Help');
  term.writeln('Please use one of the following commands to know more ' +
    wrapWithEscapeCodes('lightblue', '`About Me`'));
  writeEmpty(term);
  for (const key in commands) {
    if (Object.hasOwnProperty.call(commands, key)) {
      const element = commands[key];
      term.writeln(wrapWithEscapeCodes('magenta', key) +
      ' '.repeat(10 - key.length) + element['helpText']);
    }
  }
}

export function displayEducation(term, data) {
  if (!data) {
    return;
  }
  sectionHeader(term, 'Education');
  data.forEach((element) => {
    writeEmpty(term);
    const startDate = monthYear(element['startDate']);
    const endDate = monthYear(element['endDate']);
    // Calculate the number of spaces needed to right justify the dates
    const spaces = 100 - (endDate.length + startDate.length +
        element['institution'].length + 5);
    term.writeln(wrapWithEscapeCodes('magenta',
        capitalize(element['institution'])) + ' '.repeat(spaces) +
        startDate + '-' + endDate);
    term.writeln('Completed studying, ' +
        wrapWithEscapeCodes('under', element['area']) +
        ' with ' + wrapWithEscapeCodes('yellow', element['gpa']));
  });
}


export function displayAwards(term, data) {
  if (!data) {
    term.writeln('I wasn\'t recognized as much as I deserved it, However, I consider all of my work to be Award worthy, Explore my `work`');
    return;
  }
  sectionHeader(term, 'Awards');
  data.forEach((element) => {
    term.writeln(wrapWithEscapeCodes('yellow', getTerminalCodes('dot')) +
    'Received ' + wrapWithEscapeCodes('magenta', element['title']) + ' from ' +
    wrapWithEscapeCodes('under', element['awarder']) + ', on ' +
    element['date']);
    term.writeln(element['summary']);
  });
}

export function displayBasics(term, data) {
  sectionHeader(term, 'About Me');
  term.writeln(colHeader('Name') + wrapWithEscapeCodes('bold', capitalize(data['name'])));
  term.writeln(colHeader('Summary') + data['label']);
  const lines = data['summary'].split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]) {
      const l = wordWrap(lines[i]);
      if (i == 0) {
        term.writeln(colHeader('Highlights') + wrapWithEscapeCodes('yellow', getTerminalCodes('dot')) + l[0]);
      } else {
        term.writeln(' '.repeat(12) + wrapWithEscapeCodes('yellow', getTerminalCodes('dot')) + l[0]);
      }

      for (let j = 1; j < l.length; j++) {
        term.writeln(' '.repeat(14) + l[j]);
      }
    }
  }
  if (data['profiles'].length > 0) {
    term.writeln(colHeader('Know More'));
    data['profiles'].forEach((element) => {
      term.writeln(' '.repeat(12) + wrapWithEscapeCodes('lightblue', element['network']) + ' ' + wrapWithEscapeCodes('darkblue', getTerminalCodes('under') + element['url']));
    });
  }
}

function displaySkill(term, skill, level, maxSkillLen) {
  const levelString = getTerminalCodes('green') + '  ' +
  '\u2596'.repeat(level) + getTerminalCodes('grey') +
  '\u2596'.repeat(5 - level) + getTerminalCodes('reset');
  return getTerminalCodes('magenta') + capitalize(skill) +
  getTerminalCodes('reset') + ' '.repeat(maxSkillLen - skill.length) +
  levelString;
}

function getSkillLevel(skill) {
  switch (skill) {
    case 'expert':
      return 5;
    case 'advanced':
      return 4;
    case 'intermediate':
      return 3;
    case 'beginner':
      return 2;
    case 'learning':
      return 1;

    default:
      return 2;
  }
}

export function displaySkills(term, data, maxSkillsToDisplay) {
  sectionHeader(term, 'Skills');
  let maxSkillLen = 0;
  const skills = {};
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const element = data[key];
      maxSkillLen = element['name'].length > maxSkillLen ? element['name'].length : maxSkillLen;
      const level = element['level'].toLowerCase();

      skills[element['name']] = getSkillLevel(level);
    }
  }

  let i = 1;
  let printSkillString = '';
  let sortedSkills = Object.entries(skills).sort((a, b) => b[1] - a[1]);
  for (let j = 0; j < sortedSkills.length; j++) {
    sortedSkills = Object.entries(skills);
    const element = sortedSkills[j];
    const skillString = displaySkill(term, element[0], element[1], maxSkillLen);
    printSkillString = printSkillString == '' ? skillString : printSkillString + ' '.repeat(5) + skillString;
    if (i % 2 == 0) {
      term.writeln(printSkillString);
      printSkillString = '';
    }
    i++;
    if (i > maxSkillsToDisplay) {
      break;
    }
  }
}

/* [{"name":"benchmark python packages","description":"Project benchmarks various Python packages and publishes the results","url":"","highlights":[],"keywords":[],"roles":[],"startDate":"2020-09-01","endDate":"2020-09-01","entity":"","type":"","displayName":"Benchmark Python Packages","website":"","summary":"Repo to compare to various Python packages","primaryLanguage":"","languages":["python"],"libraries":["orjson","simplejson","json"],"githubUrl":"https://github.com/kumarvaradarajulu/benchmark-python-packages","repositoryUrl":"https://github.com/kumarvaradarajulu/benchmark-python-packages","start":{"year":2020,"month":9,"day":null},"end":{"year":2020,"month":9,"day":null},"images":[],"videos":[]}
*/

export function displayProjects(term, data, page) {
  function getProj(element) {
    displayProject(term, element).forEach((line) => {
      term.writeln(line);
    });
  }

  if (page >= 0) {
    sectionHeader(term, 'Project ' +
    wrapWithEscapeCodes('bold', page == undefined ? 1 : page + 1));
    writeEmpty(term, 2);
    getProj(data[page]);
    page++;
    if (page < data.length) {
      return page;
    } else {
      // explicitly return page
      return undefined;
    }
  } else {
    sectionHeader(term, 'Projects');
    writeEmpty(term, 1);
    for (let i = 0; i < data.length; i++) {
      getProj(data[i]);
      term.writeln(wrapWithEscapeCodes('grey', '-'.repeat(30)));
    }
  }
}

export function displayProject(term, project) {
  const startDate = project['startDate'] ? monthYear(project['startDate']) : '';
  const endDate = project['endDate'] ? monthYear(project['endDate']) : startDate;
  const headerText = wrapWithEscapeCodes('green', capitalize(project['name']));

  // Find spaces needed to right justify the date
  const spaces = 100 - (endDate.length + startDate.length + project['name'].length + 5);
  const lines = [];
  lines.push(headerText + ' '.repeat(spaces) + wrapWithEscapeCodes('yellow', startDate + '-' + endDate));
  lines.push(wrapWithEscapeCodes('grey', 'Stack: ' + project['languages'].join('|') + '|' + project['libraries'].join('|')));
  lines.push('');

  // Show the summary
  wordWrap(project['summary']).forEach((el) => {
    lines.push(el);
  });
  lines.push('');

  // Show the highlights
  wordWrap(project['description']).forEach((element) => {
    if (element != '') {
      lines.push(wrapWithEscapeCodes('yellow', getTerminalCodes('dot')) +
      element);
    }
  });
  lines.push('');
  return lines;
}

export function displayExp(term, exp) {
  const endDate = exp.hasOwnProperty('endDate') ? (exp['endDate'] ? monthYear(exp['endDate']) : 'Present ') : 'Present ';
  const startDate = monthYear(exp['startDate']);
  const headerText = wrapWithEscapeCodes('green', exp['name']);

  // Find spaces needed to right justify the date
  const spaces = 100 - (endDate.length + startDate.length + exp['name'].length + 5);
  const lines = [];
  lines.push(headerText + ' '.repeat(spaces) + wrapWithEscapeCodes('yellow', startDate + '-' + endDate));
  lines.push(wrapWithEscapeCodes('grey', exp['position']));

  // Show the summary
  wordWrap(exp['summary']).forEach((el) => {
    lines.push(el);
  });
  lines.push('');

  // Show the highlights
  let header = false;
  for (let i = 0; i < exp['highlights'].length; i++) {
    const element = exp['highlights'][i];
    if (element != '') {
      if (!header) {
        lines.push(wrapWithEscapeCodes('magenta', 'Highlights'));
        header = true;
      }
      lines.push(wrapWithEscapeCodes('yellow', getTerminalCodes('dot')) +
      element);
    }
  }
  lines.push('');
  return lines;
}

export function displayExperience(term, data, page) {
  sectionHeader(term, 'Work Experience ' +
  wrapWithEscapeCodes('bold', page == undefined ? 1 : page + 1));
  function getExp(element) {
    displayExp(term, element).forEach((line) => {
      term.writeln(line);
    });
  }

  if (page >= 0) {
    writeEmpty(term, 2);
    getExp(data[page]);
    page++;
    if (page < data.length) {
      return page;
    } else {
      // explicitly return page
      return undefined;
    }
  } else {
    writeEmpty(term, 2);
    for (let i = 0; i < data.length; i++) {
      getExp(data[i]);
    }
  }
}
