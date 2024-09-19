const apiKey = 'YOUR_API_KEY';
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

document.addEventListener('DOMContentLoaded', async () => {
	const fromCurrency = document.getElementById('fromCurrency');
	const toCurrency = document.getElementById('toCurrency');

	try {
		const response = await fetch(apiUrl);
		const data = await response.json();
		const currencies = Object.keys(data.conversion_rates);

		currencies.forEach(currency => {
			const option1 = document.createElement('option');
			option1.value = currency;
			option1.textContent = currency;
			fromCurrency.appendChild(option1);

			const option2 = document.createElement('option');
			option2.value = currency;
			option2.textContent = currency;
			toCurrency.appendChild(option2);
		});
	} catch (error) {
		console.error('Error fetching currency data:', error);
	}
});

document.getElementById('converterForm').addEventListener('submit', async function(event) {
	event.preventDefault();

	const amount = document.getElementById('amount').value;
	const fromCurrency = document.getElementById('fromCurrency').value;
	const toCurrency = document.getElementById('toCurrency').value;
	const resultDiv = document.getElementById('result');

	try {
		const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`);
		const data = await response.json();
		const convertedAmount = data.conversion_result;

		resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
	} catch (error) {
		resultDiv.textContent = 'Error converting currency';
		console.error('Error converting currency:', error);
	}
});