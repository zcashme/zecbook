# Zcash Address Directory – Frontend

A React + Vite web application that serves as the **frontend for the Zcash Address Directory**.  
This project provides a simple, fast, and modern interface for browsing and interacting with Zcash addresses.

---

## 🚀 Tech Stack

- [React](https://reactjs.org/) – UI library  
- [Vite](https://vitejs.dev/) – build tool and dev server  
- [JavaScript / JSX](https://developer.mozilla.org/en-US/docs/Web/JavaScript)  

---

## 📦 Installation

Clone the repository and install dependencies:

```powershell
git clone https://github.com/ZcashUsersGroup/zcashme
cd zcashme
npm install
````

---

## 🛠 Development

Start the local development server:

```powershell
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📑 Build for Production

```powershell
npm run build
```

The compiled output will be in the `dist/` directory.

---

## 🌐 Deploy to GitHub Pages

This project is pre-configured to deploy via **GitHub Actions** to GitHub Pages.

- Vite `base` is set to `./` to support project pages under `https://<username>.github.io/<repo>/`.
- Static assets and PWA manifest use relative paths to avoid 404s under subpaths.

### Steps

1. Create a GitHub repository (or use an existing one).
2. Add the remote and push the code:
   ```bash
   git init
   git add -A
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```
3. In the repository Settings → Pages, set **Build and deployment** source to **GitHub Actions** (usually default).
4. The workflow `.github/workflows/deploy-pages.yml` will build and publish `dist/` to Pages on each push to `main`.
5. Your site will be available at:
   - Project Pages: `https://<username>.github.io/<repo>/`
   - User/Org Pages: `https://<username>.github.io/` (if you use the special `<username>.github.io` repository). For this case you may set Vite `base: '/'`.

### Custom Domain (optional)
- Add a `CNAME` file in `public/` with your domain name, or set it in Pages settings.

---

## 📂 Project Structure

```
zcashme/
├── public/          # Static assets
├── src/             # React components, pages, and styles
├── index.html       # Entry point
├── vite.config.js   # Vite configuration
├── package.json     # Dependencies and scripts
```

---

## 🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first to discuss what you’d like to change.

---

## 📜 License

MIT License © 2025 Zcash Users Group
