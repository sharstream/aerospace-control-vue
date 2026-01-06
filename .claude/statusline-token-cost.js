#!/usr/bin/env node

// Claude Code Token Cost Status Line (Enhanced with Chalk)
// Displays real-time token usage and costs with beautiful terminal colors

// Force chalk to use colors (important for VS Code terminal)
process.env.FORCE_COLOR = '3';
const chalk = require('chalk');
const { execSync } = require('child_process');
const path = require('path');

// Read JSON input from stdin
let input = '';
process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    displayStatusLine(data);
  } catch (err) {
    console.error(chalk.red.bold('Error parsing JSON:'), err.message);
    process.exit(1);
  }
});

function displayStatusLine(data) {
  const modelId = data.model.id;
  const modelName = data.model.display_name;
  const cwd = data.workspace.current_dir;
  const projectDir = data.workspace.project_dir;
  const usage = data.context_window.current_usage;

  const totalInput = parseInt(data.context_window.total_input_tokens, 10) || 0;
  const totalOutput = parseInt(data.context_window.total_output_tokens, 10) || 0;

  // Anthropic Pricing (per million tokens)
  const pricing = getPricingForModel(modelId);

  // Calculate current context costs
  let contextPct = 0;
  let inputTokens = 0;
  let cacheCreation = 0;
  let cacheRead = 0;

  if (usage && usage !== null) {
    inputTokens = parseInt(usage.input_tokens, 10) || 0;
    cacheCreation = parseInt(usage.cache_creation_input_tokens, 10) || 0;
    cacheRead = parseInt(usage.cache_read_input_tokens, 10) || 0;

    const contextSize = data.context_window.context_window_size;
    const currentTokens = inputTokens + cacheCreation + cacheRead;
    contextPct = Math.round((currentTokens / contextSize) * 100);
  }

  // Calculate cumulative session costs
  const sessionInputCost = (totalInput / 1000000) * pricing.input;
  const sessionOutputCost = (totalOutput / 1000000) * pricing.output;
  const sessionCost = sessionInputCost + sessionOutputCost;

  // Get git branch with enhanced styling (use projectDir for git operations)
  let gitBranch = '';
  let gitStatus = '';
  try {
    // Use projectDir to ensure we're querying the git repo root
    const gitDir = projectDir || cwd;
    const branch = execSync('GIT_OPTIONAL_LOCKS=0 git symbolic-ref --short HEAD 2>/dev/null || GIT_OPTIONAL_LOCKS=0 git rev-parse --short HEAD 2>/dev/null', {
      cwd: gitDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();

    if (branch) {
      // Check for uncommitted changes
      try {
        const status = execSync('GIT_OPTIONAL_LOCKS=0 git status --porcelain', {
          cwd: gitDir,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'ignore']
        }).trim();

        if (status) {
          gitStatus = ` ${chalk.yellow('*')}`; // Yellow asterisk for uncommitted changes
        } else {
          gitStatus = ` ${chalk.green('✓')}`; // Green checkmark for clean
        }
      } catch (e) {
        // Ignore status check errors
      }

      gitBranch = ` ${chalk.dim('[')}${chalk.hex('#FF79C6').bold('⎇')} ${chalk.hex('#50FA7B').bold(branch)}${gitStatus}${chalk.dim(']')}`;
    }
  } catch (e) {
    // Not a git repo or error
  }

  // Build elegant status line with chalk
  const parts = [];

  // Model name with gradient-like effect
  parts.push(`${chalk.bold.cyan('◆')} ${chalk.bold.white(modelName)}`);

  // Session cost with color based on amount
  const costColor = getCostColor(sessionCost);
  parts.push(chalk.bold(costColor(`$${sessionCost.toFixed(4)}`)));

  // Token counts with icons and colors
  const inputStr = formatNumber(totalInput);
  const outputStr = formatNumber(totalOutput);
  parts.push(
    chalk.green('↑') + chalk.hex('#4ADE80')(inputStr)
    + chalk.dim(' · ')
    + chalk.blue('↓') + chalk.hex('#60A5FA')(outputStr)
  );

  // Context window with visual bar
  const contextBar = createContextBar(contextPct);
  const contextColor = getContextColor(contextPct);
  parts.push(`${contextBar} ${contextColor(`${contextPct}%`)}`);

  // Project directory (show project root name)
  const projectName = path.basename(projectDir);
  const currentDirName = path.basename(cwd);

  // If we're in a subdirectory, show both project and current dir
  let dirDisplay;
  if (projectDir !== cwd) {
    dirDisplay = chalk.hex('#8B5CF6').bold(projectName) + chalk.dim('/') + chalk.hex('#A78BFA')(currentDirName);
  } else {
    dirDisplay = chalk.hex('#8B5CF6').bold(projectName);
  }

  parts.push(`${chalk.hex('#6366F1')('📁')} ${dirDisplay}${gitBranch}`);

  // Join all parts with elegant separators
  const separator = chalk.dim(' │ ');
  process.stdout.write(parts.join(separator));
}

function getPricingForModel(modelId) {
  // Anthropic Pricing (per million tokens) - Updated as of Jan 2025
  if (modelId.includes('opus-4') || modelId.includes('opus')) {
    return {
      input: 15.00,
      output: 75.00,
      cacheWrite: 3.75,
      cacheRead: 1.50
    };
  }
    // Sonnet or default
    return {
      input: 3.00,
      output: 15.00,
      cacheWrite: 0.75,
      cacheRead: 0.30
    };
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getCostColor(cost) {
  if (cost < 0.01) return chalk.hex('#22C55E'); // Green
  if (cost < 0.05) return chalk.hex('#EAB308'); // Yellow
  if (cost < 0.10) return chalk.hex('#F97316'); // Orange
  return chalk.hex('#EF4444'); // Red
}

function getContextColor(pct) {
  if (pct < 50) return chalk.hex('#22C55E'); // Green
  if (pct < 75) return chalk.hex('#EAB308'); // Yellow
  if (pct < 90) return chalk.hex('#F97316'); // Orange
  return chalk.hex('#EF4444'); // Red
}

function createContextBar(pct) {
  const barLength = 8;
  const filled = Math.round((pct / 100) * barLength);
  const empty = barLength - filled;

  let bar = '';
  const color = getContextColor(pct);

  // Create a gradient-style bar
  for (let i = 0; i < filled; i++) {
    bar += color('█');
  }
  for (let i = 0; i < empty; i++) {
    bar += chalk.dim('░');
  }

  return bar;
}
