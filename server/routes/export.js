const express = require('express');
const authenticate = require('../middleware/auth');
const { exportSchema } = require('../schemas');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    // 1. Validate request body (S4)
    const parseResult = exportSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      return res.status(400).json({ 
        error: 'Invalid request data', 
        details: parseResult.error.format() 
      });
    }

    // [Plan B] Using project and tasks directly from request body instead of Firestore
    const { format, project, tasks } = parseResult.data;

    if (!project || !tasks) {
      return res.status(400).json({ error: 'Project and tasks data are required for export (Plan B)' });
    }

    const boardData = project;

    // 4. Format output based on requested format
    let exportedData = '';

    if (format === 'json') {
      exportedData = JSON.stringify({ board: boardData, tasks }, null, 2);
    } else if (format === 'markdown') {
      exportedData = `# Board Export: ${boardData.title}\n\n`;
      // Frontend uses INITIAL_COLUMNS format, backend can just extract unique columns from tasks if needed, 
      // or use a predefined list. Let's just group by columnId.
      const columns = [...new Set(tasks.map(t => t.columnId))];
      
      columns.forEach(col => {
        exportedData += `## ${col.toUpperCase()}\n`;
        const colTasks = tasks.filter(t => t.columnId === col);
        if (colTasks.length === 0) {
          exportedData += `*No tasks*\n`;
        }
        colTasks.forEach(task => {
          exportedData += `- [ ] **${task.title}** (${task.priority}, ${task.storyPoints} pts)\n`;
          if (task.acceptanceCriteria) {
            task.acceptanceCriteria.forEach(ac => {
              exportedData += `  - [${ac.completed ? 'x' : ' '}] ${ac.text}\n`;
            });
          }
        });
        exportedData += `\n`;
      });
    } else if (format === 'github-issues') {
      exportedData = tasks.map(task => {
        let issue = `### ${task.title}\n\n**Category:** ${task.category}\n**Priority:** ${task.priority}\n\n${task.description}\n\n**Acceptance Criteria:**\n`;
        if (task.acceptanceCriteria) {
          task.acceptanceCriteria.forEach(ac => {
            issue += `- [${ac.completed ? 'x' : ' '}] ${ac.text}\n`;
          });
        }
        return issue;
      }).join('\n---\n\n');
    }

    return res.json({ format, data: exportedData });

  } catch (error) {
    console.error('Export Error:', error);
    return res.status(500).json({ error: 'Failed to process export request.' });
  }
});

module.exports = router;
