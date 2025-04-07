# AI Summarizer Project Setup Guide

This guide will help you set up the AI Summarizer project on your local environment.

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```
This command initializes your project and installs all necessary dependencies from package.json.

### 2. Initialize NPM Project
```bash
npm init -i
```
Creates a new package.json file interactively, which will manage your project's dependencies and scripts.

### 3. Install Tailwind CSS
```bash
npm install tailwindcss @tailwindcss/cli
```
Installs Tailwind CSS and its command-line interface for styling your application.

### 4. Create Source Directory
Create a `src` folder and add `input.css` with:
```css
@import "tailwindcss";
```
This imports Tailwind's base styles into your project.

### 5. Build CSS
```bash
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
```
This command:
- Processes your input.css
- Generates output.css with all Tailwind utilities
- Watches for changes (--watch flag)

### 6. Link CSS to HTML
In your HTML file, add:
```html
<link href="src/output.css" rel="stylesheet">
```
This connects your processed Tailwind styles to your HTML document.

### 7. Development
You're now ready to start development! Your Tailwind CSS will automatically process changes as you work.

## Local Development
1. Keep the Tailwind CLI build process running
2. Open your HTML file in a browser
3. Changes to CSS will automatically update

## Notes
- Ensure Node.js is installed on your system
- Keep the Tailwind CLI running during development
- Check package.json for all dependencies