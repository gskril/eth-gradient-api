// setup basic express app
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log(`Your application is running at http://localhost:${port}`)
})

app.get('/', (req, res) => {
	res.send(`
    <p>gm</p>
    <p>add an address to the url to get your unique gradient avatar</p>
    <p>example: <a href="/0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5">/0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5</a></p>
  `)
})

app.get('/:address', (req, res) => {
	const address = req.params.address
	const hueSaturation = addressToColor(address)
	const color1 = `hsl(${hueSaturation}, 80%)`
	const color2 = `hsl(${hueSaturation}, 50%)`

	// Check for a valid Ethereum address
	if (
		address.length === 42 &&
		address.startsWith('0x') &&
		address.match(/[0-9]/g).length >= 5
	) {
		// Build SVG
		const svg = `
      <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="128" cy="128" r="128" fill="url(#gradient)"/>
        <defs>
          <radialGradient id="gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(39.5 143.5) rotate(51.809) scale(143.138)">
            <stop offset="0" stop-color="${color1}"/>
            <stop offset="1" stop-color="${color2}"/>
          </radialGradient>
        </defs>
      </svg>
    `
		res.statusCode = 200
		res.setHeader('Content-Type', `image/svg+xml`)
		res.setHeader(
			'Cache-Control',
			`public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
		)
		res.end(svg)
	} else {
		res.send({
			error: 'Invalid address',
		})
	}
})

const addressToColor = (address) => {
	// strip 0x from address
	const strippedAddress = address.replace('0x', '')

	// generate 2 numbers from the stripped address
	let hue = strippedAddress.charCodeAt(0)
	let saturation = strippedAddress.charCodeAt(1)

	// make sure the numbers are valid hsl values
	hue = hue > 360 ? 200 : hue
	saturation = saturation > 100 ? 100 : saturation

	return `${hue}, ${saturation}%`
}
