"use client"

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * EducationalContentStreamlined v2
 * - Pure React component (no external UI libs)
 * - Lavender-themed, clean, and focused UI
 * - Saves progress to localStorage
 * - Enforces a true step-by-step roadmap (modules unlock progressively)
 * - Enhanced animations and interactive feedback
 *
 * How to use:
 * import EducationalContentStreamlined from "./components/EducationalContentStreamlined";
 * function App() { return <EducationalContentStreamlined /> }
 */

// --- Types ---
type Module = {
  id: string;
  level: string;
  title: string;
  description: string;
  readingTime: string;
  badge: string;
  content: string;
  isCompleted: boolean;
};

// --- LocalStorage Key ---
const LOCAL_STORAGE_KEY = 'educationalContentProgress';

// --- Utility Functions ---
function renderStructuredContent(content: string) {
  const lines = content.split("\n").map(l => l.trim()).filter(Boolean);
  return (
    <div>
      {lines.map((line, i) => {
        if (line.match(/^(\d{1,2}(\.\d{1,2}[A-Z]?)?)\s/)) { // Matches "1.1", "3A.2"
          return <h3 key={i} className="ec-content-heading">{line}</h3>;
        }
        if (line.match(/^- \*\*(.*?)\*\*:/)) { // Matches "- **Title**:"
          const [, title, desc] = line.match(/^- \*\*(.*?)\*\*:\s*(.*)$/) || [];
          return (
            <div key={i} className="ec-content-section">
              <h4 className="ec-content-title">{title}</h4>
              {desc && <p className="ec-content-text">{desc}</p>}
            </div>
          );
        }
        if (line.startsWith('👉') || line.startsWith('🔹') || line.startsWith('✅') || line.startsWith('📌') ) {
            return <p key={i} className="ec-content-highlight">{line}</p>;
        }
        if (line.startsWith('---')) {
            return <hr key={i} className="ec-content-divider" />;
        }
        if (line.startsWith('⏱')) {
            return <p key={i} className="ec-content-meta">{line}</p>;
        }
        return <p key={i} className="ec-content-text">{line.replace(/^- /, "")}</p>;
      })}
    </div>
  );
}

