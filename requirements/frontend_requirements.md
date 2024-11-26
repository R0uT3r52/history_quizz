# Project Overview

Use this guide to build a web app, where users can take quizzes on various topics. Users will use a mobile device to take the quizzes. 

# Feature requirements

- We will use Next.js, Shadcn for the frontend.
- Create a homepage, where users can see quizzes as a cards. Each card will have a short description, thumbnail image and percentage rate of correct answers from current user. If users click the card, quiz starts. Cards should be clickable. In UI cards must be located in /components/ui/carousel.tsx component.
- Create a quiz page, where users can take a quiz. Quiz page should have a question counter, timer and question itself.
- Have a nice UI & animations when user clicks the answer.
- After quiz is finished, show user results with a chart of correct and wrong answers.

# Current files structure

MY-QUIZ-APP
├── .next
├── app
├── components
│   └── ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       └── chart.tsx
├── lib
├── node_modules
├── requirements
│   └── frontend_instructions.md
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json


# Rules
- All new components should be located in /components folder and be named like example-component.tsx unless otherwise specified.
- All new pages should be located in /app folder.
