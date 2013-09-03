// For an introduction to the Split template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232447
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var nav = WinJS.Navigation;
    



    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
            }
            
            MyNotifications.setNotificationsOn;

            app.onsettings = function (e) {
                e.detail.applicationcommands = {
                    "about": {
                        href: "/pages/about/about.html",
                        title: "About"
                    }
                }

                WinJS.UI.SettingsFlyout.populateSettings(e);
            };


            if (app.sessionState.history) {

                nav.history = app.sessionState.history;
            }
            args.setPromise(WinJS.UI.processAll().then(function () {
                if (nav.location) {
                    nav.history.current.initialPlaceholder = true;
                    return nav.navigate(nav.location, nav.state);
                } else {
                    return nav.navigate(Application.navigator.home);
                }
            }));
        }
    });

    app.oncheckpoint = function (args) {
        app.sessionState.history = nav.history;
    };

    app.start();
})();
