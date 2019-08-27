/** @license
 *
 *     Colour Palette Generator demo script.
 *     Copyright (c) 2014 Google Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License"); you may
 *     not use this file except in compliance with the License.  You may
 *     obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 *     implied.  See the License for the specific language governing
 *     permissions and limitations under the License.
 */

'use strict';

(function() {
  var byId = document.getElementById.bind(document);


  var transformColors = function(colors, callback) {
    if (!callback) {
      return colors;
    }
    return colors.map(function(color) {
      var c = parseInt(color, 16);
      return callback(c >> 16, (c >> 8) & 255, c & 255).map(function(v) {
        v = Math.floor(v);
        v = Number(v > 0 ? (v < 255 ? v : 255) : 0).toString(16);
        return v.length == 1 ? '0' + v : v;
      }).join('');
    });
  };

  var blindnessFilters = {
    green: {
      name: 'Green-blindness (6% of men, 0.4% of women)',
      func: function(r, g, b) {
        r = Math.pow(r, 2.2);
        g = Math.pow(g, 2.2);
        b = Math.pow(b, 2.2);
        var R = Math.pow(0.02138 + 0.677 * g + 0.2802 * r, 1 / 2.2);
        var B = Math.pow(0.02138 * (1 + g - r) + 0.9572 * b, 1 / 2.2);
        return [R, R, B];
      }
    },
    red: {
      name: 'Red-blindness (2.5% of men)',
      func: function(r, g, b) {
        r = Math.pow(r, 2.2);
        g = Math.pow(g, 2.2);
        b = Math.pow(b, 2.2);
        var R = Math.pow(0.003974 + 0.8806 * g + 0.1115 * r, 1 / 2.2);
        var B = Math.pow(0.003974 * (1 - g + r) + 0.9921 * b, 1 / 2.2);
        return [R, R, B];
      }
    },
    gray: {
      name: 'Grayscale',
      func: function(r, g, b) {
        g = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return [g, g, g];
      }
    }
  };
  (function(select) {
    var keys = [];
    for (var key in blindnessFilters) {
      keys.push(key);
    }
    keys.sort();
    for (var i = 0; (key = keys[i]); ++i) {
      var option = document.createElement('option');
      option.value = key;
      option.appendChild(document.createTextNode(blindnessFilters[key].name));
      select.appendChild(option);
    }
  })(byId('blindness'));


  var createDom = function(tag, opt_attrs, varargs) {
    var el = document.createElement(tag);
    if (opt_attrs) {
      for (var name in opt_attrs) {
        el.setAttribute(name, opt_attrs[name]);
      }
    }
    for (var i = 2, child; (child = arguments[i]); ++i) {
      if (typeof child === 'string') {
        child = document.createTextNode(child);
      }
      el.appendChild(child);
    }
    return el;
  };


  var createColorRow = function(colors, title) {
    var row = createDom('tr', null,
                        createDom('td'),
                        createDom('td', null, title));

    if (colors) {
      var width = Math.max(Math.round(500 / colors.length), 5);
      var cell = document.createElement('td');
      row.firstChild.innerHTML = colors.map(function(color) {
        return '<span style="background: #' + color + '; width: ' +
          width + 'px"></span>';
      }).join('');
    } else {
      row.firstChild.innerHTML = 'Too many colours requested.';
    }

    return row;
  };


  var palettes = byId('palettes');
  var defaultBackground = palettes.style.backgroundColor;
  var tooltip = byId('tooltip');

  function hex(x) {
    return ('0' + parseInt(x).toString(16)).slice(-2);
  }

  function rgbToHex(rgb) {
    var match =
      rgb && rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+\.*\d+)?\)$/);
    return match
      ? ('#' + hex(match[1]) + hex(match[2]) + hex(match[3])).toUpperCase()
      : '';
  }

  var mouseMoveHandler = function(e) {
    var target = e.target, bg;
    if (tooltip.firstChild) {
      tooltip.removeChild(tooltip.firstChild);
    }
    if (target && target.nodeName == 'SPAN') {
      bg = target.style.backgroundColor;
    }
    bg = bg || defaultBackground;
    var colStr = bg + '\u2003' + rgbToHex(bg)
    tooltip.appendChild(document.createTextNode(colStr));
    tooltip.style.display = bg ? '' : 'none';
    palettes.style.backgroundColor = bg;
  };
  palettes.addEventListener('mousemove', mouseMoveHandler, false);
  palettes.addEventListener('mouseover', mouseMoveHandler, false);

  palettes.addEventListener('click', function(e) {
    var target = e.target;
    if (target && target.nodeName == 'SPAN') {
      defaultBackground = target.style.backgroundColor || defaultBackground;
    }
  }, false);

  var regenerate = function() {
    var transform = blindnessFilters[byId('blindness').value];
    transform = transform ? transform.func : null;
    var num = parseInt(byId('number').value, 10);
    num = num > 1 ? num < 100 ? num : 100 : 1;

    while (palettes.firstChild) {
      palettes.removeChild(palettes.firstChild);
    }

    var table = document.createElement('table'), tbody;
    palettes.appendChild(table);

    var addHeading = function(title) {
      tbody = createDom('tbody', null,
                        createDom('tr', null,
                                  createDom('th', { colspan: '2' },
                                            title)));
      table.appendChild(tbody);
    };

    var add = function(title, name, varargs) {
      var colors;
      if (typeof name === typeof add && !name.scheme_name) {
        colors = palette.generate(name, num);
      } else {
        var scheme = name;
        if (typeof name === 'string') {
          title = name + ': ' + title;
          scheme = palette.listSchemes(name)[0];
        }
        var args = Array.prototype.slice.call(arguments, 1);
        args[0] = num;
        colors = scheme.apply(scheme, args);
      }
      if (colors) {
        colors = transformColors(colors, transform);
      }
      tbody.appendChild(createColorRow(colors, title || name));
    };

    addHeading('Miscellaneous');
    add('Big qualitative palette', 'mpn65');

    addHeading("Paul Tol's palettes");
    add("Tol's qualitative palette (cbf)", 'tol');
    add("Tol's Diverging palette (cbf)", 'tol-dv');
    add("Tol's Sequential palette (cbf)", 'tol-sq');
    add("Tol's Rainbow palette (cbf)", 'tol-rainbow');

    ['sequential', 'diverging', 'qualitative'].forEach(function(type) {
      addHeading('ColorBrewer ' + type + ' palettes');
      palette.listSchemes('cb-' + type).forEach(function(scheme) {
        var title = scheme.scheme_name;
        if (scheme.cbf_max >= scheme.max) {
          title += ' (cbf)';
        } else if (scheme.cbf_max > 1) {
          title += ' (cbf if no more than ' + scheme.cbf_max + ' colours)';
        }
        add(title, scheme);
      });
    });

    addHeading('HSV rainbows');
    add('HSV Rainbow (s=1, v=1)', 'rainbow');
    add('HSV Rainbow (s=.5, v=1)', 'rainbow', 0.5);
    add('HSV Rainbow (s=1, v=.5)', 'rainbow', 1, 0.5);
    add('HSV Rainbow (s=.5, v=.5)', 'rainbow', 0.5, 0.5);

    addHeading('RGB gradients');
    add('Red', function(x) { return palette.rgbColor(x, 0, 0); });
    add('Green', function(x) { return palette.rgbColor(0, x, 0); });
    add('Blue', function(x) { return palette.rgbColor(0, 0, x); });
    add('Yellow', function(x) { return palette.rgbColor(x, x, 0); });
    add('Magenta', function(x) { return palette.rgbColor(x, 0, x); });
    add('Cyan', function(x) { return palette.rgbColor(0, x, x); });
    add('Grayscale', function(x) { return palette.rgbColor(x, x, x); });

    addHeading('Solarized palettes');
    add('Solarized base colours', 'sol-base');
    add('Solarized accent colours', 'sol-accent');
  };

  var el = document.getElementsByTagName('form')[0];
  el.addEventListener('input', regenerate, false);
  el.addEventListener('change', regenerate, false);
  regenerate();
})();
