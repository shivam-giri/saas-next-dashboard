const fs = require('fs');
const https = require('https');

const encodeBase64 = (str) => Buffer.from(str).toString('base64');

const diagrams = [
  {
    name: 'onboarding-flow',
    code: `flowchart TD
    A[Landing Page \`/\`] --> B[Click 'Get Started']
    B --> C{Has Account?}
    C -- No --> D[Sign Up \`/auth/signup\`]
    C -- Yes --> E[Sign In \`/auth/signin\`]
    D --> F{OAuth or Email?}
    F -- Google/GitHub --> G[Auto-Verify & Login]
    F -- Email/Password --> H[Verify Email]
    G --> I
    H --> I[Login Success]
    I --> J{Has Workspace?}
    J -- Yes --> K[Redirect to \`/dashboard/[slug]\`]
    J -- No --> L[Redirect to \`/onboarding\`]
    L --> M[Enter Workspace Name]
    M --> N[Create Workspace]
    N --> K`
  },
  {
    name: 'ai-generation-flow',
    code: `flowchart TD
    A[Dashboard Home] --> B[Navigate to \`/brand\`]
    B --> C[Configure Brand Voice]
    C --> D[Navigate to \`/campaigns\`]
    D --> E[Click 'New Campaign']
    E --> F[Enter Topic & Select Formats]
    F --> G[Deduct Credits & Call Gemini AI]
    G --> H[Campaign Created]
    H --> I[Open Campaign Details]
    I --> J[View Generated Documents]
    J --> K{Need Edits?}
    K -- Yes --> L[Edit Inline & Save]
    K -- No --> M[Submit for Review]`
  },
  {
    name: 'team-review-flow',
    code: `flowchart TD
    A[Admin navigates to \`/team\`] --> B[Enter Colleague Email & Send Invite]
    B --> C[Email sent via Gmail SMTP]
    C --> D[Colleague clicks link in email]
    D --> E[Navigates to \`/invite/[token]\`]
    E --> F{Has Account?}
    F -- No --> G[Sign Up via OAuth/Email]
    F -- Yes --> H[Auto-join Workspace]
    G --> H
    H --> I[Member navigates to \`/campaigns\`]
    I --> J[Member edits Draft & Submits for Review]
    J --> K[Admin opens Campaign Details]
    K --> L{Admin Decision}
    L -- Reject --> M[Leave 'Admin Feedback' comment & Reject]
    M --> N[Member reads feedback & edits]
    N --> J
    L -- Approve --> O[Mark as APPROVED]
    O --> P[Copy to Clipboard & Publish]`
  },
  {
    name: 'backend-schema-er',
    code: `erDiagram
    USER ||--o{ ACCOUNT : has
    USER ||--o{ SESSION : has
    USER ||--o{ WORKSPACEMEMBER : "belongs to"
    USER ||--o{ WORKSPACEINVITATION : "invites"
    USER ||--o{ CONTENTDOCUMENT : "creates"

    WORKSPACE ||--o{ WORKSPACEMEMBER : contains
    WORKSPACE ||--o{ WORKSPACEINVITATION : issues
    WORKSPACE ||--|| BRANDVOICE : configures
    WORKSPACE ||--o{ CAMPAIGN : owns
    WORKSPACE ||--o{ CONTENTDOCUMENT : stores

    CAMPAIGN ||--o{ CONTENTDOCUMENT : groups

    USER {
        String id PK
        String name
        String email
        String password
    }
    WORKSPACE {
        String id PK
        String name
        String slug
        Int creditsRemaining
    }
    WORKSPACEMEMBER {
        String id PK
        Enum role
    }
    BRANDVOICE {
        String id PK
        String tone
        String targetAudience
    }
    CAMPAIGN {
        String id PK
        String topic
        Enum status
    }
    CONTENTDOCUMENT {
        String id PK
        Enum type
        Enum status
        String content
        String adminComments
    }`
  }
];

const themeStr = '{"theme": "dark", "backgroundColor": "transparent"}';

diagrams.forEach(diag => {
  const state = { code: diag.code, mermaid: JSON.parse(themeStr) };
  const base64 = encodeBase64(JSON.stringify(state));
  const url = `https://mermaid.ink/svg/${base64}`;
  
  https.get(url, (res) => {
    const file = fs.createWriteStream(`public/${diag.name}.svg`);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${diag.name}.svg`);
    });
  }).on('error', (err) => {
    console.error(err);
  });
});
