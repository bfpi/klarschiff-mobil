m_require('app/controllers/MeldungController.js');

KsMobil.LobenHinweisenKritisierenPage = M.PageView.design({
    childViews: 'header content',

    header: M.ToolbarView.design({
        anchorLocation: M.TOP,
        childViews: 'backButton titleLabel',

        backButton: M.ButtonView.design({
            value: 'zurück',
            icon: 'arrow-l',
            anchorLocation: M.LEFT,
            events: {
                'tap': {
                    target: KsMobil.MeldungController,
                    action: 'backToMeldung'
                }
            }
        }),

        titleLabel: M.LabelView.design({
            anchorLocation: M.CENTER,
            value: 'Lob/Hinweis/Kritik'
        })
    }),

    content: M.ScrollView.design({
        childViews: 'email freitext datenschutz_title datenschutz actions',

        email: M.TextFieldView.design({
            inputType: M.INPUT_EMAIL,
            label: 'E-Mail-Adresse',
            initialText: 'Bitte geben Sie Ihre E-Mail-Adresse an.',
            cssClassOnInit: 'initial-text'
        }),

        freitext: M.TextFieldView.design({
            label: 'Freitext',
            hasMultipleLines: true,
            initialText: 'Bitte tragen Sie hier Ihr Lob, Ihre Hinweise oder Ihre Kritik zur Meldung ein.',
            cssClassOnInit: 'initial-text'
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

        actions: M.ButtonGroupView.design({
            anchorLocation: M.CENTER,
            childViews: 'senden abbrechen',

            senden: M.ButtonView.design({
                value: 'senden',
                events: {
                    tap: {
                        target: KsMobil.MeldungController,
                        action: 'lobHinweiseKritikSenden'
                    }
                }
            }),

            abbrechen: M.ButtonView.design({
                value: 'abbrechen',
                events: {
                    tap: {
                        target: KsMobil.MeldungController,
                        action: 'backToMeldung'
                    }
                }
            })
        })
    })
});
