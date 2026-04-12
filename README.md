# Rwanda Public Transportation App

A React-based web application providing information about public transportation services in Rwanda.

## Features

- **Bus Routes**: Information about major express bus routes across Rwanda
- **Taxi Services**: Details on share taxis (twegerane) and moto taxis
- **International Transport**: Coach services to neighboring countries
- **Urban Transport**: Public transport options in Kigali

## Transportation Overview

Rwanda's public transportation system includes:

- **Express Buses**: Main form of inter-city transport, operated by Ritco and private companies
- **Share Taxis**: Minibuses that wait until full before departing
- **Moto Taxis**: Motorcycle taxis for short distances, especially in urban areas
- **International Coaches**: Services to Uganda, Kenya, Tanzania, and Burundi

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Build

To build for production: `npm run build`

## Technologies Used

- React 18
- TypeScript
- Vite
- CSS

## Data Source

Information sourced from Wikipedia - Transport in Rwanda
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
