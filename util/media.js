/**
 * Responsive media query callbacks
 * @see https://developer.mozilla.org/en-US/docs/DOM/Using_media_queries_from_code
 */
define(['nbd/util/extend', 'nbd/trait/pubsub'], function(extend, pubsub) {
  'use strict';

  var queries = {},
  mqChange,
  matchMedia = window.matchMedia || window.msMatchMedia;

  function bindMedia( breakpoint, query ) {
    var match = window.matchMedia( query );
    queries[breakpoint] = match;
    match.addListener( mqChange.bind(match, breakpoint) );
    if (match.matches) { mqChange.call(match, breakpoint); }
  }

  function isActive(breakpoint) {
    return queries[breakpoint] && queries[breakpoint].matches;
  }

  function media( options, query ) {
    var breakpoint;

    // No matchMedia support
    if ( !matchMedia ) {
      throw new Error('Media queries not supported.');
    }

    // Has matchMedia support
    if ( typeof options === 'string' ) {
      bindMedia( options, query );
      return media;
    }

    if ( typeof options === 'object' ) {
      for (breakpoint in options) {
        if (options.hasOwnProperty(breakpoint)) {
          query = options[breakpoint];
          bindMedia( breakpoint, query );
        }
      }
    }
    return media;

  }

  extend(media, pubsub);

  mqChange = function(breakpoint) {
    media.trigger(breakpoint + (this.matches ? ':enter' : ':exit'));
    media.trigger(breakpoint, this.matches);
  };

  media.is = isActive;
  media.getState = function(breakpoint) {
    if ( breakpoint ) {
      return isActive(breakpoint);
    }

    return Object.keys(queries).filter(isActive);
  };

  return media;

});
