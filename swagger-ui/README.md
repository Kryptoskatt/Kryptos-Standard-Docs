# Kryptos Connect APIs - Swagger UI

Interactive API documentation using Swagger UI.

## 🚀 Quick Start

### Option 1: Open Directly in Browser

Simply open `index.html` in your web browser:

```bash
open index.html
```

Or double-click the `index.html` file.

### Option 2: Serve with HTTP Server

For best results, serve the files with an HTTP server:

**Using Python:**
```bash
# Python 3
cd swagger-ui
python3 -m http.server 8000

# Then open: http://localhost:8000
```

**Using Node.js:**
```bash
# Install http-server globally
npm install -g http-server

# Serve the directory
cd swagger-ui
http-server -p 8000

# Then open: http://localhost:8000
```

**Using PHP:**
```bash
cd swagger-ui
php -S localhost:8000

# Then open: http://localhost:8000
```

### Option 3: Docker

**Using Docker:**
```bash
# Build the image
docker build -t kryptos-swagger-ui .

# Run the container
docker run -d -p 8080:80 --name kryptos-swagger-ui kryptos-swagger-ui

# Then open: http://localhost:8080
```

**Using Docker Compose:**
```bash
# Start the service
docker-compose up -d

# Then open: http://localhost:8080

# Stop the service
docker-compose down
```

## 📖 Features

- **Interactive API Testing** - Try out API calls directly from the browser
- **Request/Response Examples** - See example requests and responses
- **Schema Documentation** - View complete data models
- **Authentication Support** - Test with your API key
- **Search & Filter** - Easily find endpoints
- **Code Generation** - Copy code snippets in multiple languages

## 🔑 Using the Swagger UI

### 1. Authorize

1. Click the **"Authorize"** button (lock icon) at the top
2. Enter your API key in the value field
3. Click **"Authorize"**
4. Click **"Close"**

### 2. Try an Endpoint

1. Click on any endpoint to expand it
2. Click **"Try it out"**
3. Fill in any required parameters
4. Click **"Execute"**
5. View the response below

### 3. View Examples

Each endpoint shows:
- Request format and parameters
- Response schema
- Example responses
- Possible error codes

## 📂 Files

```
swagger-ui/
├── index.html          # Main Swagger UI page
├── openapi.yaml        # OpenAPI specification
├── Dockerfile          # Docker build instructions
├── docker-compose.yml  # Docker Compose configuration
├── .dockerignore       # Docker ignore patterns
└── README.md           # This file
```

## 🔧 Customization

### Change API Specification

Edit `index.html` and update the `url` parameter:

```javascript
const ui = SwaggerUIBundle({
  url: "path/to/your/openapi.yaml",  // Change this line
  // ... other options
});
```

### Change Colors

Edit the `<style>` section in `index.html`:

```css
.swagger-ui .topbar {
  background-color: #YOUR_COLOR;  /* Change this */
}
```

### Add Custom Header

Modify the `.custom-header` section in `index.html`.

## 🌐 Deploy

### Deploy to GitHub Pages

1. Create a new repository
2. Add the `swagger-ui` folder contents
3. Go to Settings → Pages
4. Select the branch and folder
5. Save

Your Swagger UI will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd swagger-ui
vercel
```

### Deploy to Netlify

1. Drag and drop the `swagger-ui` folder to Netlify
2. Your site is live!

### Deploy with Docker

**To a VPS or Cloud Server:**
```bash
# Build and run
docker-compose up -d

# Or without docker-compose
docker build -t kryptos-swagger-ui .
docker run -d -p 80:80 --name kryptos-swagger-ui --restart unless-stopped kryptos-swagger-ui
```

**Using Docker Hub:**
```bash
# Tag and push
docker tag kryptos-swagger-ui your-username/kryptos-swagger-ui:latest
docker push your-username/kryptos-swagger-ui:latest

# On your server, pull and run
docker pull your-username/kryptos-swagger-ui:latest
docker run -d -p 80:80 --name kryptos-swagger-ui --restart unless-stopped your-username/kryptos-swagger-ui:latest
```

## 🔒 Security Notes

- **Never commit API keys** to the Swagger UI files
- The "Authorize" feature stores keys in browser memory only
- Keys are cleared when you close the browser
- Use HTTPS in production

## 📚 Resources

- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Kryptos API Documentation](../API-DOCUMENTATION.md)

## 🆘 Troubleshooting

### "Failed to fetch" Error

**Cause:** CORS issues or incorrect file path

**Solutions:**
- Serve files with an HTTP server (see Quick Start)
- Check that the OpenAPI spec path in `index.html` is correct
- Ensure the OpenAPI file is accessible

### Authorization Not Working

**Cause:** Incorrect API key or format

**Solutions:**
- Verify your API key is correct
- Ensure there are no extra spaces
- Check that your API key has the required permissions

### Endpoints Not Loading

**Cause:** Invalid OpenAPI specification

**Solutions:**
- Validate your OpenAPI spec at https://editor.swagger.io/
- Check for syntax errors in the YAML file
- Ensure all required fields are present

## 💡 Tips

1. **Use the Search** - Filter endpoints by name or tag
2. **Collapse Sections** - Click tags to collapse/expand groups
3. **Copy as cURL** - Copy request examples for command line
4. **Model Definitions** - Scroll down to see all data schemas
5. **Response Codes** - Each endpoint shows all possible responses

## 🎉 You're All Set!

Open `index.html` in your browser and start exploring the Kryptos Connect APIs!

---

**© 2024 Kryptos. All rights reserved.**
