# Money Processor

Accounting data processing based on plain-text files.

- [Requirements](#requirements)
- [Usage](#usage)
- [Data format](#dataformat)

## Requirements

- [Node.js](https://nodejs.org/en/)
- npm (included with Node.js)

## Usage

Run `npm start --silent` to output chart data or run `npm start -- --debug` to output parsed records data.

## Data Format

### Files

#### data/`YYYY`.csv

- **string** billing date - (e.g. `2000-01-01`)
- [**Source**](#sourceid) source - (e.g. `at.employer.salary`)
- [**Source**](#sourceid) [via] - (e.g. `us.processor`)
- [**Source**](#sourceid) destination - (e.g. `de.bank`)
- **number** amount - (e.g. `1000.00`)

#### data/sources.json

**Object**
- **string** category name - (e.g. `job`)
- **Object|string[]** subcategory (e.g. `salary`) or list of sources

#### data/statements.csv

- **string** billing date - (e.g. `2000-01-01`)
- [**Source**](#sourceid) source - (e.g. `de.bank`)
- **string** format - (e.g. `print`)
- **string** [billing number] - (e.g. `2000/01`)

### Source ID

See [RFC1035](https://tools.ietf.org/html/rfc1035).
