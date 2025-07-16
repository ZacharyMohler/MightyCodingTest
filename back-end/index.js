const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

//local memory (vs db)
let polls = [];
let nextId = 1;

//GET list - returns all polls
app.get('/polls', (req, res) => {
  res.json({
    success: true,
    data: polls,
    count: polls.length
  });
});

//GET - returns poll with matching ID
app.get('/polls/:id', (req, res) => {
  const pollId = parseInt(req.params.id);
  const poll = polls.find(p => p.id === pollId);

  if (!poll) {
    return res.status(404).json({
      success: false,
      message: 'Poll not found'
    });
  }

  res.json({
    success: true,
    data: poll
  });
});

//POST - create a new poll
//required params: question(text), options(array of texts)
app.post('/polls', (req, res) => {
  const { question, options } = req.body;

  // Basic validation
  if (!question) {
    return res.status(422).json({
      success: false,
      message: 'Question is required',
    })
  }

  if (!options || !Array.isArray(options) || options.length < 2) {
    return res.status(422).json({
      success: false,
      message: 'Question must have at least 2 poll options'
    });
  }

  // Create new poll
  const newPoll = {
    id: nextId++,
    question,
    options: options.map(option => ({
      text: option,
      votes: 0
    })),
    totalVotes: 0,
    createdAt: new Date().toISOString()
  };

  polls.push(newPoll);

  res.status(201).json({
    success: true,
    data: newPoll,
    message: 'Successfully created poll'
  });
});

// POST - adds 1 to the vote total on a poll for the given option: optionIndex
app.post('/polls/:id/vote', (req, res) => {
  const pollId = parseInt(req.params.id);
  const { optionIndex } = req.body;

  const poll = polls.find(p => p.id === pollId);

  if (!poll) {
    return res.status(404).json({
      success: false,
      message: 'No poll found with matching id: ' + pollId,
    });
  }

  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return res.status(400).json({
      success: false,
      message: 'No option found on poll ' + pollId + ' with option index ' + optionIndex
    });
  }

  // Add vote
  poll.options[optionIndex].votes++;
  poll.totalVotes++;

  res.json({
    success: true,
    data: poll,
    message: 'Successfully added vote'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Polling API server running at http://localhost:${port}`);
  console.log('\nAvailable endpoints:');
  console.log('GET    /polls       - Get all polls');
  console.log('GET    /polls/:id   - Get specific poll');
  console.log('POST   /polls       - Create new poll');
  console.log('POST   /polls/:id/vote - Vote on poll');
});

module.exports = app;