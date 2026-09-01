const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const authenticate = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimit');
const { decomposeSchema, extractNotesTasksSchema } = require('../schemas');

const router = express.Router();

// Initialize Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/decompose', authenticate, aiRateLimiter, async (req, res) => {
  try {
    // 1. Validate request body against schema (S4)
    const parseResult = decomposeSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: parseResult.error.format() 
      });
    }

    const { prdText, detailLevel, focusArea } = parseResult.data;

    // 2. Prepare the prompt for Gemini
    const prompt = `
      You are an expert Agile Product Manager and Technical Lead.
      I will provide a Product Requirements Document (PRD) or feature description.
      Your task is to decompose it into Epics, User Stories, and Engineering Tasks.

      Focus Area: ${focusArea || 'Fullstack'}
      Detail Level: ${detailLevel} (Standard means 3-8 tasks per story, Deep Enterprise means extremely detailed technical tasks).

      Output MUST be exactly in this JSON format (with no markdown wrappers like \`\`\`json):
      {
        "epic": {
          "title": "Short title",
          "description": "Brief description"
        },
        "stories": [
          {
            "story": "As a [role], I want [feature] so that [benefit]",
            "tasks": [
              {
                "title": "Task title",
                "type": "Frontend" | "Backend" | "Database" | "DevOps" | "QA",
                "description": "Technical description",
                "acceptanceCriteria": ["AC 1", "AC 2"],
                "storyPoints": 1 | 2 | 3 | 5 | 8 | 13,
                "priority": "Low" | "Medium" | "High" | "Urgent"
              }
            ]
          }
        ]
      }

      PRD Content:
      ${prdText}
    `;

    // 3. Call Gemini API using structured JSON schema mode
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    });

    const aiOutput = response.text;

    // 4. Return the parsed JSON
    try {
      const parsedOutput = JSON.parse(aiOutput);
      return res.json(parsedOutput);
    } catch (parseError) {
      console.error('Failed to parse Gemini output as JSON:', aiOutput);
      return res.status(500).json({ error: 'AI generated invalid JSON structure.' });
    }

  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to process AI request. Please try again later.' });
  }
});

router.post('/extract-tasks', authenticate, aiRateLimiter, async (req, res) => {
  try {
    const parseResult = extractNotesTasksSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: parseResult.error.format() 
      });
    }

    const { noteText } = parseResult.data;

    const prompt = `
      You are an expert Agile Project Manager.
      Read the following meeting notes and extract actionable engineering or product tasks.
      If a task is vaguely described, expand it into a clear, actionable task with acceptance criteria.

      Output MUST be exactly in this JSON format (with no markdown wrappers like \`\`\`json):
      {
        "tasks": [
          {
            "title": "Clear action item title",
            "type": "Frontend" | "Backend" | "Database" | "DevOps" | "QA" | "Design",
            "description": "Detailed description of what needs to be done based on the meeting notes",
            "acceptanceCriteria": ["AC 1", "AC 2"],
            "storyPoints": 1 | 2 | 3 | 5 | 8 | 13,
            "priority": "Low" | "Medium" | "High" | "Urgent"
          }
        ]
      }

      Meeting Notes:
      ${noteText}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    });

    const aiOutput = response.text;

    try {
      const parsedOutput = JSON.parse(aiOutput);
      return res.json(parsedOutput);
    } catch (parseError) {
      console.error('Failed to parse Gemini output as JSON:', aiOutput);
      return res.status(500).json({ error: 'AI generated invalid JSON structure.' });
    }

  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to process AI request. Please try again later.' });
  }
});

module.exports = router;
