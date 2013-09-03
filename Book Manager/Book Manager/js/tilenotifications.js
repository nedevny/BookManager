(function () {

    var notificator = WinJS.Class.define(function () {

    }, {

    }, {
        setNotifications: function () {
            var notifications = Windows.UI.Notifications;
            notifications.TileUpdateManager.createTileUpdaterForApplication().enableNotificationQueue(true);

            notifications.TileUpdateManager.createTileUpdaterForApplication().clear();

            var template = notifications.TileTemplateType.tileWideText03;
            var tileXml = notifications.TileUpdateManager.getTemplateContent(template);
            var tileTextAttributes = tileXml.getElementsByTagName("text");
            tileTextAttributes[0].appendChild(tileXml.createTextNode("Organize your books"));
            var tileNotification = new notifications.TileNotification(tileXml);
            notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);

            template = notifications.TileTemplateType.tileWideText03;
            tileXml = notifications.TileUpdateManager.getTemplateContent(template);
            tileTextAttributes = tileXml.getElementsByTagName("text");
            tileTextAttributes[0].appendChild(tileXml.createTextNode("Book Manager"));
            tileNotification = new notifications.TileNotification(tileXml);
            notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);

            template = notifications.TileTemplateType.tileWideText03;
            tileXml = notifications.TileUpdateManager.getTemplateContent(template);
            tileTextAttributes = tileXml.getElementsByTagName("text");
            tileTextAttributes[0].appendChild(tileXml.createTextNode("Easy access to your books"));
            tileNotification = new notifications.TileNotification(tileXml);
            notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
        }
    });

    WinJS.Namespace.define("MyNotifications", {
        setNotificationsOn: notificator.setNotifications()
    })
})()