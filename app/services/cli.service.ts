/*

    This file is part of sshui https://github.com/gbevan/sshui.

    sshui is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    sshui is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Injectable } from '@angular/core';
import * as _ from 'lodash';

const path = require('path');
const debug = require('debug').debug('sshui:service:cli');

const nwApp = (global as any).nw.App;

const paramRe = /^--(\w+)(|=.*)$/;

@Injectable()
export class CliService {
  private options: any = {};

  constructor() {
    debug('in constructor');
    debug('nwApp.argv:', nwApp.argv);
    debug('nwApp.fullArgv:', nwApp.fullArgv);
    debug('process.argv:', process.argv);
    try {
      this.parse(nwApp.argv);
    } catch (e) {
      console.error('Error:', e);
    }
    debug('options:', this.options);
  }

  /**
   * parse command line arguments
   *   sshui [--option[=vals], ...]
   */
  parse(argv: string[]) {
    debug('in parse argv:', argv);
    const dbDefault = path.join(nwApp.dataPath, '.sshui_db.vault');
    debug('dbDefault:', dbDefault);

    const optionList = [
      {
        name: 'db',
        desc: `Specify an alternate JSON database vault file (defaults to ${dbDefault})`,
        default: dbDefault
      }
    ];

    const optionHash = {};
    optionList.forEach((o) => {
      optionHash[o.name] = o;
      if (o.default) {
        this.options[o.name] = o.default;
      }
    });

    if (argv.length < 1) {
      // no args
      return;
    }

    // parse options
    const argv_params: string[] = argv;
    debug('argv_params:', argv_params);

    argv_params.forEach((param) => {
      const m = param.match(paramRe);
      debug('m:', m);
      if (m) {
        const p_name = m[1];
        let p_val = null;

        if (p_name === 'usage') {
          nwApp.closeAllWindows();
          // print usage from optionList
          process.stdout.write('\nUsage:\n');
          optionList.forEach((o) => {
            process.stdout.write(`  --${o.name} - ${o.desc}\n`);
          });
          process.stdout.write('\n');
          return nwApp.quit();
        }

        if (m[2]) {
          p_val = m[2].slice(1); // remove leading =
        }

        debug('p_name:', p_name, 'p_val:', p_val);
        if (!optionHash[p_name]) {
          process.stderr.write(`Unrecognised command line parameter: --${p_name}\n`);
          //nwApp.closeAllWindows();
          //return nwApp.quit();
        }

        this.options[p_name] = p_val;
      } else {
        process.stderr.write(`Unrecognised command line parameter: ${param}\n`);
        //nwApp.closeAllWindows();
        //return nwApp.quit();
      }
    });
  }

  getOptions() {
    return this.options;
  }
}

exports = CliService;
