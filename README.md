# Koppu Anusri — Portfolio

A responsive, static portfolio built with plain HTML, CSS, and JavaScript. There are no package installs, build steps, or third-party runtime dependencies.

## Run locally

Open `index.html` in a browser, or serve the project folder with any static file server. For example, if Python is installed:

```powershell
py -m http.server 8000
```

Then open <http://localhost:8000>.

## Update profile details

Edit `site-config.js` to change the displayed name, title, email, social profile URLs, skills, projects, and resume path. Project repository and live-demo links are intentionally empty until the real URLs are available; the page does not link to guessed repositories.

To enable the resume button, add the actual PDF at `assets/resume.pdf` and set `resumeUrl` to `"assets/resume.pdf"` in `site-config.js`. Without a configured PDF, the button points to a note explaining the placeholder.

The contact form validates its fields and opens a pre-filled message in the visitor's default email app. It does not send a message itself; the visitor must review and send the draft. A backend or email service is needed for direct form delivery.

## Deploy

The site can be hosted as static files on GitHub Pages or Vercel:

- **GitHub Pages:** Push the project files to a repository, then enable Pages for the desired branch and folder in the repository settings.
- **Vercel:** Import the repository and deploy it as a static site. No build command or output directory is required; serve the project root.

Keep `index.html`, `styles.css`, `site-config.js`, and `script.js` together in the deployed root. The stylesheet and scripts use relative paths, so they also work when hosted under a project subpath.

## Styling troubleshooting

The stylesheet is linked from `index.html` as `./styles.css`, and both files belong in the same directory. This path was verified in the workspace's browser preview; no missing stylesheet import or CSS syntax error was found in the original project. If an older unstyled preview persists, serve the current project root and hard-refresh the browser to clear a stale page/cache.