// --- Raw Data ---
// (The extensive rawModules array is included at the bottom of the file)
const rawModules: Omit<Module, 'isCompleted'>[] = [
  {
    id: "level-1",
    level: "Level 1",
    title: "Foundations – Understanding LinkedIn",
    description: "What LinkedIn is, why it matters, and how its algorithm connects people with opportunities.",
    readingTime: "12 min",
    badge: "🎓",
    content: `
---

1.1 What is LinkedIn?

LinkedIn is not “just another social media.”
It is the world’s largest professional network, with over 1 billion users globally (2025). Unlike Instagram, TikTok, or Facebook, LinkedIn is built with one clear focus:
👉 to connect people with opportunities.

For students, it’s a launchpad to internships, jobs, and mentors.

For professionals, it’s a credibility showcase and a career growth accelerator.

For entrepreneurs, it’s a free stage to build brand trust and attract clients.

For industry explorers, it’s a live knowledge base of trends, leaders, and insights.


Think of LinkedIn as your digital resume + portfolio + networking room + personal PR agency combined.

---

1.2 Why LinkedIn Matters in 2025

Recruiter Hub: Over 95% of recruiters use LinkedIn to find talent.

Content Reach: LinkedIn posts can reach 2–3x more people than on other platforms for the same follower count, thanks to its “professional trust” factor.

Business Gateway: 4 out of 5 LinkedIn users drive business decisions, making it the #1 B2B lead generation platform.

Skill Showcase: LinkedIn Learning + certificates integrate directly into profiles → proof of growth mindset.


In simple words: your LinkedIn is your career’s Google page.
When someone searches your name, chances are LinkedIn shows up first.

---

1.3 How the LinkedIn Algorithm Works

Understanding the algorithm is like unlocking LinkedIn’s hidden rules.

🔹 Step 1: Initial Content Distribution

When you post → LinkedIn shows it to a small test audience (usually your 1st-degree connections).

🔹 Step 2: Quality Signals

LinkedIn measures how this test audience reacts in the first 60 minutes:

Do they click “See More”? (Dwell time = strong signal)

Do they react, comment, or share?

Do they ignore or hide the post?


🔹 Step 3: Wider Reach

If the post gets enough engagement early, LinkedIn pushes it to:

More of your connections.

2nd-degree networks (friends of your friends).

Sometimes, even strangers following related hashtags.


🔹 Step 4: Long-Tail Distribution

Good posts keep resurfacing for days/weeks because LinkedIn values quality > frequency.
---

1.4 What the Algorithm Prioritizes

1. Relevance → Does your post/profile match someone’s interests & keywords?


2. Engagement Velocity → How quickly people engage after posting.


3. Credibility Signals → Profile completeness, endorsements, and recommendations.


4. Network Strength → Closer connections see you more often.


5. Consistency → Active users (posting + commenting) get priority in feeds.

---

1.5 Hacks to Work With the Algorithm

Profile Hack: Use role-specific keywords in Headline, About, and Skills. Recruiters use Boolean searches like “Data Analyst AND Python AND SQL”.

Posting Hack: Post 2–3 times per week → more than daily spam, less than ghosting.

Engagement Hack: Spend 10 mins engaging with others before posting → warms up your visibility.

Timing Hack: Best times = Tue–Thu, 8–10 AM (work start) and 5–7 PM (post-work scrolls).

Hashtag Hack: Use 3–5 relevant hashtags, not 20. Example: #DataScience #AI #CareerGrowth.

Comment Hack: Writing thoughtful comments on big creators’ posts can get you noticed faster than your own posts.

---

1.6 Universal Principles Before You Specialize

No matter which path you choose later (Jobs, Content, Business, or Exploration):

1. Profile First, Content Second. (Nobody trusts advice from an empty profile.)


2. Give Before You Ask. (Engage, help, and add value → then opportunities follow.)


3. Quality > Quantity. (One strong post beats 10 weak ones.)


4. Be Searchable. (Think: “What keywords should people type to find me?”)


5. Professional, not robotic. (Show personality, but keep it career-focused.)

---

1.7 Reflection & Explore Tasks

Reflection Qs:

If someone searched my name today, would I be proud of my profile?

Am I just passively scrolling, or actively building my career capital?

Do I know what keywords define me?


Explore Tasks:

Search your dream role on LinkedIn → note the top 5 skills appearing repeatedly.

Look at 3 trending posts in your industry → what patterns do you notice?

Check your profile strength (LinkedIn shows a meter) → what section is incomplete?

---

1.8 Case Example

Profile A: “Student at XYZ College.” → 50 connections, 0 posts, invisible to recruiters.

Profile B: “Marketing Intern | Building Social Campaigns | Driving 15% Growth in Student Startups.” → 500+ connections, 3 posts on projects, recommendations from peers. Recruiters contact Profile B.

---

📌 Summary of Level 1

LinkedIn = career accelerator (not just social media).

The algorithm rewards relevance, engagement, and credibility.

Before going into Jobs, Content, Business, or Exploration → master the basics.

Success = Profile strength + Algorithm mastery + Consistent value creation.

---

⏱ Reading/understanding this section = ~12 minutes.
    `,
  },
  {
    id: "level-2",
    level: "Level 2",
    title: "Universal Basics – Building Your Presence",
    description: "Master identity, networking, visibility, and engagement to establish a strong presence.",
    readingTime: "18 min",
    badge: "👤",
    content: `
---

2.1 Why Universal Basics Matter

Before chasing jobs, building content, or scaling a business, you need a solid professional identity.
Think of LinkedIn as a house:

Profile = your foundation

Networking = your doors & windows

Visibility = your address signboard

Engagement = your voice inside the community


Without these basics, even the best strategies collapse.


---

2.2 Profile Identity – Your Digital First Impression

🔹 Essentials

Profile Photo: Clear, professional, smiling, neutral background. (Profiles with photos get 21x more views.)

Headline Formula: Role + Key Skill + Value Statement

Example: “Business Analyst | Data-Driven Problem Solver | Turning Numbers into Strategy”


About Section: Tell a story. 3–4 short paragraphs:

Who you are → skills, background.

What you do → achievements, projects.

Where you’re going → aspirations, goals.


Experience: Use STAR format (Situation, Task, Action, Result). Recruiters love measurable results.

Skills Section: Add 10–15 skills → reorder top 3 to match your career focus.

Recommendations: Ask colleagues/mentors → even 2–3 boost credibility.


🔹 Hacks

Add name pronunciation (gives warmth & personal touch).

Customize your LinkedIn URL (e.g., linkedin.com/in/YourName).

Use Featured Section → showcase projects, certificates, portfolios.

Endorse others → most will endorse you back.



---

2.3 Networking Etiquette – Connections That Count

🔹 Essentials

Quality > Quantity. 50 meaningful connections > 500 random.

Personalized Invites: Always add a note. Formula: Context + Compliment + Connect.

Example: “Hi Aditi, I enjoyed your article on AI in agriculture. I’m exploring similar areas as a student researcher — would love to connect.”


Alumni Tool: Search alumni from your college in target companies.

Groups & Communities: Join 2–3 industry-specific groups → engage weekly.


🔹 Hacks

Before sending a connection request → comment on their post. Acceptance rate doubles.

Check “People Also Viewed” on profiles → hidden networking goldmine.

Save “Search Alerts” for professionals in your domain → LinkedIn notifies you when new ones match.



---

2.4 Visibility – Being Discoverable

🔹 Essentials

Add a background image → visual branding. (E.g., student: campus project; professional: cityscape/industry theme.)

Use keywords in Headline, About, and Experience. Recruiters search with Boolean logic like:

“Python AND SQL AND Data Analyst”


Public Profile: Customize what’s visible → at least headline, About, Experience should be open.

Add “Open to Work” or “Providing Services” badges (depending on goal).


🔹 Hacks

Skills Order: Put in-demand skills at top. (e.g., “Data Analysis” before “MS Office.”)

Endorsement Hack: Ask 3 peers to endorse → then endorse them back.

Use LinkedIn Creator Background Banner (available in free tools like Canva).



---

2.5 Engagement – Becoming Visible in Feeds

🔹 Essentials

Why engagement matters: LinkedIn rewards active users by showing their content more often.

Rule: Comment > Share > Like.

Liking = passive.

Commenting = visibility to 2nd-degree network.

Sharing = weaker unless you add original thoughts.


Hashtags: Use 3–5. Balance broad (#CareerGrowth) with niche (#B2BMarketing).

Consistency: 2–3 posts/week is sustainable.


🔹 Hacks

Golden 60 Minutes: Algorithm favors posts that get engagement in the first hour.

Engage Before You Post: Spend 10 mins liking/commenting → warms your visibility.

Comment Hack: Write mini-insights (50–100 words) on others’ posts → positions you as thoughtful, not just active.

Poll Hack: Polls often get 2–3x engagement because people love clicking options.



---

2.6 Explore It (Practical Tasks)

1. Search for 5 profiles of professionals in your target role. What do their headlines & About sections have in common?


2. Join 2 LinkedIn groups in your domain → post a comment or question.


3. Comment thoughtfully on 3 posts by industry leaders → track profile visits you get after.


4. Customize your LinkedIn URL → share it in your email signature.




---

2.7 Reflection Questions

“Does my profile clearly explain who I am and what I want?”

“If I were a recruiter, would I stop at my profile or move on?”

“Do I engage with intention, or just scroll?”

“Am I being discoverable to the right people?”



---

2.8 Case Example

Profile A: Generic student headline “Pursuing B.Com at XYZ College.” → Low visibility, no credibility.

Profile B: Headline: “Aspiring Finance Analyst | Excel & Data Modelling | Passion for Equity Research” → Shows direction, keywords, and energy.

After 3 months, Profile B got 5 recruiter messages without applying.



---

📌 Summary of Level 2

Profile = first impression (must tell your story).

Networking = doors to opportunities (personalize invites, use alumni tools).

Visibility = being discoverable (keywords, skills, endorsements).

Engagement = signal to algorithm (comments, hashtags, consistency).

With strong basics → you are now ready to explore specialized tracks.



---

⏱ Estimated Reading & Aplication Time: 15–18 mins
    `,
  },
  {
    id: "assessment",
    level: "Step 02",
    title: "Quick Assessment",
    description: "Identify your career stage, strengths, and gaps before diving into specialized tracks.",
    readingTime: "5 min",
    badge: "🎯",
    content: `
- **Purpose:** To identify each learner’s career stage and goal clarity, spot strengths, habits, and blind spots, and trigger reflective thinking before the main learning begins. The outcome is a personalized learning path.
- **Structure:** An interactive format with 12–15 questions, taking 4–6 minutes to complete. It uses a mix of multiple-choice, slider scales, and situational choices.
- **Scoring Logic:** Each question is tagged under one of five dimensions: Clarity (goal awareness), Confidence (self-belief), Consistency (habits), Cognitive Awareness (self-evaluation), and LinkedIn Proficiency.
- **Sections:** The assessment covers Career Stage & Goal Clarity, Strengths & Hidden Gaps, Reflection & Cognitive Awareness, LinkedIn Practical Knowledge, and Mindset & Habits.
    `,
  },
  {
    id: "level-3a",
    level: "Level 3",
    title: "Track A: Job & Internship Seeker",
    description: "Build a job-ready profile, search smartly, and convert applications into interviews.",
    readingTime: "20 min",
    badge: "💼",
    content: `
---

3A.1 Why LinkedIn is a Job Magnet

95% of recruiters use LinkedIn to source candidates.

LinkedIn profiles often appear before resumes in searches.

Unlike job portals, LinkedIn adds credibility signals: activity, recommendations, content.

Internships & fresher opportunities are increasingly sourced through network referrals, not just applications.


👉 If you’re invisible on LinkedIn, you’re invisible to opportunities.


---

3A.2 How Recruiters Use LinkedIn

Recruiters don’t “browse randomly.” They use LinkedIn Recruiter (paid tool):

Boolean searches: “(Data Analyst OR Business Analyst) AND Python AND SQL.”

Filters: location, education, years of experience, skills.

They scan:

1. Headline (does it match the role?)


2. About section (clear narrative?)


3. Top 3 skills (do they align with job description?)


4. Recommendations (is this person trusted by others?).




Hack: Reverse engineer this → load your profile with role-specific keywords.


---

3A.3 Building a Job-Ready Profile

🔹 Essentials

Headline Formula: Role + Skill + Impact.

Example: “Data Analyst Intern | SQL & Python | Turning Data into Insights.”


About Section: Write in first person, ~300 words. Use the Who – What – Why – Where Next format.

Experience Section: Even if student → add internships, projects, volunteering. Write in STAR format:

“Developed [X] feature (Action) to solve [Y problem] (Situation), leading to [Z measurable result].”


Skills Section: Minimum 10 skills. Ensure top 3 match job target.

Recommendations: Ask professors, peers, managers. 2–3 is enough to stand out.


🔹 Hacks

Add certifications (Coursera, LinkedIn Learning, college projects).

Upload 1-page resume in Featured section.

Add a banner image with industry theme (e.g., stock market, coding).



---

3A.4 Smart Job Search Strategy

🔹 Essentials

Job Alerts: Save 5 roles (LinkedIn notifies instantly).

Premium Top Applicant: Compare your skills vs. other applicants.

Open to Work: Two modes: visible to all OR only recruiters.


🔹 Hacks

Apply within 48 hours of posting → early applicants get more responses.

Use Alumni Tool:

Search “[Your College] Alumni → Company → Job Role.”

Message alumni → “Hi [Name], I’m a junior from [College] exploring [Role]. Would love to hear how you transitioned.”


Save recruiter searches → LinkedIn notifies you when new ones match.

DM hiring managers directly → short, specific, value-oriented.



---

3A.5 Application Conversion – Standing Out

🔹 Essentials

Keep “Easy Apply” as last resort → low conversion.

Better: Apply → engage with company post → DM recruiter.

Showcase projects in Featured section.


🔹 Hacks

Keyword Match Resume: Align resume with job post → 70% higher ATS match.

Referral Hack: Ask connections for referrals → 4x higher chance.

Content Hack: Post 1 learning/project → recruiters see proactive learners.



---

3A.6 Explore It (Practical Tasks)

1. Pick 3 job postings → copy-paste text → highlight top 10 keywords.


2. Edit your headline & About section to include at least 5 of those.


3. Send 2 personalized connection requests to alumni working in your dream role.


4. Apply to 1 job → screenshot how your profile appears when recruiter sees it.




---

3A.7 Reflection Questions

“Does my headline clearly signal the role I want?”

“If a recruiter only saw my top 3 skills, would they match the job?”

“Am I waiting for jobs, or making jobs find me?”

“Am I visible in the right networks?”



---

3A.8 Case Example

Candidate A: Applied to 50 jobs via Easy Apply. Got 1 callback.

Candidate B: Applied to 20 jobs + engaged with 10 recruiter posts + messaged 5 alumni. Got 5 callbacks.
👉 Quality networking beats quantity applying.



---

3A.9 Premium Insights (Extra Layer)

Top Applicant Tool: Shows how you rank vs. others.

InMail: Personalized recruiter outreach → higher reply rates than cold emails.

Interview Prep AI: Practice with common interview Qs & model answers.



---

📌 Summary of Track A – Job & Internship Seeker

LinkedIn = recruiter search engine → think keywords.

Job-ready profile = headline, About, Experience, Skills, Recommendations.

Smart job search = alerts, alumni, DM hacks.

Conversion = apply early, use referrals, showcase projects.

Premium unlocks = Top Applicant insights, InMail, Interview AI.



---

⏱ Reading + tasks = ~15–20 mins.
    `,
  },
  {
    id: 'level-3b',
    level: 'Level 3',
    title: 'Track B: Content Creator',
    description: 'Leverage content to build influence, visibility, and trust, positioning yourself as an expert.',
    readingTime: '20 min',
    badge: '💡',
    content: `
---

3B.1 Why Become a LinkedIn Creator?

Content creation on LinkedIn is not just about likes — it’s about influence, visibility, and trust.

Recruiters prefer candidates who showcase expertise publicly.

Clients trust entrepreneurs who share valuable insights consistently.

Students who post about learning journeys get noticed by mentors & peers.


👉 On LinkedIn, your content = your reputation currency.


---

3B.2 How the Creator Algorithm Works

The LinkedIn algorithm for creators follows a distribution ladder:

1. Test Audience: Your post first goes to a slice of 1st-degree connections.


2. Engagement Velocity: If likes/comments happen in the first 60 minutes, reach expands.


3. Dwell Time: If people click “see more” or pause on your content → strong signal.


4. Network Ripple: Post goes to 2nd- and 3rd-degree networks if engagement sustains.


5. Long Tail: Evergreen posts resurface weeks later if comments continue.



🔹 Key Factors

Relevance: Use hashtags & keywords your audience follows.

Consistency: Active creators get priority placement.

Interaction: Responding to comments doubles visibility.



---

3B.3 Choosing Your Creator Identity

Before posting, define What do I want to be known for?

Job Seekers: Post about projects, skills, career journey.

Entrepreneurs: Share problem-solving insights, client success stories.

Explorers: Curate trends, research, and industry news.


Hack: Limit to 2–3 content themes → avoids confusing your audience.


---

3B.4 Content Formats That Work

1. Text Posts (Most common)

Short, value-driven, or storytelling.

Hack: First 2 lines = hook. Example: “I failed 5 interviews before I cracked my dream role. Here’s why.”



2. Carousels (Slide Posts)

Perfect for step-by-step tips.

Hack: Use Canva or Figma → export PDF → upload as document post.



3. Video Posts

High trust, lower volume.

Hack: Keep under 90 seconds, add captions (70% watch without sound).



4. Newsletters

Long-form thought leadership.

Hack: Start once you have 500+ connections/followers.



5. LinkedIn Live / Audio Events

Interactive. Best for Q&As, product launches, group learning.






---

3B.5 Growth Hacks for Creators

Engage 10x more than you post. Comment on others → increases your reach.

Post 2–3 times per week. Quality > daily spam.

Golden Hour Rule: Ask 3–5 close connections to engage in the first hour.

Hashtag Sweet Spot: 3–5 targeted hashtags (#AI #Startup #CareerGrowth).

Tagging Rule: Tag only relevant people → random tags lower reach.

Comment Strategy: Write 50–100 word insights on influencers’ posts → positions you as mini-thought leader.



---

3B.6 Engagement & Audience Building

Supporters vs. Followers: Don’t chase vanity metrics. Focus on a small group who comment regularly.

Community Loop: Reply to every comment → doubles reach & builds trust.

Poll Hack: Polls often get 2–3x higher engagement → use them strategically.

Repurpose Content: Turn 1 long post into 3 short snippets, a carousel, and a poll.



---

3B.7 Explore It (Practical Tasks)

1. Write a 150-word post → include a hook, value, and call to action.


2. Create 1 carousel with “5 lessons learned from my project/internship.”


3. Comment on 5 posts from top creators in your niche → note profile visits gained.


4. Post a poll → track number of votes vs. profile views.




---

3B.8 Reflection Questions

“Am I posting to look smart, or to provide value?”

“What 3 topics would I love to be known for on LinkedIn?”

“If a recruiter/client saw only my last 3 posts, what impression would they form?”

“Do I engage as much as I post?”



---

3B.9 Case Example

Creator A: Posts generic motivational quotes daily. Gets likes, but no career outcomes.

Creator B: Posts twice a week → shares project learnings, insights, and industry news. Replies to comments. Builds a 2,000-follower base → gets speaking invite + job offer.
👉 Lesson: Value & consistency > frequency & vanity.



---

3B.10 Premium Insights for Creators

Creator Mode: Unlocks analytics, follower button, featured hashtags.

LinkedIn Analytics: Engagement rate, follower growth, post performance.

LinkedIn Learning: Courses on storytelling, social media strategy.



---

📌 Summary of Track B – Content Creator

Algorithm = engagement + dwell time + early reactions.

Define your creator identity → 2–3 focused themes.

Formats: text, carousel, video, newsletter, live.

Growth hacks: golden hour, hashtag sweet spot, comment strategy.

Premium tools enhance analytics & positioning.



---

⏱ Reading + tasks = ~15–20 mins.
    `,
  },
  {
    id: 'level-3c',
    level: 'Level 3',
    title: 'Track C: Entrepreneur & Business Builder',
    description: 'Use LinkedIn as a B2B goldmine for generating leads, building credibility, and driving growth.',
    readingTime: '20 min',
    badge: '🚀',
    content: `
---

3C.1 Why LinkedIn is a Business Goldmine

4 out of 5 LinkedIn users drive business decisions → no other platform has this ratio.

LinkedIn generates 3x more conversions than other social platforms for B2B.

Trust factor: Unlike Facebook/Instagram, LinkedIn audiences expect professional, problem-solving content.

Freelancers & solopreneurs can position themselves as experts, not just service providers.


👉 For entrepreneurs, LinkedIn = stage + sales funnel + credibility booster.


---

3C.2 Crafting Your Entrepreneur Identity

🔹 Essentials

Founder Profile: Your personal profile is your brand’s strongest asset.

Headline formula: [Founder/Role] | [Company/Service] | [Value/Impact]

Example: “Founder @GreenUp | Eco-Smart Packaging | Helping SMEs Go Plastic-Free”


Company Page:

Banner = vision/mission visual.

About section = “Problem → Solution → Proof → Call to Action.”

Showcase culture & people, not just services.



🔹 Hacks

Pin case studies, pitch decks, media coverage in Featured.

Ask early customers for recommendations.

Use your personal posts to drive attention → then link to company page.



---

3C.3 Networking for Business Growth

🔹 Essentials

Connect with intent: Partners, investors, talent.

Alumni + Niche Groups: Great for finding first customers or mentors.

Outreach Formula (for B2B):

Step 1: Engage with prospect’s post.

Step 2: Connect with personalized note.

Step 3: Share value/resource before pitching.



🔹 Hacks

Save lead lists → revisit weekly.

Use “People Also Viewed” → competitor customers/leads.

DM Hack: Offer insight or case study, not “Can we hop on a call?”



---

3C.4 Marketing & Growth via LinkedIn

🔹 Essentials

Content Marketing: Share insights, customer success, behind-the-scenes.

Employer Branding: Showcase team achievements & company culture.

Thought Leadership: Founders should post weekly → vision, lessons, industry insights.


🔹 Hacks

Boost employee posts → amplifies reach.

Cross-pollinate: Share company posts in personal feed with context.

Video Hack: Short founder videos = higher trust than text.



---

3C.5 LinkedIn Ads – Your Business Accelerator

🔹 Ad Types

Single image ads

Video ads

Document ads (great for case studies/whitepapers)

Lead Gen Forms (higher conversions)

Event ads


🔹 Funnel Strategy

1. Awareness: Educational content (videos, thought leadership).


2. Consideration: Case studies, testimonials, gated whitepapers.


3. Conversion: Lead Gen ads, retargeting, offers.



🔹 Hacks

Use Predictive Audiences (AI) → LinkedIn matches your ICP.

Avoid broad targeting → focus on job title, industry, company size.

Retarget visitors who engaged with your company page or posts.

Start small (₹50K–₹1L) → scale based on cost per qualified lead.



---

3C.6 Sales Navigator – Advanced Growth Tool

Save searches by role/industry → updated daily.

Track decision-makers at target companies.

Build lead lists & integrate with CRM.

Social Selling Index (SSI) → aim for 70+.


Hack: Use advanced filters like “Changed jobs in last 90 days” → these are high-potential leads.


---

3C.7 Explore It (Practical Tasks)

1. Draft your founder headline using the formula.


2. Create a skeleton company page (banner + About + tagline).


3. Build a list of 10 potential leads using LinkedIn search filters.


4. Design a simple “value post” (e.g., customer success story).




---

3C.8 Reflection Questions

“Does my profile position me as a founder or just another job seeker?”

“If someone looked at my company page for 30 seconds, would they trust us?”

“Do I approach networking as pitching or value-adding?”

“Am I using LinkedIn as a funnel or just a billboard?”



---

3C.9 Case Example

Startup A: Built company page but never posted → 200 followers, no leads.

Startup B: Founder posted weekly on “lessons in building,” engaged with industry leaders, ran one ₹80K ad campaign targeting decision-makers. Result: 40+ leads, 3 paying clients.
👉 Lesson: Founder visibility + smart ads = credibility + conversions.



---

3C.10 Premium Insights for Entrepreneurs

InMail Credits: Directly message decision-makers without connections.

Company Insights: Track competitor hiring, growth, and engagement.

AI Sales Navigator Features: Smart lead recommendations.

LinkedIn Learning: Courses on B2B marketing, social selling, and ad strategy.



---

📌 Summary of Track C – Entrepreneur & Business Builder

LinkedIn = B2B sales funnel + credibility machine.

Personal founder profile = more powerful than company page alone.

Networking = value-first outreach, not cold pitching.

Growth = thought leadership + employer branding + content.

LinkedIn Ads + Sales Navigator amplify scale.

Premium unlocks = InMail, Company Insights, Sales Navigator AI.



---

⏱ Reading + tasks = ~18–20 mins.
    `,
  },
  {
    id: 'level-3d',
    level: 'Level 3',
    title: 'Track D: Industry Explorer',
    description: 'Use LinkedIn as a live knowledge base to explore industries, discover career options, and learn from leaders.',
    readingTime: '20 min',
    badge: '🌍',
    content: `
---

3D.1 Why Explore Industries on LinkedIn?

LinkedIn is more than a job portal → it’s a live industry knowledge base.

Every sector (AI, Tech, Agriculture, Design, Finance, Healthcare, etc.) has:

Top Voices (recognized experts)

Communities & Groups

Company Pages sharing trends & jobs

Collaborative Articles crowdsourced by professionals


Exploring industries helps you:

Discover career options beyond your college curriculum.

Identify future startup ideas.

Learn directly from leaders & practitioners.



👉 Treat LinkedIn like a library + conference + mentorship hub.


---

3D.2 How LinkedIn Surfaces Industry Content

The algorithm curates feeds based on:

People you follow (leaders, peers, recruiters).

Hashtags you follow (#ArtificialIntelligence, #SustainableFarming).

Groups you join.

Engagement behavior → if you like AI posts, you’ll see more AI content.

Collaborative Articles & Newsletters → LinkedIn recommends based on skills you’ve added.


Hack: Add target industry skills → LinkedIn pushes you more relevant industry content.


---

3D.3 Learning Pathways by Industry

🔹 AI / Tech Explorer

Follow hashtags: #AI, #MachineLearning, #DataScience.

Join groups like “AI & ML Professionals.”

Subscribe to creators like Andrew Ng or LinkedIn Top Voices in AI.

Explore collaborative articles → contribute short insights.


🔹 Agriculture Explorer

Follow hashtags: #AgriTech, #SustainableFarming.

Company pages: Bayer CropScience, Corteva Agriscience.

Groups: “Agri-Business Professionals.”

Explore innovations: IoT in farming, vertical agriculture.


🔹 Finance Explorer

Hashtags: #FinTech, #InvestmentBanking, #Crypto.

Top Voices: finance analysts, VC investors.

Company pages: Goldman Sachs, Zerodha, fintech startups.

Collaborative articles on financial literacy, DeFi, stock markets.


🔹 Design Explorer

Hashtags: #UIUXDesign, #ProductDesign, #Creativity.

Portfolios: Designers upload case studies in Featured.

Groups: “UI/UX Professionals.”

Company pages: IDEO, Figma, Adobe.


👉 Each industry has leaders, communities, and live conversations → plug in to grow.


---

3D.4 Networking for Industry Discovery

🔹 Essentials

Use Alumni Tool to find peers in target industries.

Connect with second-degree professionals → easier acceptance.

Join 3–5 niche groups → comment weekly.


🔹 Hacks

Comment like an insider: Instead of “Great post,” write:

“This AI trend also reminds me of how healthcare startups are adopting predictive models. Curious if you see crossover there?”


DM Hack: Ask for insight, not opportunity.

Example: “Hi Rohan, I’m exploring AgriTech as a student project. Would love your 2-minute view on what skill gaps are biggest in this industry.”


Create “Industry Journals”: Post weekly learnings from your exploration.



---

3D.5 Trend Discovery & Algorithm Awareness

LinkedIn isn’t alone — every industry lives across multiple platforms.

LinkedIn: Thought leadership & B2B updates.

Twitter (X): Breaking news & debates.

Instagram/TikTok: Visual storytelling, lifestyle angle.

YouTube: Deep learning tutorials, case studies.


👉 Hack: Follow the same industry across platforms → cross-check insights.


---

3D.6 Explore It (Practical Tasks)

1. Pick an industry you’re curious about (AI, Finance, Agriculture, Design).

Follow 5 hashtags.

Follow 5 Top Voices.

Join 2 groups.

Save 3 company pages.



2. Post a short “What I learned this week in [Industry]” update.


3. DM 2 professionals in that industry with curiosity-driven questions.


4. Contribute 1 insight in a Collaborative Article.




---

3D.7 Reflection Questions

“Am I consuming industry content passively, or curating it actively?”

“Do I know the top 5 skills in my target industry?”

“Have I engaged with peers, or am I just following big names?”

“If I explored 3 industries, which one excites me most for long-term growth?”



---

3D.8 Case Example

Student A: Wants to get into AI but only watches YouTube tutorials → no visibility.

Student B: Follows AI hashtags, engages with posts, DMs 2 professionals, posts weekly learnings. After 3 months → gets offered a research internship in AI startup.
👉 Lesson: Engaged explorers convert curiosity into opportunity.



---

3D.9 Premium Insights for Industry Explorers

LinkedIn Learning Paths: Pre-built roadmaps for AI, Finance, Marketing, Agriculture.

Skill Evaluations: Take assessments → add verified badges to your profile.

Company Insights: Premium shows hiring trends, employee growth.

Interview Prep AI: Industry-specific practice for roles you’re curious about.



---

📌 Summary of Track D – Industry Explorer

LinkedIn = live knowledge hub across industries.

Algorithm pushes relevant content if you follow hashtags, people, and skills.

Pathways: AI, Agriculture, Finance, Design, etc. → each has its leaders, groups, and pages.

Networking = insight-driven DMs, alumni outreach, niche groups.

Cross-platform exploration deepens understanding.

Premium adds → learning paths, insights, assessments, interview prep.



---

⏱ Reading + tasks = ~18–20 mins.


---

✅ With Track D, Level 3 (all four specialized paths) is now complete.
Each learner will:

1. Get exposed to all 4 paths.


2. Choose one (or more) to specialize.


3. Apply reflection & tasks to solidify learning.
    `,
  },
  {
    id: 'level-4',
    level: 'Level 4',
    title: 'Advanced Mastery + AI Exit Layer',
    description: 'Go from good to exceptional by leveraging Premium tools, cross-platform algorithms, and a final AI-powered analysis.',
    readingTime: '25 min',
    badge: '✨',
    content: `
---

4.1 Why Advanced Mastery Matters

At this stage, learners:

Have built their profile foundations (Level 1 & 2).

Explored career tracks (Jobs, Content, Business, Exploration in Level 3).

Understood how LinkedIn works at the surface.


But LinkedIn is dynamic & competitive → to truly stand out, you must:

Leverage Premium tools.

Master cross-platform algorithms.

Integrate learning into a personal roadmap.


👉 Level 4 = from good to exceptional.


---

4.2 Unlocking LinkedIn Premium (Strategic Use)

🔹 Networking Superpowers

InMail Credits → message anyone (decision-makers, recruiters).

Who Viewed Your Profile → understand audience interest, reach out directly.


🔹 Job-Seeker Edge

Top Applicant Insights → see how you rank vs. others.

Applicant Insights Dashboard → skills gap analysis.

AI Interview Prep → practice role-specific Qs.


🔹 Business & Creator Edge

Company Insights → track growth, attrition, hiring → target better.

AI-Powered Resume Help → refine CV to job descriptions.

Learning Courses → premium-only certifications.


Hack: Use Premium for 1–2 months strategically → extract value → downgrade if not needed continuously.


---

4.3 Social Media Algorithm Mastery (Beyond LinkedIn)

LinkedIn doesn’t exist in isolation. Every professional should understand how to translate their voice across platforms:

Platform         Strength                               Weakness                  Hack
LinkedIn         B2B trust, jobs, industry content      Slower for lifestyle      Posts 2–3x/week + thoughtful comments
X (Twitter)      Fast trends, debates                   Short lifespan posts      Post insights + threads daily
Instagram        Visual branding, lifestyle             Weak professional trust   Repurpose carousels + reels
YouTube          Deep learning, long-form content       High effort               Create tutorials, record Live replays
TikTok           Viral short-form, Gen Z appeal         Weak B2B credibility      Use for personal brand awareness


👉 Hack: One idea → five formats (e.g., LinkedIn post → Twitter thread → IG carousel → YouTube short → TikTok clip).


---

4.4 Cross-Category Integration

Each learner should see how tracks overlap:

Job Seeker → Creator → Posting project learnings attracts recruiters.

Creator → Entrepreneur → Content → followers → leads → customers.

Explorer → Business Builder → Industry research → spot trends → launch startups.

Entrepreneur → Job Seeker → Founders who pivot can showcase leadership skills to recruiters.


👉 The magic of LinkedIn: Paths are not silos, but fluid journeys.


---

4.5 The AI-Powered Exit Layer

At the end of the journey, learners upload their LinkedIn Profile PDF.
Our AI system runs an evaluation engine with multiple lenses.

🔹 Output: Personalized Career Growth Report

1. Profile Score (0–100)

Based on headline, About, experience, keywords, activity.



2. Keyword Match Rate

Matches profile with chosen goal (Job, Creator, Business, Explorer).

Example: “Your profile matches 70% of a typical Data Analyst role.”



3. Skill Gap Analysis

Missing vs. industry standards.

Suggests top 3 skills to add.



4. Recruiter Impression Test

Simulates a 7-second recruiter scan.

Feedback on readability, credibility, and clarity.



5. Actionable Recommendations

Headline alternatives (3 variations).

Summary rewrite suggestions.

Content posting ideas for visibility.

Networking strategies for specific industries.




🔹 Rules of AI Use

One-time use → ensures learners think & build profiles manually first.

Scoring Report is downloadable → acts as certificate of readiness.



---

4.6 Explore It (Capstone Tasks)

1. Upload your profile PDF → get AI score.


2. Compare your score vs. reflection from Level 2 & 3.


3. Build a 30-day action plan based on AI recommendations.


4. Share your AI report highlights in community → peers give feedback.




---

4.7 Reflection Questions

“Have I learned to rely on myself first, before AI suggestions?”

“Which track (Job, Creator, Business, Explorer) feels most aligned with my future?”

“Am I building a brand that lasts beyond LinkedIn?”

“How can I use LinkedIn as a launchpad, not just a profile?”



---

4.8 Case Example

Learner A: Completed Job Seeker modules, uploaded profile, got score 62/100. AI suggested missing skills + weak About section. Learner fixed → landed internship.

Learner B: Explored multiple tracks, posted about industry trends, scored 78/100. AI recommended posting cadence → within 2 months, became Top Voice in campus niche.



---

📌 Summary of Level 4 – Advanced Mastery + AI Exit

Premium tools give supercharged networking & job insights.

Social media algorithms differ → learn cross-platform repurposing.

All tracks are interconnected → learners can flow between them.

AI Report provides final clarity + roadmap.

One-time AI scoring ensures self-driven learning first, AI support later.



---

⏱ Reading + application = ~20–25 mins.


---

✅ Now we have a complete 4-Level Learning Journey:

1. Foundations (What & How LinkedIn Works).


2. Universal Basics (Profile, Networking, Visibility, Engagement).


3. Specialized Tracks (Jobs, Creator, Business, Explorer).


4. Advanced Mastery + AI Exit Layer.
    `,
  },
  {
    id: 'module-5',
    level: 'Module 5',
    title: 'Hidden Layers & Exclusive Hacks',
    description: 'See LinkedIn as a Career OS. Unlock hidden features, psychological triggers, and monetization paths.',
    readingTime: '25 min',
    badge: '🗝️',
    content: `
---

5.1 LinkedIn as a Career Operating System (Not Just a Platform)

Most people see LinkedIn as just:

A place to upload a resume.

A job board.

A networking site.


But in reality, LinkedIn = Career Operating System (Career OS):

Visibility Engine: Recruiters, clients, and peers discover you.

Credibility Ledger: Recommendations, endorsements, and content become permanent trust signals.

Opportunity Radar: Jobs, collaborations, partnerships show up faster here than on job portals.

Portfolio Hub: Your profile is a living resume + portfolio + content showcase.


👉 Shift mindset: LinkedIn is not a tool you check when job hunting. It’s a continuous career infrastructure.


---

5.2 LinkedIn Hidden Features & Hacks

🔹 Boolean Search Operators

Example: (“Data Analyst” OR “Business Analyst”) AND (“SQL” OR “Python”)

Lets you find jobs, leads, or people with laser precision.


🔹 Saved Searches & Alerts

Save a job search → get notified daily/weekly.

Save a people search (e.g., Product Managers in Bangalore) → see new entrants every week.


🔹 Alumni Insights Tool

Go to “My College → Alumni.”

Filter by industry, location, role → see real career paths.

Hack: DM alumni with shared background → 40% higher reply rate.


🔹 Content Search

Filter posts by keywords, hashtags, and authors.

Use it for market research → e.g., “AI + hiring trends.”


🔹 Creator Analytics (Deep Layer)

Track impressions vs. engagement rate.

Hack: Optimize posting time → mornings (8–10am) and evenings (6–8pm) in your region.


🔹 Hidden Premium Value

LinkedIn Resume Builder (AI-powered) rewrites CVs → export for ATS use.

Skill quizzes → unlock “verified skill badges” (elevates trust).



---

5.3 Psychological Triggers & Influence

LinkedIn is a credibility-first network → psychology plays a huge role.

🔹 Authority Bias

People trust those with visible titles, awards, recommendations.

Hack: Add “Ex-[Company]” in headline → instant credibility.


🔹 Social Proof

Recommendations = digital trust badges.

Endorsements = micro signals of trust.

Hack: Exchange endorsements with peers (but relevant skills only).


🔹 Content Psychology

Curiosity posts → “3 mistakes I made in my first internship (and what I learned).”

Contrarian posts → “Why job seekers should stop spamming recruiters.”

Community posts → “I’m starting in [X field]. Who else here is on the same journey?”


🔹 Networking Scripts (Non-Desperate)

Wrong: “Hi sir, I need a job. Please help.”

Right: “Hi [Name], I’m exploring [Field]. Your post on [Topic] was insightful — especially [Detail]. Could you share one tip for someone starting out?”



---

5.4 LinkedIn for Competitive Intelligence

LinkedIn = free business radar.

Company Growth Tracking: Check “People” tab → track hiring spikes or attrition.

Trend Spotting: Follow Top Voices → reverse engineer what topics are booming.

Job Postings as Market Research: Job descriptions = list of skills in demand.

Event Tracking: Industry leaders host webinars/events → join for networking.


👉 Hack: Export job posts from 10 companies → create a “skills cloud” → spot gaps.


---

5.5 LinkedIn + AI Synergy

AI doesn’t replace effort → it accelerates efficiency.

🔹 Workflows

Content Drafting: AI generates first draft, you add personal story.

Job Matching: AI scans job JD → tailors your About/Resume.

Interview Simulation: AI role-plays recruiter → practice real Q&A.


🔹 Rules

Assist, don’t automate. Overusing AI (auto-comments, mass DMs) risks account bans.

Blend personality. Always edit AI outputs with your story + context.



---

5.6 Monetization Paths Beyond Jobs

LinkedIn is not just for finding jobs. You can earn directly or indirectly:

Freelancing: Position yourself as a consultant → attract inbound leads.

Creator Monetization: Run newsletters, sell ebooks, courses, or workshops.

B2B Growth: Generate leads via content + InMail.

Speaking Gigs & Media: Visibility → invites to panels, podcasts, conferences.


👉 Hack: Share mini case studies → leads to consulting requests.
(“Helped a startup cut costs by 20% using supply chain AI tools.”)


---

5.7 Building a Long-Term Personal Brand

Think of LinkedIn as a 3-Year Branding Roadmap:

Year 1 → Learner Mode

Share takeaways, small projects, industry curiosity.

Build early trust as a student/explorer.


Year 2 → Authority Mode

Share frameworks, insights, results.

Mentor juniors, collaborate with peers.


Year 3 → Leadership Mode

Shape industry conversations.

Speak at events, publish whitepapers/newsletters.



👉 Hack: Keep your Featured section updated quarterly → it becomes your evolving portfolio.


---

5.8 Explore It (Advanced Experiments)

1. Run 3 Boolean searches to find hidden opportunities.


2. Save 2 job searches + 2 people searches → track updates.


3. DM 2 alumni with curiosity-driven notes.


4. Post 1 contrarian or curiosity-driven post.


5. Use AI to rewrite your About section in 3 styles (student, pro, founder) → compare.


6. Export 5 competitor job posts → analyze skill gaps.




---

5.9 Reflection Questions

“Am I still using LinkedIn passively, or as a daily career OS?”

“Do I show credibility (authority, proof, social trust) at every profile touchpoint?”

“AmM I creating value-driven content, or chasing likes?”

“If LinkedIn was the only place people checked me, would they see a growing professional story?”



---

5.10 Case Example

Professional A: Passive user → only updates profile → no visibility → career stuck.

Professional B: Used hidden tools + content psychology →

Posted weekly learnings,

Used Boolean search for hidden jobs,

Networked with alumni,

Used AI to polish profile.
→ Within 6 months → landed job + freelance project + speaking invite.



👉 Lesson: LinkedIn mastery = visibility + psychology + systems + AI + consistency.


---

📌 Summary of Module 5 – Hidden Layers & Exclusive Hacks

LinkedIn = Career Operating System, not just a site.

Hidden tools (Boolean, Alumni, Saved Search) = secret edge.

Psychology matters (authority, proof, community).

Competitive intelligence = LinkedIn as industry radar.

AI workflows speed up → but must keep personal voice.

Monetization & personal branding = long-term growth.


⏱ Reading + practice = 20–25 mins.
    `,
  },
  {
    id: 'module-6',
    level: 'Module 6',
    title: 'Audience Playbooks & Next Steps',
    description: 'Get tailored advice, FAQs, and actionable next steps based on your specific career persona.',
    readingTime: '15 min',
    badge: '📚',
    content: `
---

Intro — purpose

This section helps learners identify with a persona, anticipate their feelings and questions after completing the curriculum, and get short, high-impact actions. Use this as a quick FAQ & checklist for each audience segment.


---

1) Indian School Student (Class 10–12)

Who: Growing curiosity about careers, first-time on LinkedIn or about to join.
Mindset after course: Excited but uncertain — “What career path fits me?” and “How do I start building credibility early?”

Top doubts & answers

1. Is LinkedIn for me at my age? — Yes. Start as a learner profile: share project notes, competitions, volunteer work.


2. What should I post? — Short learning logs: projects, book takeaways, fair/project results.


3. Do I need real work experience? — No — school projects, clubs, and volunteering count as experience.


4. Will I be judged? — Keep it professional and school-appropriate; mentors and peers will help, not harm.


5. How much time to spend? — 30–60 minutes/week: profile polish + 1 post or 3 thoughtful comments.


6. Privacy concerns? — Limit public contact details and check “public profile” settings.


7. How do I approach seniors? — Ask curiosity questions and mention your school + project tie-in.


8. Should I use AI? — Use AI to draft posts and practice messages — always personalize.



Next steps (first 7 days)

Create a one-paragraph About (who you are + what you like).

Add a project or competition to Featured.

Follow 5 people in fields you’re curious about.

Post one “what I learned” update and comment on 3 posts.



---

2) New College Student (1st–2nd year)

Who: Exploring majors, joining clubs, building early network.
Mindset: Curious, exploratory — wants direction, internships in future.

Top doubts & answers

1. How do I choose a direction? — Explore 3 industries for 3 months each via LinkedIn Learning + people you follow.


2. Should I post or network? — Both: post monthly, network weekly (alumni + professors).


3. How to get started with internships? — Build project-based posts and DM alumni with a short ask for guidance.


4. Does content help? — Yes — it signals initiative and learning ability.


5. Do I need a polished resume? — Good to have a one-page student resume to feature.


6. What if I don’t have mentors? — Use alumni tool and ask for 10–15 minute informational chats.


7. How to use premium? — Not necessary now; use free LinkedIn Learning trials selectively.


8. How does AI fit in? — Use it to brainstorm projects and iterate your About section.



Next steps (first 30 days)

Make a 3-month learning plan using LinkedIn Learning or free courses.

Complete 1 mini-project and post a carousel about your process.

Connect with 5 alumni from your college in roles that interest you.



---

3) Final-Year Student (Internship/job seeker)

Who: Job/internship hunt begins now.
Mindset: Anxious but goal-oriented — wants quick outputs (interviews).

Top doubts & answers

1. Will LinkedIn get me interviews quickly? — Yes, with targeted keywords + alumni outreach + referrals.


2. How to tailor profile for roles? — Reverse-engineer 5 job descriptions and include top skills in headline/About.


3. Easy Apply vs direct outreach? — Use Easy Apply as backup; prioritize referrals and messages to hiring managers.


4. How many applications per week? — 8–12 quality applications with tailored resumes is better than mass apply.


5. Do projects matter? — Projects with measurable outcomes beat generic resumes.


6. Premium worth it? — Consider a 1–2 month trial if you need Top Applicant insights.


7. How to get referrals? — Ask alumni/peers politely, share a one-page highlight about your fit for the role.


8. Interview prep? — Use our AI interview simulation + mock Qs but rehearse answers aloud.



Next steps (10-day sprint)

Pick 10 target roles + 5 companies.

Optimize headline + About with 8 role-specific keywords.

Message 10 alumni/recruiters with tailored 2-line messages and a one-line value pitch.

Upload profile PDF to get AI report and implement top-3 quick wins.



---

4) Early Career Professional (1–5 years)

Who: First full-time job, looking to advance, shift, or build authority.
Mindset: Practical: “How to get faster promotions / better roles?”

Top doubts & answers

1. How to signal growth? — Post project case studies and measurable wins every month.


2. Will content hurt my job security? — Keep company confidentiality; focus on learnings not secret data.


3. How to network without spam? — Engage with meaningful comments and share add-value resources.


4. Is it better to apply or be approached? — Both; optimize profile to be found and proactively apply.


5. How to price freelance/side gigs? — Start with small paid projects, document outcomes, then increase.


6. How to measure progress? — Monitor profile views, recruiter messages, interviews per month.


7. How often to update profile? — Quarterly updates + new Featured items after notable wins.


8. Is learning new skills necessary? — Yes; use LinkedIn Learning to fill immediate skill gaps.



Next steps (30–60 days)

Publish 2 project posts and 1 long-form article.

Ask for 2 recommendations from direct managers/clients.

Build a 3-month personal brand calendar (what to post + topics).



---

5) Content Creator Starter (students & professionals)

Who: Wants to build an audience and authority on LinkedIn.
Mindset: Eager but nervous about first posts and growth.

Top doubts & answers

1. How to start with zero followers? — Niche down: pick 2 themes and post consistently (2–3/wk).


2. How much time per week? — 3–5 hours per week for creation + engagement.


3. What formats to use? — Text + carousel + short video. Start with text/carousel if resources low.


4. Will negative comments kill my motivation? — Expect some; respond calmly or ignore trolls.


5. How long until results? — 3–6 months for meaningful traction if consistent.


6. How to convert followers to clients? — Share case studies, lead magnets, and a clear CTA.


7. Should I pay for promotion? — Not necessary initially — invest in content quality first.


8. How to use AI for content? — Draft ideas & outlines, but always add your voice and examples.



Next steps (first 60 days)

Define 3 content pillars and 12 post ideas.

Post 8 times (mix formats) and track which gets engagement.

Create a small lead magnet (one-pager or mini checklist) to capture emails.



---

6) Aspiring Entrepreneur / Founder (idea-stage)

Who: Has an idea or early MVP, needs customers, investors, or partners.
Mindset: Opportunity-focused, hungry for credibility and leads.

Top doubts & answers

1. Can LinkedIn find early customers? — Yes — target niche company roles, run outreach + content that showcases problem-solution fit.


2. Should I use company page early? — Use personal founder page first; create a company page when you have repeatable messaging.


3. How to pitch without sounding salesy? — Lead with value: share a one-pager or a short case study.


4. Do investors use LinkedIn? — Yes; your founder narrative and traction posts matter to angels/VC scouts.


5. How to find co-founders? — Use groups, alumni networks, and specific filters in LinkedIn search.


6. Is paid ads useful? — For B2B lead gen, targeted LinkedIn ads + leadgen forms can work with a small test budget.


7. How to price initial offerings? — Pilot pricing: discount for feedback + testimonials.


8. How to use AI? — Draft cold outreach, analyze job posts to identify market demand, and create content faster.



Next steps (30-day founder sprint)

Publish 2 founder posts: problem overview + pilot result.

Build a 20-person prospect list and outreach with a 2-line value pitch.

Add 1 mini-case study to Featured to use in outreach.



---

7) Existing Small Business Owner

Who: Running a business, wants more clients/hiring/visibility.
Mindset: Pragmatic — ROI focused, concerned about time & ad spend.

Top doubts & answers

1. Can LinkedIn generate real revenue? — Yes for B2B and higher-ticket B2C, via content + targeted outreach + ads.


2. Should I focus on company page or people? — People-first: founders and leads drive trust; company page supports it.


3. How to find sales-ready leads? — Use Sales Navigator filters (job title, company size, industry).


4. Is ad spend worth it? — Test small, measure CPL (cost per lead), then scale what converts.


5. How to use employees? — Employee advocacy amplifies reach — give them shareable content.


6. How to hire through LinkedIn? — Post jobs and use Recruiter Lite / filtered searches for passive candidates.


7. How to measure ROI? — Track leads, meetings booked, and deals closed from LinkedIn over 90 days.


8. How to combine offline & online? — Use LinkedIn content to warm leads before calls/meetings.



Next steps (60-day plan)

Run a 30-day pilot ad campaign to a gated offer (whitepaper or demo).

Train top 3 employees to share company posts.

Build a lead nurture message sequence (DM → value → demo ask).



---

8) Career Switcher / Mid-career Professional

Who: Changing industry or function.
Mindset: Concerned about transferable skills, storytelling, and credibility.

Top doubts & answers

1. How to show fit without direct experience? — Focus on transferable outcomes and projects; use learning + micro-projects to prove competence.


2. How to get initial interviews? — Target adjacent roles, use alumni + cold-inmail with clear transfer claims.


3. Do I need certifications? — Use role-relevant micro-certificates and add them to Featured.


4. How to network in a new field? — Follow industry voices, comment thoughtfully, and offer to volunteer on small projects.


5. What to say in About? — Tell the career transition story: why, transferable skills, and current readiness.


6. How long to rebrand? — 3–6 months with steady content + targeted outreach.


7. How to use AI? — Create STAR stories from your past that highlight transferable skills.


8. Should I hide old roles? — No — rewrite them to emphasize relevant responsibilities/outcomes.



Next steps (90-day switch plan)

Build 3 STAR project stories that map old skill → new role outcome.

Do 3 micro-projects (volunteer/freelance) in the new domain and publish them.

Reach out to 10 people doing the job you want for informational interviews.



---

9) Industry Researcher / Explorer (lifelong learner)

Who: Curious professional who wants topical depth across sectors.
Mindset: Wants to be knowledgeable and networked, often contributing to research or advising.

Top doubts & answers

1. How to stay current without noise? — Curate 10 high-quality sources + 3 hashtags and review weekly.


2. How to build authority as an explorer? — Publish syntheses and short briefs that add insight beyond headlines.


3. How to find collaborators? — Use collaborative articles and invite co-authors via DMs.


4. How to monetize insight? — Build newsletters, paid reports, or consultancy.


5. How to validate trends? — Cross-check LinkedIn signals with sources on other platforms and company hiring trends.


6. Do I need a niche? — Yes — narrow first, expand later.


7. How much is too much content? — One deep piece + 2 short posts per week is a good cadence.


8. How to use AI? — Use AI to summarize research and generate frameworks — always validate sources.



Next steps (30-day explorer routine)

Create a weekly 300–500 word industry brief and publish as a post/newsletter.

Build a list of 20 experts and engage monthly.

Run one mini-survey in LinkedIn groups to validate a trend.



---

How each persona should use the AI one-time report

Treat AI as a diagnostic, not a prescription. It points out gaps and opportunities — YOU decide priorities.

Implement quick wins first: headline rewrite, 3 keyword insertions, Featured item add.

Cross-check AI skill-gap claims with real job JDs and two professionals in the field.

For creators and founders: use AI post suggestions as drafts; always add personal proof and a real example.

For switchers: use AI to generate STAR stories and then manually tune them to preserve authenticity.



---

Short Decision Matrix — Which path next after the report

Score ≥ 80: Focus on growth & content → 90-day visibility sprint.

Score 60–79: Fix profile gaps + 30-day network push → target 10 outreach/day.

Score < 60: Revisit Level 1–2 (profile, keywords) → do 3 micro-projects and upload again.



---

Final: AI + Cognitive Thinking — How they must work together (explicit)

1. AI = amplifier; cognition = compass. Use AI for speed (drafts, scans, simulations) and your cognitive judgment for truth, tone, and strategy.


2. Always critique AI outputs. Ask: Is this true to my story? Would I say this in a 2-min face-to-face?


3. Use AI to test variants, not decisions. Generate 3 headline options and pick the one that best maps to your career goal.


4. Teach learners to reflect: After AI recommendations, students must write 3 reasons they accept/reject each suggestion — this builds cognitive discipline.


5. One-time AI rule: The platform’s one-time AI report is a milestone — it should be used to set a plan and then learn from executing it, not to keep re-scoring as a crutch.




---

Closing note you can show learners (short copy)

> “This program uses AI to measure and suggest — but your thinking wins. Build first, learn deliberately, then let AI confirm and accelerate. Treat AI as a coach; be the player.”
    `,
  }
];

