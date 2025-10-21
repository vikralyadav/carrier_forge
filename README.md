# CareerForge - AI Career Assistant Platform

🚀 **Build and polish your career assets with AI**

CareerForge is a comprehensive AI-powered career platform that helps you get hired faster through resume optimization, job matching, interview coaching, code review, portfolio generation, and career scheduling.

## 🌟 Features

### 📄 Resume Reviewer & ATS Optimizer
- Parse and analyze resumes from PDF files
- Compare against job descriptions
- Provide ATS-friendly rewrite suggestions
- Identify skill gaps and missing keywords

### 🔍 Job Matcher
- Ingest and vectorize job postings
- Score against your profile and skills
- Prioritize best matches
- Support for multiple job comparisons

### 🎯 Interview Coach (Multi-mode)
- **Behavioral Interviews**: STAR method feedback and practice
- **Technical Interviews**: Coding questions with solutions and explanations
- Real-time feedback and improvement suggestions

### 💻 Code Reviewer & Generator
- Static code analysis and review
- Bug detection and security vulnerability scanning
- Code refactoring suggestions
- Generate code snippets and examples

### 🎨 Portfolio & Cover Letter Generator
- Tailored portfolio suggestions for specific jobs
- Generate personalized cover letters
- LinkedIn profile optimization
- Project ideas and learning paths

### 📅 Scheduler & Follow-ups
- Generate follow-up emails for interviews
- Create practice schedules and study plans
- Application tracking and analysis
- Interview preparation roadmaps

### 📊 Observability & Evaluation
- Comprehensive logging system
- Performance tracking
- Career progression monitoring
- API health monitoring

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **AI Engine**: Ollama (local LLM)
- **Orchestration**: LangGraph
- **Vector Store**: Local vector storage
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **File Processing**: PDF parsing, text extraction

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Ollama** installed and running locally
3. **Mistral model** pulled in Ollama

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd carrier_forge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Ollama**
   ```bash
   # Install Ollama (if not already installed)
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull the Mistral model
   ollama pull mistral
   
   # Start Ollama server
   ollama serve
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Access the dashboard**
   Open your browser to `http://localhost:3000`

## 📖 API Documentation

### Resume Analysis
```bash
POST /api/resume/analyze
Content-Type: multipart/form-data

# Upload resume PDF and provide job description
curl -X POST http://localhost:3000/api/resume/analyze \
  -F "resume=@your_resume.pdf" \
  -F "jobDescription=Your job description here"
```

### Job Matching
```bash
POST /api/jobs/match
Content-Type: application/json

{
  "resumeText": "Your resume text...",
  "jobDescription": "Job description..."
}
```

### Interview Practice
```bash
# Get behavioral interview question
POST /api/interview/behavioral
{
  "mode": "question"
}

# Submit answer for feedback
POST /api/interview/behavioral
{
  "mode": "feedback",
  "userAnswer": "Your answer here..."
}
```

### Code Review
```bash
POST /api/code/review
{
  "code": "function example() { return 'hello'; }",
  "language": "javascript",
  "reviewType": "general"
}
```

### Portfolio Generation
```bash
POST /api/portfolio/generate
{
  "resumeText": "Your resume...",
  "jobDescription": "Job description...",
  "portfolioType": "github"
}
```

### Career Scheduling
```bash
POST /api/scheduler/followup
{
  "interviewType": "technical",
  "companyName": "Tech Corp",
  "position": "Software Engineer",
  "daysSinceInterview": 3
}
```

## 🏗️ Architecture

```
CareerForge/
├── src/
│   ├── agents/           # AI Agent implementations
│   │   ├── resumeAgent.js
│   │   ├── jobMatcherAgent.js
│   │   ├── interviewAgent.js
│   │   ├── interviewCoachAgent.js
│   │   ├── codereviewerAgent.js
│   │   ├── portfolioAgent.js
│   │   └── schedulerAgent.js
│   ├── core/            # Core services
│   │   ├── ollamaClient.js
│   │   ├── logger.js
│   │   └── vectorStore.js
│   ├── graph/           # LangGraph orchestration
│   │   └── carrierGraph.js
│   ├── routes/          # API routes
│   │   ├── resume.js
│   │   ├── jobMatcher.js
│   │   ├── interview.js
│   │   ├── portfolio.js
│   │   ├── codeReview.js
│   │   └── scheduler.js
│   └── utils/           # Utility functions
├── public/              # Frontend dashboard
├── logs/               # Application logs
└── server.js           # Main server
```

## 🎯 Usage Examples

### 1. Resume Analysis Workflow
```javascript
// Upload resume and get ATS optimization suggestions
const formData = new FormData();
formData.append('resume', resumeFile);
formData.append('jobDescription', jobDesc);

const response = await fetch('/api/resume/analyze', {
  method: 'POST',
  body: formData
});
```

### 2. Job Matching Pipeline
```javascript
// Match multiple jobs against resume
const jobs = [
  { title: "Frontend Developer", description: "React, JavaScript..." },
  { title: "Backend Developer", description: "Node.js, Python..." }
];

const matches = await fetch('/api/jobs/match-multiple', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ resumeText, jobs })
});
```

### 3. Interview Practice Session
```javascript
// Start behavioral interview
const question = await fetch('/api/interview/behavioral', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mode: 'question' })
});

// Submit answer for feedback
const feedback = await fetch('/api/interview/behavioral', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    mode: 'feedback', 
    userAnswer: 'My answer...' 
  })
});
```

## 🔧 Configuration

### Environment Variables
```bash
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434

# Server Configuration
PORT=3000
NODE_ENV=development

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
```

### Ollama Models
CareerForge is optimized for the Mistral model, but you can use other models:
- `mistral` (recommended)
- `llama2`
- `codellama`
- `phi`

## 📊 Monitoring & Logs

### Health Checks
- API Health: `GET /api/health`
- Service Health: `GET /api/{service}/health`

### Logging
Logs are stored in the `logs/` directory with daily rotation:
- `system-YYYY-MM-DD.log` - System events
- `resume-YYYY-MM-DD.log` - Resume analysis
- `interview-YYYY-MM-DD.log` - Interview sessions
- `jobMatcher-YYYY-MM-DD.log` - Job matching

### Performance Monitoring
The system tracks:
- API response times
- Agent execution times
- Career progression metrics
- Error rates and patterns

## 🚀 Deployment

### Local Development
```bash
npm start
```

### Production Deployment
```bash
# Set production environment
export NODE_ENV=production

# Start with PM2 (recommended)
npm install -g pm2
pm2 start server.js --name careerforge

# Or with Docker
docker build -t careerforge .
docker run -p 3000:3000 careerforge
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Community**: Join our Discord for discussions and support

## 🔮 Roadmap

- [ ] Vector database integration (Pinecone/Weaviate)
- [ ] Advanced analytics dashboard
- [ ] Mobile app companion
- [ ] Integration with job boards (LinkedIn, Indeed)
- [ ] Multi-language support
- [ ] Advanced interview simulations
- [ ] Salary negotiation coaching
- [ ] Company research automation

---

**CareerForge** - Empowering your career journey with AI 🚀
