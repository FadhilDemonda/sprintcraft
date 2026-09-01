const { z } = require('zod');

// Schema for the PRD decomposition request (S4)
const decomposeSchema = z.object({
  prdText: z.string().min(1, 'PRD text is required').max(100000, 'PRD text exceeds maximum length (100,000 chars)'),
  detailLevel: z.enum(['Standard', 'Deep Enterprise']),
  focusArea: z.string().max(100, 'Focus area is too long').optional(),
});

// Schema for extracting tasks from meeting notes
const extractNotesTasksSchema = z.object({
  noteText: z.string().min(1, 'Note text is required').max(100000, 'Note text exceeds maximum length'),
});

// Schema for the board export request (S4)
// [Plan B] Modified to accept raw project and tasks data from frontend
const exportSchema = z.object({
  boardId: z.string().optional(), // optional for Plan B
  format: z.enum(['markdown', 'json', 'github-issues']),
  project: z.any().optional(),
  tasks: z.array(z.any()).optional()
});

module.exports = {
  decomposeSchema,
  exportSchema,
  extractNotesTasksSchema,
};
