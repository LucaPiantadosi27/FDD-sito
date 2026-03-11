/**
 * Global configuration for the FDD API.
 * In a static site, this acts as our "environment variables".
 *
 * Development:  http://127.0.0.1:8000  (Laravel local server)
 * Production:   https://fiorideldeserto.itsoftsrl.it
 */
(function () {
  var DEV_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0'];
  var isDev = DEV_HOSTS.indexOf(window.location.hostname) !== -1;

  window.env = {
    IS_DEV:  isDev,
    API_URL: isDev
      ? 'http://127.0.0.1:8000/api'
      : 'https://fiorideldeserto.itsoftsrl.it/api',
  };
})();
