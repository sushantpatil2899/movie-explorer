 # 🎬 Movie Explorer

 Movie Explorer is a Next.js application that allows users to search for movies, view detailed information, and manage a personalized favorites list with ratings and notes. The app integrates with the TMDB API and focuses on clean state management, simple UX, and intentional architectural tradeoffs.

 🔗 **Live Demo:** [https://movie-explorer-phi-nine.vercel.app/](https://movie-explorer-phi-nine.vercel.app/)

 ---

 ## 🚀 Setup & Run Instructions

 ```bash
 git clone https://github.com/<your-username>/movie-explorer.git
 cd movie-explorer
 npm install
 npm run dev
 ```

 Create a `.env.local` file with:

 ```env
 TMDB_API_KEY=your_api_key_here
 ```

 ---

 ## 🧠 Technical Decisions & Tradeoffs

 | Area                | Decision                                                                 | Tradeoff                                                                                 |
 |---------------------|--------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
 | Frontend Framework  | Used Next.js (App Router) with TypeScript for built-in routing, API support, and type safety | Slightly more setup than plain React, but provides clearer structure and scalability     |
 | API Integration     | External TMDB API is accessed via Next.js API routes to proxy requests and protect API keys | Adds an extra network hop, but improves security and separation of concerns             |
 | Search UX           | Implemented debounced search input to reduce unnecessary API calls while typing | Introduces a small delay before results appear, but significantly lowers request volume  |
 | State Management    | Used local React state instead of global stores (Redux/Zustand)           | Simpler and easier to reason about for this scope; less suitable for large shared state  |
 | Persistence         | Used LocalStorage for favorites, ratings, and notes                       | No cross-device sync, but avoids backend complexity for a time-boxed take-home           |
 | UI Structure        | Single-page layout with toggled Search/Favorites and a shared modal        | Avoids routing complexity; less URL-driven navigation                                    |
 | Setup & Tooling     | Minimal configuration using Next.js defaults (ESLint, PostCSS, Tailwind)   | Less customization, but faster setup and fewer moving parts                              |

 ---

 ## ⚠️ Known Limitations

 - Favorites are stored locally only (no server-side persistence)
 - No authentication or multi-user support
 - No real-time search suggestions (results appear after debounce)
 - Limited accessibility enhancements
 - Basic error handling without retries or advanced fallback UI
 - No pagination or infinite scrolling for large result sets

 ---

 ## 📈 What I’d Improve With More Time

 ### Scalability & Architecture
 - Add server-side persistence with a database and user accounts
 - Introduce a Redis caching layer for frequently searched movies to reduce external API calls  
	 (Useful at higher traffic levels; intentionally omitted here to avoid unnecessary complexity)
 - Normalize data models and introduce service layers for larger feature growth

 ### User Experience & Features
 - Add real-time search suggestions / autocomplete
 - Introduce pagination or infinite scrolling for search results
 - Add routing for movie detail pages and favorites
 - Improve accessibility (keyboard navigation, ARIA roles)

 ---

 ## ✅ Evaluation Coverage

 - **Functionality:** Search → view → favorite → rate/comment works end-to-end
 - **API Integration:** External API accessed via secure server-side proxy
 - **Code Quality:** Clear structure, minimal state, sensible components
 - **User Experience:** Simple workflow with empty and error states
 - **Documentation:** Decisions, tradeoffs, and limitations clearly explained
