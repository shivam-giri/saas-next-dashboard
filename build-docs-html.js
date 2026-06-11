const fs = require('fs');
const path = require('path');
const https = require('https');
const { marked } = require('marked');

const docsDir = path.join(__dirname, 'src', 'docs');
const outDir = path.join(__dirname, 'public', 'docs-images');
const outFile = path.join(__dirname, 'public', 'documentation.html');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const files = [
  "PRD.md",
  "TRD.md",
  "App_Flow.md",
  "UI_UX_Design_Brief.md",
  "Backend_Schema.md",
  "Build_Sequence.md"
];

async function fetchMermaidSvg(mermaidCode) {
  return new Promise((resolve, reject) => {
    // Add kroki theme configuration for better looking diagrams
    const data = `%%{init: {'theme':'base'}}%%\n` + mermaidCode;
    const options = {
      hostname: 'kroki.io',
      port: 443,
      path: '/mermaid/svg',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function processMarkdown() {
  let finalMarkdown = '# SaaSify Master Documentation\n\n';
  let imageCounter = 0;

  for (const file of files) {
    const filePath = path.join(docsDir, file);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Find all mermaid blocks
    const mermaidRegex = /```mermaid([\s\S]*?)```/g;
    let match;
    const replacements = [];
    
    while ((match = mermaidRegex.exec(content)) !== null) {
      const code = match[1].trim();
      imageCounter++;
      const imageName = `mermaid-${imageCounter}.svg`;
      const imagePath = path.join(outDir, imageName);
      
      console.log(`Generating image for ${file} -> ${imageName}...`);
      const svgCode = await fetchMermaidSvg(code);
      fs.writeFileSync(imagePath, svgCode);
      
      replacements.push({
        original: match[0],
        replacement: `\n\n<img src="/docs-images/${imageName}" alt="Flowchart" style="max-width: 100%; border-radius: 8px; margin: 20px auto; display: block;" />\n\n`
      });
    }
    
    // Replace blocks from bottom to top to avoid index shifting
    for (const rep of replacements) {
      content = content.replace(rep.original, rep.replacement);
    }
    
    finalMarkdown += `\n\n---\n\n## Document: ${file}\n\n` + content;
  }

  // Parse markdown
  const htmlContent = marked.parse(finalMarkdown);
  
  const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaSify Documentation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 40px 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        h1, h2, h3, h4 { color: #111; }
        h1 { border-bottom: 2px solid #eaecef; padding-bottom: 10px; }
        h2 { border-bottom: 1px solid #eaecef; padding-bottom: 8px; margin-top: 40px; }
        pre { background: #f6f8fa; padding: 16px; border-radius: 8px; overflow-x: auto; }
        code { background: #f6f8fa; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 90%; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        table th, table td { border: 1px solid #dfe2e5; padding: 8px 12px; text-align: left; }
        table th { background: #f6f8fa; }
        a { color: #0366d6; text-decoration: none; }
        a:hover { text-decoration: underline; }
        hr { border: 0; border-top: 1px solid #eaecef; margin: 40px 0; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    <div class="container">
        ${htmlContent}
    </div>
</body>
</html>`;

  fs.writeFileSync(outFile, finalHtml);
  console.log('Successfully generated public/documentation.html with image flowcharts!');
}

processMarkdown().catch(console.error);
