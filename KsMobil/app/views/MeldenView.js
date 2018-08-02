KsMobil.MeldenView = M.ScrollView.design({

    childViews: 'hauptkategorie unterkategorie email beschreibung'
        + ' foto datenschutz_title datenschutz hinweis aufforderung actions',

    /**
     * Pflichtangaben:
     *  Hauptkategorie
     *  Unterkategorie
     *  E-Mail-Adresse
     */

    hauptkategorie: M.SelectionListView.design({
        label: 'Hauptkategorie',
        selectionMode: M.SINGLE_SELECTION_DIALOG,
        initialText: 'auswählen…',
        contentBinding: {
            target: KsMobil.MeldungController,
            property: 'hauptkategorien'
        },
        events: {
            'change': {
                target: KsMobil.MeldungController,
                action: 'updateUnterkategorien'
            }
        }
    }),

    unterkategorie: M.SelectionListView.design({
        label: 'Unterkategorie',
        selectionMode: M.SINGLE_SELECTION_DIALOG,
        initialText: 'auswählen…',
        contentBinding: {
            target: KsMobil.MeldungController,
            property: 'unterkategorien'
        },
        events: {
            'change': {
                target: KsMobil.MeldungController,
                action: 'updateEingabehinweise'
            }
        }
    }),

    email: M.TextFieldView.design({
        inputType: M.INPUT_EMAIL,
        label: 'E-Mail-Addresse',
        initialText: 'Bitte geben Sie Ihre E-Mail-Adresse an.',
        cssClassOnInit: 'initial-text'
    }),

    /**
     * Optionale Angaben
     *  Beschreibung
     *  Foto
     */
    beschreibung: M.TextFieldView.design({
        label: 'Beschreibung',
        hasMultipleLines: true
    }),

    foto: M.View.design({
        html: '<label class="ui-input-text">Foto <span style="font-style:italic;color:#d81920">(Dateigröße maximal 4 MB!)</label>'
            + '<form>'
            + '<input name="foto" type="file" accept="image/png,image/jpeg" />'
            + '</form>'
    }),

    datenschutz_title: M.View.design({
        html: '<h4>Hinweis zum Datenschutz (bitte akzeptieren)</h4>'
    }),
    datenschutz: M.ToggleSwitchView.design({
        label: 'Ich willige hiermit in die <a href="https://www.greifswald.de/export/sites/hgw/de/datenschutzerklaerung/Datenschutzinformationen/3010_Datenschutzinformation-Klarschiff-HGW.pdf" target="_blank">Datenschutzerklärung</a> zur Nutzung des Angebotes „Klarschiff-HGW“ der Universitäts- und Hansestadt Greifswald ein und stimme der Verarbeitung der von mir freiwillig gemachten personengebundenen Angaben zu.',
        onLabel: 'akzeptiert',
        offLabel: 'nicht akzeptiert',
        cssClass: 'datenschutz'
    }),
    /**
     * Hinweis
     */
    hinweis: M.LabelView.design({
        value: '<b>Hinweis:</b> Vor der Veröffentlichung werden eingegebene Texte sowie das Foto redaktionell geprüft.',
        cssClass: "hinweis"
    }),

    aufforderung: M.LabelView.design({
        value: "* Pflichtangabe bei dieser Unterkategorie",
        cssClass: "aufforderung"
    }),

    /**
     * Buttons
     */
    actions: M.ButtonGroupView.design({
            anchorLocation: M.CENTER,
            childViews: 'submit cancel',

            submit: M.ButtonView.design({
                value: 'melden',
                events: {
                    'tap': {
                        target: KsMobil.MeldungController,
                        action: 'validateMeldung'
                    }
                }
            }),

            cancel: M.ButtonView.design({
                value: 'abbrechen',
                events: {
                    'tap': {
                        target: KsMobil.MeldungController,
                        action: 'meldenAbbrechen'
                    }
                }
            })
    })
})
