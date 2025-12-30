# Trishal Reddy Indireddy - Portfolio Website

A modern, interactive portfolio website showcasing software development projects, experience, and skills. Built with React, TypeScript, and Vite, featuring an F1-inspired design theme with dynamic animations and backgrounds.

## 🚀 Features

- **Modern Tech Stack**: Built with React 19, TypeScript, and Vite for optimal performance
- **F1-Inspired Design**: Racing-themed UI with dynamic backgrounds and animations
- **Interactive Sections**:
  - Hero section with animated text effects
  - About section with portrait reveal animations
  - Education timeline
  - Experience timeline
  - Projects grid with detailed descriptions
  - Startups showcase
  - Skills display
  - Extracurriculars
  - Contact information
- **Responsive Design**: Fully responsive layout that works on all devices
- **Smooth Animations**: Powered by Framer Motion for fluid transitions
- **WebGL Effects**: Advanced shader-based animations for portrait reveals
- **Performance Optimized**: Fast loading times and smooth scrolling

## 🛠️ Tech Stack

### Core
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Features
- **WebGL** - Advanced graphics for portrait reveals
- **Custom Shaders** - GLSL shaders for visual effects

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Trishal portfolio"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Build

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── about/           # About section components
│   ├── background/      # Background animation components
│   ├── backgrounds/    # Various background effects
│   ├── layout/         # Layout components (Navbar, Footer)
│   ├── sections/       # Main page sections
│   └── ui/             # Reusable UI components
├── data/               # Data files (profile, skills)
├── hooks/              # Custom React hooks
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🎨 Customization

### Updating Profile Information

Edit `src/data/profile.ts` to update:
- Personal information (name, tagline, about)
- Contact details
- Experience entries
- Education history
- Projects
- Startups
- Skills
- Extracurriculars

### Styling

The project uses Tailwind CSS. Custom styles can be added in:
- `src/index.css` - Global styles
- Component-level Tailwind classes
- Custom CSS variables for theming

## 🚦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 License

This project is private and proprietary.

## 👤 Author

**Trishal Reddy Indireddy**
- Email: tindireddy@binghamton.edu
- LinkedIn: [thrishalreddy-i-4089a8207](https://www.linkedin.com/in/thrishalreddy-i-4089a8207/)
- GitHub: [trishal02](https://github.com/trishal02)

## 🌐 Deployment

The portfolio can be deployed to any static hosting service:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

Simply run `npm run build` and deploy the `dist` folder.

---

Built with ❤️ using React, TypeScript, and Vite
