# Readable - AI-Powered Article Discovery

A modern web application that provides seamless article discovery through AI-powered voice search. Simply speak what you're looking for and let our intelligent system find the perfect content for you.

## Features

- **Voice-Powered Search**: Use your voice to search for articles instead of typing
- **AI-Powered Discovery**: Intelligent content matching based on your spoken queries
- **Modern UI**: Clean, responsive design built with React and Tailwind CSS
- **Real-time Processing**: Instant search results and content recommendations

## Technologies Used

This project is built with modern web technologies:

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Build Tool**: Vite for fast development and building
- **Routing**: React Router for navigation
- **State Management**: TanStack Query for server state

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd readable-ai-article-discovery
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── Hero.tsx        # Landing page hero section
│   ├── Navigation.tsx  # Main navigation component
│   └── HowItWorks.tsx  # Feature explanation section
├── pages/              # Page components
│   ├── Index.tsx       # Home page
│   └── NotFound.tsx    # 404 page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── main.tsx           # Application entry point
```

## Customization

The application uses a custom design system with CSS variables for easy theming. You can customize:

- Colors in `src/index.css`
- Component styles in individual component files
- Layout and spacing using Tailwind CSS classes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or need help, please open an issue in the repository or contact the development team.