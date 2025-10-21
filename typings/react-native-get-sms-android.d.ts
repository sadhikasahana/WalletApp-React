declare module 'react-native-get-sms-android' {
    interface SMS {
        _id: number;
        address: string;
        body: string;
        date: number;
        read: number;
    }

    interface FilterOptions {
        box?: 'inbox' | 'sent';
        address?: string;
        body?: string;
        indexFrom?: number;
        maxCount?: number;
    }

    const SmsAndroid: {
        list(
            filter: FilterOptions,
            errorCallback: (error: string) => void,
            successCallback: (count: number, smsList: string) => void
        ): void;

        'delete'(
            smsId: number,
            errorCallback: (error: string) => void,
            successCallback: (success: string) => void
        ): void;
    };

    export default SmsAndroid;
}
