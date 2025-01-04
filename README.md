# Rainfall Calendar

A visual calendar application that displays historical rainfall data in a year-at-a-glance format. The calendar helps users understand rainfall patterns through an intuitive heat-map style visualization where each day's cell color intensity represents the amount of rainfall.

## Features

- Multiple view levels (Year, Month, Week, Day)
- Heat-map style visualization of rainfall data
- Historical data from NOAA API
- Responsive design
- Unit toggle (mm/inches)
- Interactive navigation

## Prerequisites

- Node.js 18+
- NOAA API Token (sign up at https://www.ncdc.noaa.gov/cdo-web/token)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:
   ```
   VITE_NOAA_API_TOKEN=your_api_token_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- React 18+
- Vite
- TypeScript
- TailwindCSS
- Recharts
- date-fns
- Axios

## Project Structure

```
src/
├── components/
│   ├── Calendar/
│   ├── ColorScale/
│   ├── UnitToggle/
│   └── InfoPanel/
├── services/
├── types/
└── utils/
```

## License

MIT
