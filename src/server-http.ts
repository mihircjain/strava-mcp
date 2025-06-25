import express from "express";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import tools
import { getAthleteProfile } from './tools/getAthleteProfile.js';
import { getAthleteStatsTool } from "./tools/getAthleteStats.js";
import { getActivityDetailsTool } from "./tools/getActivityDetails.js";
import { getRecentActivities } from "./tools/getRecentActivities.js";
import { listAthleteClubs } from './tools/listAthleteClubs.js';
import { listStarredSegments } from './tools/listStarredSegments.js';
import { getSegmentTool } from "./tools/getSegment.js";
import { exploreSegments } from './tools/exploreSegments.js';
import { starSegment } from './tools/starSegment.js';
import { getSegmentEffortTool } from './tools/getSegmentEffort.js';
import { listSegmentEffortsTool } from './tools/listSegmentEfforts.js';
import { listAthleteRoutesTool } from './tools/listAthleteRoutes.js';
import { getRouteTool } from './tools/getRoute.js';
import { exportRouteGpx } from './tools/exportRouteGpx.js';
import { exportRouteTcx } from './tools/exportRouteTcx.js';
import { getActivityStreamsTool } from './tools/getActivityStreams.js';
import { getActivityLapsTool } from './tools/getActivityLaps.js';
import { getAthleteZonesTool } from './tools/getAthleteZones.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();

// CORS middleware - Allow all origins for now, but you can restrict to specific domains
app.use((req: any, res: any, next: any) => {
  // Allow requests from any origin (you can restrict this to specific domains if needed)
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Create tool registry for HTTP endpoints
const tools: { [key: string]: any } = {
  'get-athlete-profile': getAthleteProfile,
  'get-athlete-stats': getAthleteStatsTool,
  'get-activity-details': getActivityDetailsTool,
  'get-recent-activities': getRecentActivities,
  'list-athlete-clubs': listAthleteClubs,
  'list-starred-segments': listStarredSegments,
  'get-segment': getSegmentTool,
  'explore-segments': exploreSegments,
  'star-segment': starSegment,
  'get-segment-effort': getSegmentEffortTool,
  'list-segment-efforts': listSegmentEffortsTool,
  'list-athlete-routes': listAthleteRoutesTool,
  'get-route': getRouteTool,
  'export-route-gpx': exportRouteGpx,
  'export-route-tcx': exportRouteTcx,
  'get-activity-streams': getActivityStreamsTool,
  'get-activity-laps': getActivityLapsTool,
  'get-athlete-zones': getAthleteZonesTool,
};

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'strava-mcp-server' });
});

// List all available tools
app.get('/api/tools', (_, res) => {
  const toolList = Object.keys(tools).map(name => ({
    name,
    description: tools[name].description
  }));
  res.json({ tools: toolList });
});

// Execute a tool
app.post('/api/tools/:toolName', async (req: any, res: any) => {
  const { toolName } = req.params;
  const tool = tools[toolName];
  
  if (!tool) {
    return res.status(404).json({ 
      error: `Tool '${toolName}' not found`,
      availableTools: Object.keys(tools)
    });
  }

  try {
    console.error(`Executing tool: ${toolName} with params:`, req.body);
    const result = await tool.execute(req.body || {});
    res.json(result);
  } catch (error: any) {
    console.error(`Error executing tool ${toolName}:`, error);
    res.status(500).json({ 
      error: 'Tool execution failed',
      message: error.message || 'Unknown error'
    });
  }
});

// Start the HTTP server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Strava MCP HTTP server running on port ${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /health - Health check`);
  console.log(`   GET  /api/tools - List all tools`);
  console.log(`   POST /api/tools/:toolName - Execute a tool`);
});
