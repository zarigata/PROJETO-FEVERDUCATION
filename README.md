# FeverDucation

FeverDucation is an AI-powered teaching platform that revolutionizes education for both teachers and students.

## Features

- **Teacher Dashboard**: Analytics, class management, and student tracking
- **AI Class Generator**: Create engaging lessons in seconds
- **AI Homework Builder**: Generate personalized assignments
- **Student Portal**: Access classes, quizzes, and learning materials
- **AI Tutor**: 24/7 learning assistance for students

## Tech Stack

- Next.js
- React
- Tailwind CSS
- shadcn/ui components

## Deployment

### Local Development

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/fevereducation.git
   cd fevereducation
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages:

1. Push your changes to the main branch:
   \`\`\`bash
   git push origin main
   \`\`\`

2. The GitHub Actions workflow will automatically build and deploy the site.

3. Your site will be available at `https://yourusername.github.io/fevereducation/`

## Configuration

To customize the GitHub Pages deployment, edit the `next.config.mjs` file:

\`\`\`javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Update this to match your repository name
  basePath: process.env.NODE_ENV === 'production' ? '/fevereducation' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/fevereducation/' : '',
  trailingSlash: true,
}
\`\`\`

## Demo Credentials

- **Email**: demo@fevereducation.com
- **Password**: password

## License

MIT
