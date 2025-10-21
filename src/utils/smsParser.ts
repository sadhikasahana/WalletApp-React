import SmsAndroid from 'react-native-get-sms-android';

export const fetchBankSms = async (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const filter = {
      box: 'inbox',
      // The bodyRegex property uses a regular expression to match the content of the SMS body.
      bodyRegex: '(debited|spent|purchase|transaction)',
      minDate: Date.now() - 1000 * 60 * 60 * 24 * 30, // last 30 days
      maxCount: 50,
    } as const;

    SmsAndroid.list(
      filter,
      (fail: any) => reject(fail),
      (count: number, smsList: string) => {
        const messages = JSON.parse(smsList);
        resolve(messages);
      }
    );
  });
};

// Example parser for extracting amount and category from SMS body
export const parseExpenseFromSms = (smsBody: string) => {
  // Simple regex for amount (₹ or Rs or INR)
  const amountMatch = smsBody.match(/(?:₹|Rs\.?|INR)\s?([\d,]+(\.\d{1,2})?)/i);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;

  // Simple category detection (customize as needed)
  let category = 'Other';
  if (/food|restaurant|cafe/i.test(smsBody)) category = 'Food';
  else if (/stationery|book/i.test(smsBody)) category = 'Stationery';
  else if (/clothes|apparel/i.test(smsBody)) category = 'Clothes';
  else if (/medicine|pharmacy/i.test(smsBody)) category = 'Medicines';

  return { amount, category };
};
