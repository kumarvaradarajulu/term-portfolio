/* eslint-disable no-multi-str */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit';
import {WebLinksAddon} from 'xterm-addon-web-links';

import * as sections from './sections';
import * as utils from './utils';

// Global scope to display page wise
let page;
let activeSection;

function setup() {
  // UPDATEME: Change the resume json path
  const RESUME_FILE_PATH = 'https://gist.githubusercontent.com/kumarvaradarajulu/e34d005bb1337a25cd3dbd84a69726a9/raw/af258ca3509826daa37d6f86cacce131c2c3843b/sampleesume.json';

  // UPDATEME: Change the sections order as per your needs.
  const SECTION_ORDER = ['help', 'intro', 'work', 'skills', 'projects', 'awards',
    'education', 'avatar'];

  // UPDATEME: Name displayed on Welcome text
  const WELCOME_NAME = 'Kumar Varadarajulu';

  // UPDATEME: The max skills to display.
  const MAX_SKILLS_TO_DISPLAY = 14;
  // const MAX_LENGTH_SKILL_NAME = 20;

  // UPDATEME: Flags controlling various behaviors.
  const FLAGS = {
    'paginateSkills': false,
    'paginateWork': true,
    'paginateProjects': false,
  };

  // UPDATEME: This contains mapping of section names that is displayed to
  // visitor. If there is no mapping the default from SECTION_ORDER or resume
  // json
  // will be used
  const COMMAND_MAP = {
    'intro': {
      'displayName': 'A Peek',
      'callable': sections.displayBasics,
      'helpText': 'A Short summary About Me',
      'jsonResumeKey': 'basics',
    },
    'work': {
      'displayName': 'Work Experience',
      'callable': sections.displayExperience,
      'helpText': 'Details of Work Experience',
    },
    'skills': {
      'displayName': 'Skills',
      'callable': sections.displaySkills,
      'helpText': 'Skills & Proficiency',
    },
    'projects': {
      'displayName': 'Projects',
      'callable': sections.displayProjects,
      'helpText': 'Project details',
    },
    'education': {
      'displayName': 'Education',
      'callable': sections.displayEducation,
      'helpText': 'Educational Qualifications',
    },
    'awards': {
      'displayName': 'Awards & Achievements',
      'callable': sections.displayAwards,
      'helpText': 'Awards & Achievements',
    },
    'help': {
      'displayName': 'Help',
      'callable': sections.displayHelp,
      'helpText': 'Get help on commands',
    },
    // 'grep': {
    //   'displayName': 'Grep',
    //   'callable': sections.grepSections,
    //   'helpText': 'To search within various sections',
    // },
    'avatar': {
      'displayName': 'Avatar',
      'callable': sections.displayAvatar,
      'helpText': 'To view a textual representation of my Profile Picture',
    },

  };

  const HELPER_COMMANDS = {
    'help': {
      'callable': sections.displayHelp,
    },
    'avatar': {
      'callable': sections.displayAvatar,
    },
    'grep': {
      'callable': sections.grepSections,
    },
  };

  // UPDATEME: Profile image as text
  const PROFILE_IMAGE_AS_TEXT =
        '    +/-+y/:-::  -/+s/://:.--::s:::/+:yoso+/-/+:o:--.-/\n\
    .-.:-/+/o/  -:oyyyho/:---/ss:::/+::oho/o/:/odhsss:\n\
    --.```/++/ `/+hNMMNd-     `.:/o+hoo++://os+oshy+s+\n\
    :---..:/// `sdhhddh.        `o++y/+++omss//-.+omdo\n\
    soo/--:-.. `+++s//`          `oo+o/-ohmsoy+/omyho+\n\
    ddhy://--. `ydy+o.      ```   `://:oo+:---o/+o+hy/\n\
    mmmm++/yyy .sdyo/`     ````.`  .-:///::oyy:-:-s+oo\n\
    mmmmmhymNh .Nmhhs-     ``   `  -::/ydsohh+:.-/ddh+\n\
    mmNNNmdNNy -NNmmms``   `-```--/---/m+sym::--/ydso+\n\
    NNNNNNmNNs -NNNMMN-``    ``.:/+-:.:/:+h://+-+yNNyo\n\
    NNNNNNmh+: .+smMMNy``   ```./hs/ho.:.:----/+ymMMNo\n\
    NNNNNNmy/- -o/sdmho-     ```:+s.+:...:-:-``-.-+hhy\n\
    NNNNNNNmh/ ....`          `..`.-//--:s+/-:::.``-so\n\
    NNNNNNNhh/                   ````..-/hdmmd-:::++so\n\
    NNNNNNNs+`         `         ```````./y+ssosss+:-/\n\
    NNNMMNNo.      `....--.`    ` ```    `-++++ooo:-.-\n\
    NNMNMNN-     `/--+-s/s./o/+```        `////:://::/\n\
    NNMMMNm`     -hddhyysyy+yo-            -++/+/////+\n\
    NNNMMNNh`    .+hoyh+::ydmd-            -hhyyyyyyys\n\
    NNMMMNN+``    /o y-:/o.yhs.`            smmmmmmmdd\n\
    ommNNhs`    ` -o.-+/+-.dd/            `.hNmmmNmmmm\n\
    Nmhys-`   ``  .  `   oso        :MMd `.-/NMMMNNmdh';

  let data = {};
  // TODO: Up and Down arrow history implementation
  let history = [];
  let historyIndex;
  let prevHistory = '';

  const term = new Terminal(
      {
        'theme': {
          background: utils.getTerminalCodes('bgblack'),
        },
        'lineHeight': 1.2,
      },
  );

  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.loadAddon(new WebLinksAddon());

  term.setOption('cursorBlink', true);

  term.open(document.getElementById('terminal'));
  fitAddon.fit();


  function newTerminal(d) {
    if (term._initialized) {
      return;
    }

    data = d;

    writeHeader();

    sections.displayHelp(term, COMMAND_MAP);

    term._initialized = true;
    term.prompt = () => {
      term.write('\r\n$ ');
    };

    utils.prompt(term);

    setUpEvents();
  }

  function setUpEvents() {
    let cmd = '';
    term.onData((e) => {
      switch (e) {
        case '\f':
          term.clear();
          break;
        case '\t':
          // Try to autocomplete

          const fullCmd = utils.autoCompleteCommand(term, cmd, SECTION_ORDER);
          if (fullCmd) {
            cmd = fullCmd;
          }
          break;
        case '\u0015': // Ctrl+U delete full line
          if (cmd) {
            cmd = '';
            term.write(utils.getTerminalCodes('clearLine'));
            utils.prompt(term, false);
          }

          break;
        case '\r': // Enter
          if (!activeSection) {
            // If there is no active pagination section show prompt
            if (cmd != '') {
              stackCommandHistory(cmd);
              executeCommand(cmd);
            }
            cmd = '';

            if (!activeSection) {
              utils.prompt(term);
            } else {
              writeContinuation();
            }
          } else {
            if (cmd == 'q') {
              // User is quitting clear the flags
              page = undefined;
              activeSection = undefined;
              cmd = '';
              term.writeln('');
              utils.prompt(term);
            } else {
              term.clear();
              displaySection(activeSection);
              writeContinuation();
            }
          }

          break;
        case '\u0003': // Ctrl+C
          utils.prompt(term);
          break;
        case '\u001b[5~': // Page Up
          break;
        case '\u001b[6~': // Page Down
          if (activeSection) {
            term.clear();
            displaySection(activeSection);
            if (!activeSection) {
              utils.prompt(term);
            } else {
              writeContinuation();
            }
          }
          break;
        case '\u007F': // Backspace (DEL)
          // Do not delete the prompt
          if (term._core.buffer.x > 2) {
            term.write('\b \b');
            // If characters are deleted remove them from command
            if (cmd.length > 0) {
              cmd = cmd.slice(0, cmd.length - 1);
            }
          }
          break;
        case '\u001b[A': // Up Arrow
          let h = changeAndGetHistory(true);
          if (h) {
            clearBuffer();
            term.write(h);
            cmd = prevHistory = h;
          }
          break;
        case '\u001b[B': // Down Arrow
          h = changeAndGetHistory(false);
          if (h) {
            clearBuffer();
            term.write(h);
            cmd = prevHistory = h;
          }
          break;

        default: // Print all other characters for demo
          cmd += e;
          term.write(e);
      }
    });
  }

  function writeContinuation() {
    term.writeln('');
    term.writeln(utils.wrapWithEscapeCodes('grey',
        '  ------ Press <Enter> to Continue or <q+Enter> to quit ------'));
    term.write(utils.wrapWithEscapeCodes('grey', ':'));
  }

  function stackCommandHistory(cmd) {
    if (historyIndex == undefined || isNaN(historyIndex)) {
      history.push(cmd);
    } else {
      historyIndex = NaN;
    }
  }

  function changeAndGetHistory(up) {
    if (!history) {
      return;
    }

    if (!up) {
      // For down arrow we decrement history
      return incHistory();
    } else {
      return decHistory();
    }
    // If index is
  }

  function incHistory() {
    if (historyIndex && historyIndex == (history.length-1)) {
      // Already reached the max so return nothing
      return;
    }

    if (historyIndex == undefined || isNaN(historyIndex)) {
      historyIndex = -1;
    }

    historyIndex ++;
    return history[historyIndex];
  }
  function decHistory() {
    if (historyIndex == 0) {
      // Already reached the max so return nothing
      return;
    }

    if (historyIndex == undefined || isNaN(historyIndex)) {
      historyIndex = history.length;
    }

    historyIndex --;
    return history[historyIndex];
  }

  function clearBuffer() {
    for (let i = 0; i < prevHistory.length; i++) {
      if (term._core.buffer.x > 2) {
        term.write('\b \b');
      }
    }
  }

  function getResume() {
    fetch(RESUME_FILE_PATH).then((response) => response.json()).
        then((data) => newTerminal(data));
  }

  function executeCommand(c) {
    const cmd = c.toLowerCase().replace(/\t+/g, ' ').
        replace(/\s+/g, ' ').replace(/[^\w\s]/g, '').trim();

    if (cmd.length == 0) {
      wrongCommand(c);
      return;
    }

    const commands = cmd.split(' ');

    execCommand(c, commands[0], commands.slice(1));
  }

  function execCommand(enteredCommand, cmd, args) {
    switch (cmd) {
      case 'help':
        sections.displayHelp(term, COMMAND_MAP);
        break;

      case 'avatar':
        if (cmd in HELPER_COMMANDS) {
          HELPER_COMMANDS[cmd]['callable'](term, PROFILE_IMAGE_AS_TEXT);
        }
        break;


      case 'clear':
        term.clear();
        break;

      default:
        if (cmd in COMMAND_MAP) {
          displaySection(cmd);
        } else {
          wrongCommand(enteredCommand);
        }

        break;
    }
  }

  function displaySection(cmd) {
    let d;
    if ('jsonResumeKey' in COMMAND_MAP[cmd]) {
      d = data[COMMAND_MAP[cmd]['jsonResumeKey']];
    } else {
      d = data[cmd];
    }

    switch (cmd) {
      case 'intro':
        sections.displayBasics(term, d);
        break;

      case 'skills':
        sections.displaySkills(term, d, MAX_SKILLS_TO_DISPLAY, page);
        break;

      case 'awards':
        sections.displayAwards(term, d);
        break;

      case 'education':
        sections.displayEducation(term, d);
        break;

      case 'work':
        if (page === undefined && FLAGS['paginateWork']) {
          page = 0;
        }
        term.clear();
        const p = sections.displayExperience(term, d, page);
        if (FLAGS['paginateWork']) {
          page = p;
          activeSection = page == undefined ? undefined : 'work';
        }
        break;

      case 'projects':
        if (page === undefined && FLAGS['paginateProjects']) {
          page = 0;
        }
        term.clear();
        const x = sections.displayProjects(term, d, page);
        if (FLAGS['paginateProjects']) {
          page = x;
          activeSection = page == undefined ? undefined : 'projects';
        }
        break;

      default:
        break;
    }
  }

  function wrongCommand(cmd) {
    utils.prompt(term);
    term.writeln(utils.wrapWithEscapeCodes('bgred', '`' + cmd + '`') +
      ' is not a command.' + ' Use one of the following commands');
    utils.writeEmpty(term);
    for (let i = 0; i < SECTION_ORDER.length; i++) {
      term.write(SECTION_ORDER[i] + ' '.repeat(3));
    }
  }

  function writeHeader() {
    sections.displayAvatar(term, PROFILE_IMAGE_AS_TEXT);
    const welcomeMessage = utils.justifyCenter('Welcome to ' + utils.wrapWithEscapeCodes('lightblue', utils.wrapWithEscapeCodes('bold', WELCOME_NAME + '\'s')) +
    ' Portfolio page');

    term.writeln(utils.wrapWithEscapeCodes('white', ' '.repeat(10) + welcomeMessage));
  }

  getResume();
}


setup();
