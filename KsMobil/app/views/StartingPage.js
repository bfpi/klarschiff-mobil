KsMobil.StartingPage = M.PageView.design({
    childViews: 'logo message',

    events: {
        pageshow: {
            target: KsMobil.AppController,
            action: 'init'
        }
    },

    logo: M.ImageView.design({
        value: 'theme/images/logo.png',
        cssClass: 'ks-logo'
    }),

    message: M.LabelView.design({
        value: 'Lade...',
        contentBinding: {
            target: KsMobil.AppController,
            property: 'message'
        },
        cssClass: 'message'
    })
});
