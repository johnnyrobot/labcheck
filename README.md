# LabCheck - Modern Student Sign-In System

A beautiful, modern Progressive Web App (PWA) for student sign-in and attendance tracking, built with React, shadcn/ui, and Tailwind CSS.

![LabCheck Screenshot](https://via.placeholder.com/800x400/8b5cf6/ffffff?text=LabCheck+PWA)

## ✨ Features

### 🎨 Modern Design
- **Beautiful shadcn/ui components** with consistent design system
- **Stunning gradient backgrounds** and professional styling
- **Responsive design** that works on all devices
- **Dark/light theme support** (coming soon)

### 📱 Progressive Web App
- **Installable** on mobile and desktop devices
- **Offline functionality** with service worker caching
- **Fast loading** with optimized assets
- **App-like experience** with standalone display mode

### 🎓 Student Management
- **CSV roster upload** for easy student import
- **Real-time sign-in/sign-out** tracking
- **Visual student dashboard** with status indicators
- **Manual sign-in** option for flexibility
- **Export functionality** for attendance records

### 💾 Local Data Storage
- **No backend required** - all data stored locally
- **Privacy-focused** - data never leaves the device
- **Persistent storage** using LocalForage
- **Easy data export** for backup and analysis

### 🐳 Production Ready
- **Docker containerized** for easy deployment
- **Nginx optimized** for PWA serving
- **Health checks** and monitoring
- **Security headers** and best practices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional, for containerized deployment)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/labcheck.git
   cd labcheck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Production Deployment

#### Using Docker

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   ```
   http://localhost:1738
   ```

#### Manual Build

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Serve the built files**
   ```bash
   npm run preview
   ```

## 📖 Usage Guide

### Setting Up a Class Session

1. **Configure Class Information**
   - Enter class name, week, and day
   - Information is automatically saved locally

2. **Upload Student Roster**
   - Click "Upload Roster" button
   - Select a CSV file with student names and IDs
   - Preview and confirm the upload

3. **Manage Student Sign-ins**
   - Use the "Student Dashboard" tab for visual management
   - Use the "Manual Sign-In" tab for direct entry
   - Students appear with color-coded status indicators

4. **Export Data**
   - Click "Export Data" to download attendance records
   - Data is exported as a ZIP file with CSV format

5. **Start New Session**
   - Click "Start New Session" to clear all data
   - Perfect for starting a new class or day

### CSV Format

Your student roster CSV should include columns for:
- Student Name (any column containing "name")
- Student ID (any column containing "id")

Example:
```csv
Student Name,Student ID
John Doe,12345
Jane Smith,67890
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS v4** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### PWA & Storage
- **Vite PWA Plugin** - Service worker and manifest generation
- **Workbox** - Advanced caching strategies
- **LocalForage** - Improved local storage

### Development & Deployment
- **TypeScript** - Type safety (optional)
- **ESLint** - Code linting
- **Docker** - Containerization
- **Nginx** - Production web server

## 🏗️ Project Structure

```
labcheck/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── ClassDetails.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── RosterUpload.jsx
│   │   └── ...
│   ├── lib/                # Utility functions
│   ├── App.jsx             # Main application component
│   └── main.jsx            # Application entry point
├── public/                 # Static assets
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── nginx.conf              # Nginx configuration
└── package.json            # Dependencies and scripts
```

## 🎨 Design System

LabCheck uses a carefully crafted design system built on shadcn/ui:

- **Primary Colors**: Purple gradients (#8b5cf6 to #6366f1)
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Accessible, keyboard navigable
- **Animations**: Subtle transitions and hover effects

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```env
VITE_APP_NAME=LabCheck
VITE_APP_VERSION=1.0.0
```

### PWA Configuration

PWA settings can be modified in `vite.config.js`:

```javascript
VitePWA({
  manifest: {
    name: 'LabCheck - Student Sign-In System',
    short_name: 'LabCheck',
    theme_color: '#8b5cf6',
    // ... other settings
  }
})
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Use shadcn/ui components when possible
- Ensure responsive design
- Test on multiple devices
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the fast build tool
- [React](https://reactjs.org/) for the component framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/labcheck/issues) page
2. Create a new issue with detailed information
3. Include screenshots and error messages when possible

---

**Made with ❤️ for educators and students everywhere**
