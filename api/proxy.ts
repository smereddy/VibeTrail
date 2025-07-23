/**
 * API Proxy for TasteTrails
 * Handles secure API key management and request proxying
 * This file should be deployed as a serverless function (Vercel, Netlify, etc.)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// API Configuration - these should be set as environment variables in your deployment
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const QLOO_API_KEY = process.env.QLOO_API_KEY;
const QLOO_BASE_URL = process.env.QLOO_BASE_URL || 'https://hackathon.api.qloo.com';

interface ProxyRequest {
  service: 'openai' | 'qloo';
  endpoint: string;
  method: 'GET' | 'POST';
  data?: any;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { service, endpoint, method, data }: ProxyRequest = req.body;

    if (!service || !endpoint) {
      res.status(400).json({ error: 'Missing required fields: service, endpoint' });
      return;
    }

    let apiUrl: string;
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Configure API based on service
    switch (service) {
      case 'openai':
        if (!OPENAI_API_KEY) {
          res.status(500).json({ error: 'OpenAI API key not configured' });
          return;
        }
        apiUrl = `https://api.openai.com/v1${endpoint}`;
        headers['Authorization'] = `Bearer ${OPENAI_API_KEY}`;
        break;

      case 'qloo':
        if (!QLOO_API_KEY) {
          res.status(500).json({ error: 'Qloo API key not configured' });
          return;
        }
        apiUrl = `${QLOO_BASE_URL}${endpoint}`;
        headers['X-API-Key'] = QLOO_API_KEY;
        break;

      default:
        res.status(400).json({ error: 'Invalid service' });
        return;
    }

    // Make the API request
    const response = await fetch(apiUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    const responseData = await response.json();

    if (!response.ok) {
      res.status(response.status).json({
        error: 'API request failed',
        details: responseData,
      });
      return;
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}