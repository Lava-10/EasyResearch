# EasyResearch

Current LLMs struggle in generating images that are not landscape based. Thus, when we ask current LLMs to generate visual abstracts, what they output is pretty much useless for any sort of understanding. Their output is a bunch of images that are kind of related to the topic, seemingly spliced together with no rhyme or reason, with text that is unintelligible. Furthermore, they do not generate any figures, charts, or diagrams, leaving a user scratching their head on how the output is even remotely related to the paper they want to generate a visual abstract for.

EasyResearch is a platform designed to simplify research by generating visual abstracts from research papers, making complex information more accessible and understandable. Built with the MERN stack and powered by Google’s Gemini model, EasyResearch converts uploaded research PDFs into aesthetically cohesive abstracts, including diagrams, graphs, and key points. These visual summaries are dynamically rendered for quick, easy comprehension.

Key features include:
- Automated Visual Abstracts: The app generates a harmonious layout of summarized data, diagrams, and charts.
- Efficient Reuse of Data: Visual abstracts are saved in a global database, reducing regeneration time and token usage.
- Interactive React-Live Rendering: Uses React-Live to compile visual elements in real-time.
- User Profiles and Google OAuth: Secure user authentication and saved profiles for fast access to past abstracts.
- EasyResearch transforms how users engage with academic papers, saving time and enhancing the research experience.
  
## 1. Download Necessary Modules
- In backend, run npm install
- In frontend, run npm install

## 2. Integrate Environment Variables
- Create a .env in the root folder of the backend.
- The .env must match the following format:
    PORT=5000
    MONGO_URI=***** 
    GEMINI_KEY=***** 
    ANTHROPIC_API_KEY=***** 
    GOOGLE_CLIENT_ID=***** 
    GOOGLE_CLIENT_SECRET=***** 
    CLIENT_URL=http://localhost:3000
- Replace the asterisks with the necessary personalized API keys

## 3. Run Project
- Navigate to root folder of project
- run npm start
- Navigate to localhost:3000/
- Enjoy!


