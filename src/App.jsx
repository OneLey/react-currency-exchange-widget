import React, { useState } from 'react'
import './index.css'

//https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD

const API_URL = 'https://api.frankfurter.dev'

function App() {
	const [currencyFrom, setCurrencyFrom] = useState('USD')
	const [currencyTo, setCurrencyTo] = useState('EUR')
	const [amount, setAmount] = useState(null)
	const [converted, setConverted] = useState(null)
	const [rates, setRates] = useState([])
	const [error, setError] = useState(null)
	const [isLoading, setLoading] = useState(false)
	const [prevCurFrom, setPrevCurFrom] = useState('USD')
	const [prevCurTo, setPrevCurTo] = useState('EUR')

	useState(() => {
		async function loadCurrency() {
			try {
				const res = await fetch(`${API_URL}/v1/latest`)

				const data = await res.json()
				setRates(Object.keys(data.rates))
				setError(null)
			} catch (err) {
				setError('Failed to fetch currency')
				setConverted(null)
			}
		}
		loadCurrency()
	}, [])

	async function handleExchange() {
		setLoading(true)
		setConverted(null)
		try {
			const res = await fetch(
				`${API_URL}/v1/latest?amount=${amount}&from=${currencyFrom}&to=${currencyTo}`
			)

			if (!res.ok) {
				setError('Server error')
			}

			const data = await res.json()
			setConverted(data.rates[currencyTo])
			setError(null)
			setPrevCurFrom(currencyFrom)
			setPrevCurTo(currencyTo)
		} catch (err) {
			setError('Failed to convert currency')
			console.log(err)
			setConverted(null)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='app'>
			<h1>Currency Exchange Calculator</h1>

			<div className='converter-container'>
				{error && <p className='error'>{error}</p>}

				<div className='input-group'>
					<input
						type='number'
						placeholder='Amount'
						className='input-field'
						value={amount}
						onChange={e => setAmount(e.target.value)}
					/>
					<select
						className='dropdown'
						onChange={e => setCurrencyFrom(e.target.value)}
						value={currencyFrom}
					>
						{rates.map(item => (
							<option value={item} key={item}>
								{item}
							</option>
						))}
						<option value='EUR' key='EUR'>
							EUR
						</option>
					</select>
					<span className='arrow'>→</span>
					<select
						className='dropdown'
						onChange={e => setCurrencyTo(e.target.value)}
						value={currencyTo}
					>
						{rates.map(item => (
							<option value={item} key={item}>
								{item}
							</option>
						))}
						<option value='EUR' key='EUR'>
							EUR
						</option>
					</select>
				</div>
				<button className='convert-button' onClick={() => handleExchange()}>
					Convert
				</button>
				{isLoading && <p className='loading'>Converting...</p>}

				{amount > 0 && converted > 0 && (
					<p className='result'>
						{amount} {prevCurFrom} = {converted.toFixed(2)} {prevCurTo}
					</p>
				)}
			</div>
		</div>
	)
}

export default App
