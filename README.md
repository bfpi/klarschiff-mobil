# Mobiles Frontend für *Klarschiff*

Das mobile Frontend für *Klarschiff,* einer Onlineplattform zum Melden und Bearbeiten von Problemen und Ideen, ist eine HTML5-/JavaScript-Anwendung, basierend auf folgenden Frameworks und Bibliotheken:

*   [**The-M-Project**](http://www.the-m-project.org): auf [jQuery](https://jquery.com) basierendes MVC-Framework für HTML5-/JavaScript-Anwendungen
*   [**OpenLayers**](http://openlayers.org): JavaScript-Mapping-Framework
*   [**Proj4js**](https://github.com/proj4js/proj4js): JavaScript-Bibliothek zur Transfomation von Koordinaten

Die Anwendung wird mit dem Werkzeug [**Espresso**](https://github.com/mwaylabs/Espresso) erzeugt.

## Verzeichnis- und Dateienstruktur

*   **KsMobil:** Anwendungsquellen
*   **node\_modules/espresso:** via [**npm**](https://www.npmjs.com) installiertes Paket von [Espresso](https://github.com/mwaylabs/Espresso) zur Bereitstellung der Build-Umgebung sowie der notwendigen Ressourcen für [The-M-Project](http://www.the-m-project.org) (da die Integration als Git-Submodul leider nicht mit allen enthaltenen Referenzen funktioniert)
*   **OpenLayers:** Git-Submodul zur Bereitstellung der Build-Umgebung für eine angepasste OpenLayers.js
*   **proj4js:** Git-Submodul für die aktuellen [Proj4js](https://github.com/proj4js/proj4js)-Quellen
*   **ksmobil.openlayers.build.cfg:** Konfigurationsdatei für ein individuelles [OpenLayers](http://openlayers.org)-Build
*   **package.json:** Konfigurationsdatei für die Installation von [Espresso](https://github.com/mwaylabs/Espresso) via [npm](https://www.npmjs.com)

## Einrichtung der Build- und Entwicklungsumgebung

### Voraussetzungen

Zur Installation und Anwendung der Build- und Entwicklungsumgebung werden [**Node.js**](http://nodejs.org) >= 0.10 und [npm](https://www.npmjs.com) benötigt. Letzteres wird in der Regel durch die Installation von [Node.js](http://nodejs.org) bereitgestellt.

### Installation der Build- und Entwicklungsumgebung

1.  Anwendung aus dem Git-Repository klonen:

        git clone https://github.com/rostock/klarschiff-mobil /Pfad/zum/Anwendungsverzeichnis
        
1.  in das Anwendungsverzeichnis wechseln und Git-Submodule herunterladen sowie installieren:

        git submodule update --init --recursive

1.  gegebenenfalls Proxy für [npm](https://www.npmjs.com) setzen:
    
        npm config set proxy http://meine-proxy-domain:mein-proxy-port
        npm config set https-proxy http://meine-proxy-domain:mein-proxy-port

1.  [Espresso](https://github.com/mwaylabs/Espresso) via [npm](https://www.npmjs.com) installieren:

        npm install

1.  Alias zum vereinfachten Aufruf von [Espresso](https://github.com/mwaylabs/Espresso) erzeugen:

        alias espresso=`pwd`/node_modules/espresso/bin/espresso.js

## Erzeugung des Builds

Um ein neues Build aus den aktuellen Anwendungsquellen zu erzeugen, wird im Verzeichnis `Anwendungsverzeichnis/KsMobil` das [Espresso](https://github.com/mwaylabs/Espresso)-Build-Tool benutzt:

    espresso build

Das fertige Build wird dann automatisch im Verzeichnis `Anwendungsverzeichnis/KsMobil/build/{version}` abgelegt. Beim Deployment auf einem Webserver ist darauf zu achten, dass Proxies entsprechend der Proxy-Konfiguration in der Datei `Anwendungsverzeichnis/KsMobil/config.json` angelegt werden!

## Integration neuer Versionen der Frameworks und Bibliotheken

### The-M-Project

Leider gibt es zur Zeit noch keinen Weg das Framework via Werkzeug oder [Espresso](https://github.com/mwaylabs/Espresso) zu aktualisieren. Wenn also eine neue Version des Framworks integriert werden soll, muss hierzu wie folgt vorgegangen werden:

1.  in das Anwendungsverzeichnis wechseln und neuere Version von [Espresso](https://github.com/mwaylabs/Espresso) im Wurzelverzeichnis installieren (die vorhandene Version wird dabei überschrieben):

        npm install espresso@x.y.z

1.  aktuelles Framwork-Verzeichnis im Projekt durch jenes aus der neuen [Espresso](https://github.com/mwaylabs/Espresso)-Version ersetzen:

        rm -rf Anwendungsverzeichnis/KsMobil/frameworks/The-M-Project
        cp -R Anwendungsverzeichnis/node_modules/espresso/frameworks/The-M-Project Anwendungsverzeichnis/KsMobil/frameworks/

### OpenLayers

Wenn eine neue Version von [OpenLayers](http://openlayers.org) verwendet werden soll, muss hierzu das zugehörige Git-Submodul aktualisiert werden. Anschließend kann dann eine neue Bibliotheksversion für `Anwendungsverzeichnis/KsMobil` erzeugt werden. In der Datei `Anwendungsverzeichnis/ksmobil.openlayers.build.cfg` ist hierfür eine [OpenLayers](http://openlayers.org)-Build-Konfiguration abgelegt, mit der ein angepasstes [OpenLayers](http://openlayers.org) erstellt werden kann. Dazu muss das Build-Skript unter `Anwendungsverzeichnis/OpenLayers/build/build.py` mit dieser Konfiguration ausgeführt werden. Die Ausgabe sollte in das zugehörige Framework-Verzeichnis erfolgen.  Der Aufruf muss allerdings zwingend aus dem Verzeichnis `Anwendungsverzeichnis/OpenLayers/build` heraus erfolgen:

    cd Anwendungsverzeichnis/OpenLayers/build
    build.py ../../ksmobil.openlayers.build.cfg ../../KsMobil/frameworks/OpenLayers/OpenLayers.js

### Proj4js

Zur Zeit gestalltet sich die Integration einer neueren Version dieser JavaScript-Bibliothek sehr schwierig, da [OpenLayers](http://openlayers.org) aktuell nur Versionen <= 1.1.0 zu unterstützen scheint. Diese alten Version sind noch in einem SVN-Repository verwaltet (ab Version 1.3.0 erfolgte dann der Umzug auf GitHub). Die hier eingebundene Version wurde direkt von `http://svn.osgeo.org/metacrs/proj4js/tags/proj4js-1.1.0/lib/proj4js-compressed.js` geladen. 

Ab [OpenLayers 3](http://openlayers.org) scheint aber eine Unterstützung für die neueren Versionen von [Proj4js](https://github.com/proj4js/proj4js) geplant zu sein. Sobald dies erfolgt ist, könnte man [Proj4js](https://github.com/proj4js/proj4js) als Git-Submodul einbinden und sich die Aktualisierungen von dort aus dem entsprechenden `dist`-Verzeichnis ins Projekt kopieren:

    cp Anwendungsverzeichnis/proj4js/dist/proj4.js Anwendungsverzeichnis/KsMobil/frameworks/proj4js

## Verzeichnis- und Dateienstruktur innerhalb der Anwendung

*   **KsMobil/config.json:** Konfigurationsdatei des [Espresso](https://github.com/mwaylabs/Espresso)-Build-Tools. Dies ist eine JSON-Datei, daher müssen Anführungszeichen der Form " verwendet werden!
*   **KsMobil/build:** Build-Verzeichnis. Hier werden statische Builds der Anwendung vom [Espresso](https://github.com/mwaylabs/Espresso)-Build-Tool abgelegt. Die einzelnen Builds werden in Verzeichnissen abgelegt, entsprechend der Konfigurationsangbe in der `config.json`. Die Builds werden nicht im Repository geführt.
*   **KsMobil/frameworks:** Framework-Verzeichnis. Hier liegen die verwendeten Frameworks der Anwendung, das sind [The-M-Project](http://www.the-m-project.org) (inklusive [**jQuery Mobile**](https://jquerymobile.com)), [OpenLayers](http://openlayers.org), [Proj4js](https://github.com/proj4js/proj4js) und ein Framework zur Bereitstellung des statischen Impressums.
*   **KsMobil/app:** Anwendungsquellen. Das eigentliche Verzeichnis der Anwendungsquellen.
*   **KsMobil/app/main.js:** Anwendungsdefinition. Hier wird die Anwendung an sich definiert, das heißt alle Anwendungsseiten sowie die Auswahl der Startseite.
*   **KsMobil/app/controllers:** Controller. Hier liegen die Controller-Klassen der Anwendung.
*   **KsMobil/app/controllers/AppController.js:** Anwendungscontroller. Dieser wird beim Start der Anwendung geladen, um die Aktualität der Anwendung zu überprüfen. Dazu wird ein AJAX-Request an die `getVersions.php` abgeschickt. Stellt der Controller fest, dass Code und/oder Konfiguration andere Versionen als die vom Server aufweisen, werden Code und/oder Konfiguration neu geladen. Der Code wird im Cache gespeichert, die Konfiguration im Local Storage. Nach der Prüfung wird die Kartenseite angezeigt.
*   **KsMobil/app/controllers/MapController.js:** Kartencontroller. Dieser steuert die Konfiguration der [OpenLayers](http://openlayers.org)-Karte, den Basiskartenwechsel, die Zoom-Aktionen, die Abwahl aller selektierten Features sowie die Suche und die Größenanpassung der Karte an den Viewport (Berechnung der Kartenhöhe minus der Toolbars).
*   **KsMobil/app/controllers/MeldungController.js:** Meldungscontroller. Dieser steuert alle Aktionen rund um die Meldungen. Der Controller fügt den Layer zum Zeichnen neuer Features zur Karte hinzu. Er steuert darüberhinaus unter anderem die Navigation zwischen den verschiedenen Seiten beim Auswählen eines Features, bei der Unterstützungs- und Missbrauchsmeldung und beim Absetzen einer neuen Meldung. Die Eingabevalidierung für neue Meldungen ist  ebenfalls in diesem Controller definiert.
*   **KsMobil/app/resources/base/style.css:** Stylesheet der Anwendung.
*   **KsMobil/app/resources/base/images/:** Bilder für die Anwendung.
*   **KsMobil/views:** Views. Hier sind die Views der Anwendung hinterlegt. Diese umfassen sowohl Pages, die einzelne Seiten der Anwendung in ihrer Gesamtheit definieren, als auch Views, die einzelne, speziell angepasste Teile von Seiten definieren.
*   **KsMobil/views/MapPage.js:** Kartenseite. Diese definiert die Kartenansicht der Anwendung.
*   **KsMobil/views/MapView.js:** Karten-View. Dieser definiert einen auf [OpenLayers](http://openlayers.org) basierenden View, der in der Kartenseite verwendet wird.
*   **KsMobil/views/MeldenPage.js:** Definiert die Seite, die für eine neue Meldung angezeigt wird.
*   **KsMobil/views/MeldenView.js:** Definiert den View, der das Formular für eine neue Meldung umsetzt.
*   **KsMobil/views/MissbrauchPage.js:** Definiert die Seite, die die  Missbrauchsmeldung darstellt.
*   **KsMobil/views/StartingPage.js:** Startseite.
*   **KsMobil/views/UnterstuetzenPage.js:** Definiert die Seite, die die Unterstützungsmeldung anzeigt.