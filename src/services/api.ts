export const BASE_URL = 'http://192.168.10.34:5000/api'; 

export const register = async (mobile: string, email: string, mpin: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ mobile, email, mpin}), 
    }); 
    return res.json();
};

export const login = async (mobile: string, mpin: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ mobile, mpin }), 
    }); 
    return res.json();
};

export const addExpense = async (mobile: string, category: string, amount: number, description: string, date?: string) => {
    const res = await fetch(`${BASE_URL}/expenses/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, category, date, description }),
    });
    return res.json();
}

export const getExpenses = async (mobile: string) => {
    const res = await fetch(`${BASE_URL}/expense/list/${mobile}`);
    return res.json();
}

export const setCategoryLimit = async (mobile: string, category: string, limit: number) => {

  const res = await fetch(`${BASE_URL}/limit/set`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, category, limit }),
  });
  return res.json();
};

export const checkCategoryLimit = async (mobile: string, category: string) => {
  const res = await fetch(`${BASE_URL}/limit/check/${mobile}/${category}`);
  return res.json();
};

export const addRecurringExpense = async (mobile: string, category: string, amount: number, frequency: string, description: string, nextDue: string) => {
  const res = await fetch(`${BASE_URL}/recurring/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, category, amount, frequency, description, nextDue }),
  });
  return res.json();
}

export const getRecurringExpenses = async (mobile: string) => {
  const res = await fetch(`${BASE_URL}/recurring/list/${mobile}`);
  return res.json();
}

export const getDueRecurringExpenses = async (mobile: string) => {
  const res = await fetch(`${BASE_URL}/recurring/due/${mobile}`);
  return res.json();
}

export const fetchPlaidTransactions = async (
  accessToken: string, 
  startDate: string, 
  endDate: string
) => {
  const res = await fetch(`${BASE_URL}/plaid/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: accessToken, start_date: startDate, end_date: endDate }),
  });
  return res.json();
}

export const setSpendingGoal = async (
  mobile: string,
  month: string,
  amount: number
) => {
  const res = await fetch(`${BASE_URL}/goals/set`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, month, amount }),
  });
  return res.json();
};

export const getSpendingGoal = async (
  mobile: string,
  month: string
) => {
  const res = await fetch(`${BASE_URL}/goals/get/${mobile}/${month}`);
  return res.json();
};