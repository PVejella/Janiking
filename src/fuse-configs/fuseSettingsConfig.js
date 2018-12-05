const fuseSettingsConfig = {
    layout          : {
        style : 'layout1',
        config: {
            scroll : 'content',
            navbar : {
                display : true,
                folded  : false,
                position: 'left'
            },
            toolbar: {
                display : true,
                style   : 'fixed',
                position: 'below'
            },
            footer : {
                display : true,
                style   : 'fixed',
                position: 'below'
            },
            leftSidePanel : {
                display : true,
            },
            rightSidePanel : {
                display : true,
            },
            mode   : 'fullwidth'
        }
    },
    customScrollbars: true,
    theme           : {
        main   : 'defaultDark',
        navbar : 'mainThemeDark',
        toolbar: 'defaultDark',
        footer : 'mainThemeDark'
    }
};

export default fuseSettingsConfig;