function assert(condition, opt_message) {if (!condition) {let message = 'Assertion failed';if (opt_message) {message = message + ': ' + opt_message;}const error = new Error(message);const global = function() {const thisOrSelf = this || self;thisOrSelf.traceAssertionsForTesting;return thisOrSelf;}();if (global.traceAssertionsForTesting) {console.warn(error.stack);}throw error;}return condition;}
function assertNotReached(opt_message) {
      assert(false, opt_message || 'Unreachable code hit');
    }
function assertInstanceof(value, type, opt_message) {
      if (!(value instanceof type)) {
        assertNotReached(
            opt_message ||
            'Value ' + value + ' is not a[n] ' + (type.name || typeof type));
      }
      return value;
    }
function $(id) {
      const el = document.getElementById(id);
      return el ? assertInstanceof(el, HTMLElement) : null;
    }
function getSVGElement(id) {
      const el = document.getElementById(id);
      return el ? assertInstanceof(el, Element) : null;
    }
function getDeepActiveElement() {
      let a = document.activeElement;
      while (a && a.shadowRoot && a.shadowRoot.activeElement) {
        a = a.shadowRoot.activeElement;
      }
      return a;
    }
function findAncestorByClass(el, className) {
      return /** @type {Element} */ (findAncestor(el, function(el) {
        return el.classList && el.classList.contains(className);
      }));
    }
function findAncestor(node, predicate) {
      let last = false;
      while (node != null && !(last = predicate(node))) {
        node = node.parentNode;
      }
      return last ? node : null;
    }
function disableTextSelectAndDrag(
        opt_allowSelectStart, opt_allowDragStart) {
      document.onselectstart = function(e) {
        if (!(opt_allowSelectStart && opt_allowSelectStart.call(this, e))) {
          e.preventDefault();
        }
      };
      document.ondragstart = function(e) {
        if (!(opt_allowDragStart && opt_allowDragStart.call(this, e))) {
          e.preventDefault();
        }
      };
    }
function isRTL() {
      return document.documentElement.dir == 'rtl';
    }
	function getRequiredElement(id) {
      return assertInstanceof(
          $(id), HTMLElement, 'Missing required element: ' + id);
    }
function queryRequiredElement(selectors, opt_context) {
      const element = (opt_context || document).querySelector(selectors);
      return assertInstanceof(
          element, HTMLElement, 'Missing required element: ' + selectors);
    }
    ['click', 'auxclick'].forEach(function(eventName) {
      document.addEventListener(eventName, function(e) {
        if (e.button > 1) {
          return;
        }
        if (e.defaultPrevented) {
          return;
        }
    
        const eventPath = e.path;
        let anchor = null;
        if (eventPath) {
          for (let i = 0; i < eventPath.length; i++) {
            const element = eventPath[i];
            if (element.tagName === 'A' && element.href) {
              anchor = element;
              break;
            }
          }
        }
        let el = e.target;
        if (!anchor && el.nodeType == Node.ELEMENT_NODE &&
            el.webkitMatchesSelector('A, A *')) {
          while (el.tagName != 'A') {
            el = el.parentElement;
          }
          anchor = el;
        }
    
        if (!anchor) {
          return;
        }
    
        anchor = /** @type {!HTMLAnchorElement} */ (anchor);
        if ((anchor.protocol == 'file:' || anchor.protocol == 'about:') &&
            (e.button == 0 || e.button == 1)) {
          chrome.send('navigateToUrl', [
            anchor.href, anchor.target, e.button, e.altKey, e.ctrlKey, e.metaKey,
            e.shiftKey
          ]);
          e.preventDefault();
        }
      });
    });
function appendParam(url, key, value) {
      const param = encodeURIComponent(key) + '=' + encodeURIComponent(value);
      if (url.indexOf('?') == -1) {
        return url + '?' + param;
      }
      return url + '&' + param;
    }
function createElementWithClassName(type, className) {
      const elm = document.createElement(type);
      elm.className = className;
      return elm;
    }
function ensureTransitionEndEvent(el, opt_timeOut) {
      if (opt_timeOut === undefined) {
        const style = getComputedStyle(el);
        opt_timeOut = parseFloat(style.transitionDuration) * 1000;
        opt_timeOut += 50;
      }
      let fired = false;
      el.addEventListener('transitionend', function f(e) {
        el.removeEventListener('transitionend', f);
        fired = true;
      });
      window.setTimeout(function() {
        if (!fired) {
          cr.dispatchSimpleEvent(el, 'transitionend', true);
        }
      }, opt_timeOut);
    }
function scrollTopForDocument(doc) {
      return doc.documentElement.scrollTop || doc.body.scrollTop;
    }
function setScrollTopForDocument(doc, value) {
      doc.documentElement.scrollTop = doc.body.scrollTop = value;
    }
	function scrollLeftForDocument(doc) {
      return doc.documentElement.scrollLeft || doc.body.scrollLeft;
    }
function setScrollLeftForDocument(doc, value) {
      doc.documentElement.scrollLeft = doc.body.scrollLeft = value;
    }
 function HTMLEscape(original) {
      return original.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
    }
function elide(original, maxLength) {
      if (original.length <= maxLength) {
        return original;
      }
      return original.substring(0, maxLength - 1) + '\u2026';
    }
function quoteString(str) {
      return str.replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:])/g, '\\$1');
    }
function listenOnce(target, eventNames, callback) {
      if (!Array.isArray(eventNames)) {
        eventNames = eventNames.split(/ +/);
      }
    
      const removeAllAndCallCallback = function(event) {
        eventNames.forEach(function(eventName) {
          target.removeEventListener(eventName, removeAllAndCallCallback, false);
        });
        return callback(event);
      };
    
      eventNames.forEach(function(eventName) {
        target.addEventListener(eventName, removeAllAndCallCallback, false);
      });
    }
function hasKeyModifiers(e) {
      return !!(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
    }
    function isTextInputElement(el) {
      return el.tagName == 'INPUT' || el.tagName == 'TEXTAREA';
    }