/**
 * KsMobil - Die Mobilanwendung von Klarschiff Rostock.
 *
 * @author Christian Wygoda <christian.wygoda@wheregroup.com>
 * @author Niels Bennke <bennke@bfpi.de>
 */

var KsMobil  = KsMobil || {};

KsMobil.version = M.Application.config['version'];

// set title to explaining displayName instead of autogenrated short app name
M.Application.name = M.Application.config['displayName'];

var baseUrl = M.Application.config['baseUrl'];
if(baseUrl == null || baseUrl == '') {
  baseUrl = window.location.protocol + '//' + window.location.hostname
}
if(baseUrl.match(/[^/]$/)) baseUrl = baseUrl + '/';

KsMobil.URLS = {
    versions:                 baseUrl + 'pc/frontend/getVersions.php',
    configuration:            baseUrl + 'pc/frontend/getConfig.php',
    onlineCheck:              baseUrl,
    impressum:                baseUrl + 'pc/impressum.php',

    icons:                    baseUrl + 'pc/images/icons/',
    meldungWFS:               baseUrl + 'ows/klarschiff/wfs',
    meldungWFSFeatureNS:      baseUrl + 'ows/klarschiff',

    pointCheck:               baseUrl + 'pc/php/point_check.php',
    meldungSubmit:            baseUrl + 'pc/php/meldung_submit.php',
    meldungSupport:           baseUrl + 'pc/php/meldung_support.php',
    meldungAbuse:             baseUrl + 'pc/php/meldung_abuse.php',
    meldungLobHinweiseKritik: baseUrl + 'pc/php/meldung_lobhinweisekritik.php',
    meldungImage:             baseUrl + 'fotos/',

    search:                   baseUrl + 'pc/search/server.php'
};

KsMobil.WFSOptions = {
    meldungWFSFeatureType:    'vorgaenge'
};

/**
 * Anwendungsklasse, definiert alle Seiten der Anwendung und die
 * Startseite.
 */

delete localStorage['configuration'];

KsMobil.app = M.Application.design({
    entryPage:                      'startingPage',
    startingPage:                   KsMobil.StartingPage,
    mapPage:                        KsMobil.MapPage,
    meldungPage:                    KsMobil.MeldungPage,
    unterstuetzenPage:              KsMobil.UnterstuetzenPage,
    missbrauchPage:                 KsMobil.MissbrauchPage,
    meldenPage:                     KsMobil.MeldenPage,
    lobenHinweisenKritisierenPage:  KsMobil.LobenHinweisenKritisierenPage,
    suchenPage:                     KsMobil.SuchenPage
});
