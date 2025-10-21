import PushNotification from 'react-native-push-notification';

export const configureNotifications = () => {

    PushNotification.configure({

        onNotification: function (notification: any) {

            // Handle notification tap

            console.log('NOTIFICATION:', notification);

        },

        requestPermissions: true,

    });

    PushNotification.createChannel(

        {

            channelId: 'wallet-reminders', // (required)

            channelName: 'Wallet Reminders', // (required)

            channelDescription: 'A channel for wallet reminders', // (optional)

            importance: 4,

            vibrate: true,

        },

        (created) => console.log(`createChannel returned '${created}'`)

    );

};

export const sendLocalNotification = (title: string, message: string) => {

    PushNotification.localNotification({

        channelId: 'wallet-reminders',

        title,

        message,

        playSound: true,

        soundName: 'default',

        importance: 'max',

        vibrate: true,

    });

};