// --- Main Component ---
export default function EducationalContentStreamlined() {
  const [modules, setModules] = useState<Module[]>([]);
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load progress from localStorage on initial render
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      const completedIds: string[] = savedProgress ? JSON.parse(savedProgress) : [];
      
      const initialModules = rawModules.map(m => ({
        ...m,
        isCompleted: completedIds.includes(m.id)
      }));
      setModules(initialModules);
    } catch (error) {
      console.error("Failed to load or parse progress:", error);
      // Fallback to default state if localStorage is corrupt
      setModules(rawModules.map(m => ({ ...m, isCompleted: false })));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (modules.length > 0) {
      const completedIds = modules.filter(m => m.isCompleted).map(m => m.id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(completedIds));
    }
  }, [modules]);

  const { completedModules, totalModules, overallProgress } = useMemo(() => {
    const completed = modules.filter((m) => m.isCompleted).length;
    const total = modules.length;
    return {
      completedModules: completed,
      totalModules: total,
      overallProgress: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [modules]);
  const allCompleted = totalModules > 0 && completedModules === totalModules;

  const toggleModuleComplete = (moduleId: string) => {
    setModules(prev =>
      prev.map(m =>
        m.id === moduleId ? { ...m, isCompleted: !m.isCompleted } : m
      )
    );
  };

  const activeModule = modules.find((m) => m.id === openModuleId) || null;

  return (
    <div className="ec-root">
      <style>{`
        :root {
          --ec-primary: #9B8CFF;      /* Lavender */
          --ec-primary-strong: #6E60F6; /* Deeper Lavender */
          --ec-bg: #F8F7FF;           /* Very light lavender */
          --ec-text: #1F2937;          /* Slate-800 */
          --ec-muted: #6B7280;         /* Slate-500 */
          --ec-green: #10B981;         /* Emerald-500 */
          --ec-locked: #D1D5DB;       /* Gray-300 */
        }
        *, *::before, *::after { box-sizing: border-box; }
        body, html { margin: 0; padding: 0; }
        .ec-root {
          min-height: 100vh;
          background-image: radial-gradient(circle at 10% 20%, rgba(155, 140, 255, 0.15), transparent 50%),
                            radial-gradient(circle at 80% 90%, rgba(110, 96, 246, 0.1), transparent 50%);
          background-color: var(--ec-bg);
          color: var(--ec-text);
          padding: 2rem 1rem;
          font-family: -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .ec-container { max-width: 700px; margin: 0 auto; }
        .ec-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(158, 145, 255, 0.15);
          border: 1px solid rgba(110, 96, 246, 0.1);
          padding: 24px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .ec-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(158, 145, 255, 0.2); }
        
        .ec-header { text-align: center; margin-bottom: 3rem; }
        .ec-header-title { font-weight: 800; font-size: 2.25rem; letter-spacing: -0.02em; margin-bottom: 0.5rem; background: -webkit-linear-gradient(45deg, var(--ec-primary-strong), var(--ec-primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .ec-header-sub { color: var(--ec-muted); max-width: 500px; margin: 0 auto 1.5rem auto; line-height: 1.6; }

        .ec-progress-card { text-align: left; }
        .ec-progress-row { display: flex; align-items: center; justify-content: space-between; font-weight: 700; margin-bottom: 10px; }
        .ec-progress-label { color: var(--ec-primary-strong); }
        .ec-progress-value { color: var(--ec-muted); font-size: 0.9rem; }
        .ec-progress-track { height: 12px; border-radius: 999px; background: rgba(155,140,255,0.15); overflow: hidden; border: 1px solid rgba(110,96,246,0.1); }
        .ec-progress-bar { height: 100%; width: 0%; background: var(--ec-primary); transition: width 400ms ease-in-out; }

        .ec-roadmap-title { text-align: center; font-weight: 800; font-size: 1.75rem; letter-spacing: -0.01em; margin: 3rem 0 1.5rem 0; }
        .ec-modules-list { display: flex; flex-direction: column; gap: 1rem; }
        .ec-module-item { position: relative; padding-left: 50px; opacity: 0; animation: slideInUp 0.5s ease-out forwards; animation-delay: calc(var(--i) * 100ms); }
        .ec-module-item::before { /* Default connector line */
          content: ''; position: absolute; left: 23px; top: 50px; bottom: -1rem;
          width: 4px; background: rgba(155,140,255,0.2); border-radius: 2px;
        }
        .ec-module-item::after { /* Completed connector line */
            content: ''; position: absolute; left: 23px; top: -1rem; width: 4px;
            height: 0; background-color: var(--ec-green);
            transition: height 0.4s ease-in-out;
        }
        .ec-module-item.completed::after { height: calc(50% + 1rem); }
        .ec-module-item.completed + .ec-module-item.completed::after { height: calc(100% + 2rem); }
        .ec-module-item:last-child::before, .ec-module-item:last-child::after { display: none; }

        .ec-module-connector {
          position: absolute; left: 0; top: 12px; width: 50px; height: 50px; border-radius: 50%;
          display: grid; place-items: center; font-size: 1.5rem;
          background: white; border: 4px solid rgba(155,140,255,0.2); transition: all 300ms ease;
        }
        .ec-module-item.completed .ec-module-connector { border-color: var(--ec-green); background: var(--ec-green); color: white; }
        .ec-module-item.locked .ec-module-connector { border-color: var(--ec-locked); background: #f9fafb; color: var(--ec-locked); }
        .ec-module-item.locked .ec-card { background: #f9fafb; opacity: 0.7; cursor: not-allowed; }
        .ec-module-item.locked .ec-card:hover { transform: none; box-shadow: 0 8px 32px rgba(158, 145, 255, 0.15); }

        .ec-module-content { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 20px; }
        .ec-module-info h4 { font-weight: 800; font-size: 1.125rem; margin: 0 0 4px 0; }
        .ec-module-info p { margin: 0; font-size: 0.9rem; color: var(--ec-muted); }
        
        .ec-btn {
          appearance: none; border: 0; outline: 0; padding: 10px 18px; border-radius: 12px; font-weight: 700;
          cursor: pointer; transition: all 150ms ease; white-space: nowrap;
        }
        .ec-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(110,96,246,0.2); }
        .ec-btn:disabled { background: var(--ec-locked); color: var(--ec-muted); cursor: not-allowed; }
        .ec-btn:disabled:hover { transform: none; box-shadow: none; }
        .ec-btn.primary { background: var(--ec-primary-strong); color: white; box-shadow: 0 4px 12px rgba(110,96,246,0.2); }
        .ec-btn.secondary { background: white; color: var(--ec-primary-strong); border: 1px solid rgba(110,96,246,0.3); }
        
        .ec-drawer-backdrop { position: fixed; inset: 0; background: rgba(17,24,39,0.5); backdrop-filter: blur(4px); opacity: 0; pointer-events: none; transition: opacity 300ms ease-in-out; z-index: 40; }
        .ec-drawer {
          position: fixed; top: 0; right: 0; width: 92%; max-width: 520px; height: 100%;
          background: white; box-shadow: -20px 0 40px rgba(110,96,246,0.2);
          transform: translateX(100%); transition: transform 300ms ease-in-out; z-index: 50;
          display: grid; grid-template-rows: auto 1fr auto;
        }
        .ec-drawer.open { transform: translateX(0); }
        .ec-drawer-backdrop.open { opacity: 1; pointer-events: auto; }

        .ec-drawer-header { padding: 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(110,96,246,0.1); }
        .ec-drawer-title { font-weight: 800; font-size: 1.25rem; }
        .ec-drawer-body { padding: 24px; overflow-y: auto; }
        .ec-drawer-footer { padding: 16px; border-top: 1px solid rgba(110,96,246,0.1); background: #f8f7ff; }
        
        .ec-content-heading { font-size: 1.1rem; font-weight: 700; margin: 1.5rem 0 0.5rem 0; color: var(--ec-text); border-bottom: 2px solid rgba(155,140,255,0.2); padding-bottom: 0.25rem; }
        .ec-content-section { margin-bottom: 1rem; }
        .ec-content-title { font-weight: 700; color: var(--ec-primary-strong); margin-bottom: 6px; }
        .ec-content-text { color: var(--ec-text); line-height: 1.7; margin: 0.5rem 0; }
        .ec-content-highlight { background: rgba(155,140,255,0.08); padding: 12px; border-radius: 8px; border-left: 3px solid var(--ec-primary); margin: 1rem 0; font-style: italic; }
        .ec-content-divider { border: none; height: 1px; background-color: rgba(155,140,255,0.2); margin: 2rem 0; }
        .ec-content-meta { font-size: 0.9rem; color: var(--ec-muted); text-align: center; margin-top: 2rem; }

        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="ec-container">
        <header className="ec-header">
          <h1 className="ec-header-title">LinkedIn Mastery Roadmap</h1>
          <p className="ec-header-sub">
            Complete the modules step-by-step to level up your professional presence and unlock new opportunities.
          </p>

          <div className="ec-card ec-progress-card">
            <div className="ec-progress-row">
              <span className="ec-progress-label">Overall Progress</span>
              <span className="ec-progress-value">{completedModules} / {totalModules} Modules</span>
            </div>
            <div className="ec-progress-track">
              <div className="ec-progress-bar" style={{ width: `${overallProgress}%` }} />
            </div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
              <button
                className="ec-btn primary"
                disabled={!allCompleted}
                onClick={() => navigate('/profile-upload')}
              >
                {allCompleted ? 'Proceed to Profile Upload' : 'Complete all modules to proceed'}
              </button>
            </div>
          </div>
        </header>

        <main>
          <h2 className="ec-roadmap-title">Course Modules</h2>
          <div className="ec-modules-list">
            {modules.map((m, index) => {
              const isLocked = index > 0 && !modules[index - 1].isCompleted;
              const statusClass = m.isCompleted ? 'completed' : isLocked ? 'locked' : '';

              return (
                <div key={m.id} className={`ec-module-item ${statusClass}`} style={{ '--i': index } as React.CSSProperties}>
                  <div className="ec-module-connector">
                    {isLocked ? '🔒' : (m.isCompleted ? '✔' : m.badge)}
                  </div>
                  <div className="ec-card ec-module-content">
                    <div className="ec-module-info">
                      <h4>{m.title}</h4>
                      <p>{m.description}</p>
                    </div>
                    <button 
                      className={`ec-btn ${m.isCompleted ? 'secondary' : 'primary'}`} 
                      onClick={() => !isLocked && setOpenModuleId(m.id)}
                      disabled={isLocked}
                    >
                       {isLocked ? 'Locked' : (m.isCompleted ? 'Review' : 'Start')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>

      <div className={`ec-drawer-backdrop ${activeModule ? "open" : ""}`} onClick={() => setOpenModuleId(null)} />
      <aside className={`ec-drawer ${activeModule ? "open" : ""}`}>
        {activeModule && (
          <>
            <div className="ec-drawer-header">
              <h3 className="ec-drawer-title">{activeModule.title}</h3>
              <button className="ec-btn secondary" onClick={() => setOpenModuleId(null)}>Close</button>
            </div>
            <div className="ec-drawer-body">
              {renderStructuredContent(activeModule.content)}
            </div>
            <div className="ec-drawer-footer">
                <button 
                    className={`ec-btn ${activeModule.isCompleted ? 'secondary' : 'primary'}`}
                    onClick={() => toggleModuleComplete(activeModule.id)}
                    style={{width: '100%'}}
                >
                    {activeModule.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}