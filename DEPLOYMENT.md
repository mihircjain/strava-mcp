# Deploying Strava MCP Server to Render

## Prerequisites

1. **Strava App Setup**: Create a Strava application at https://www.strava.com/settings/api
2. **Get Strava Tokens**: Run `npm run setup-auth` locally to get your access tokens

## Render Deployment Steps

### 1. Connect Repository
- Go to [Render Dashboard](https://dashboard.render.com/)
- Click "New +" → "Web Service"
- Connect your GitHub repository

### 2. Configure Build Settings
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: 20.x (latest)

### 3. Set Environment Variables
In Render's environment variables section, add:

```
STRAVA_CLIENT_ID=your_client_id_here
STRAVA_CLIENT_SECRET=your_client_secret_here
STRAVA_ACCESS_TOKEN=your_access_token_here
STRAVA_REFRESH_TOKEN=your_refresh_token_here
NODE_ENV=production
PORT=10000
```

### 4. Optional: Route Export Path
If using GPX/TCX export features:
```
ROUTE_EXPORT_PATH=/tmp/exports
```

## API Endpoints

Once deployed, your server will have these endpoints:

- `GET /health` - Health check
- `GET /api/tools` - List all available tools
- `POST /api/tools/:toolName` - Execute a specific tool

## Example Usage

```bash
# Health check
curl https://your-app.render.com/health

# List tools
curl https://your-app.render.com/api/tools

# Get recent activities
curl -X POST https://your-app.render.com/api/tools/get-recent-activities \
  -H "Content-Type: application/json" \
  -d '{"perPage": 10}'

# Get activity details
curl -X POST https://your-app.render.com/api/tools/get-activity-details \
  -H "Content-Type: application/json" \
  -d '{"activityId": 14910785861}'
```

## Troubleshooting

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Runtime Errors**: Verify environment variables are set correctly
3. **Strava API Errors**: Ensure tokens are valid and have required permissions

## Local Testing

Before deploying, test locally:

```bash
npm run build
npm start
```

Then test the endpoints:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/tools
``` 
