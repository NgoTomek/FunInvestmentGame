# Portfolio Panic!

An arcade-style financial market reaction game where players respond to market news and adjust their portfolios to maximize returns.

## Game Features

- Real-time market reactions to financial news
- Multiple asset classes (stocks, bonds, gold, crypto, real estate)
- Three difficulty levels and game modes
- Achievement system and leaderboard
- Dark/light theme toggle
- Engaging cartoonish visuals

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/portfolio-panic.git
   cd portfolio-panic
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Deployment

The game is set up for deployment with Firebase Hosting:

1. Install Firebase CLI
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase
   ```
   firebase login
   ```

3. Initialize Firebase (if not already done)
   ```
   firebase init
   ```

4. Build the project
   ```
   npm run build
   ```

5. Deploy to Firebase
   ```
   firebase deploy
   ```

## Built With

- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide React](https://lucide.dev/) - Icon set
- [Firebase](https://firebase.google.com/) - Hosting platform

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- Inspired by financial market simulators and arcade games
- Educational tool for understanding market dynamics