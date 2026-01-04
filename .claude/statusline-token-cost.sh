#!/bin/bash

# Claude Code Token Cost Status Line
# Displays real-time token usage and costs based on Anthropic pricing

# Read JSON input from stdin
input=$(cat)

# Extract values from JSON
model_id=$(echo "$input" | jq -r '.model.id')
model_name=$(echo "$input" | jq -r '.model.display_name')
cwd=$(echo "$input" | jq -r '.workspace.current_dir')
output_style=$(echo "$input" | jq -r '.output_style.name')
usage=$(echo "$input" | jq '.context_window.current_usage')

# Get cumulative totals
total_input=$(echo "$input" | jq -r '.context_window.total_input_tokens')
total_output=$(echo "$input" | jq -r '.context_window.total_output_tokens')

# Anthropic Pricing (per million tokens) - Updated as of Jan 2025
# Claude Opus 4.5: $15 input / $75 output
# Claude Sonnet 4.5: $3 input / $15 output (Bedrock via AWS)
# Note: Cache write prices are 25% of input prices, cache read is 10% of input

case "$model_id" in
  *"opus-4"*)
    input_price=15.00
    output_price=75.00
    cache_write_price=3.75
    cache_read_price=1.50
    ;;
  *"sonnet-4"*)
    input_price=3.00
    output_price=15.00
    cache_write_price=0.75
    cache_read_price=0.30
    ;;
  *"opus"*)
    input_price=15.00
    output_price=75.00
    cache_write_price=3.75
    cache_read_price=1.50
    ;;
  *"sonnet"*)
    input_price=3.00
    output_price=15.00
    cache_write_price=0.75
    cache_read_price=0.30
    ;;
  *)
    input_price=3.00
    output_price=15.00
    cache_write_price=0.75
    cache_read_price=0.30
    ;;
esac

# Calculate current context costs (if usage exists)
if [ "$usage" != "null" ]; then
  input_tokens=$(echo "$usage" | jq -r '.input_tokens')
  output_tokens=$(echo "$usage" | jq -r '.output_tokens')
  cache_creation=$(echo "$usage" | jq -r '.cache_creation_input_tokens')
  cache_read=$(echo "$usage" | jq -r '.cache_read_input_tokens')

  # Calculate current context cost
  current_input_cost=$(awk "BEGIN {printf \"%.6f\", ($input_tokens / 1000000) * $input_price}")
  current_output_cost=$(awk "BEGIN {printf \"%.6f\", ($output_tokens / 1000000) * $output_price}")
  current_cache_write_cost=$(awk "BEGIN {printf \"%.6f\", ($cache_creation / 1000000) * $cache_write_price}")
  current_cache_read_cost=$(awk "BEGIN {printf \"%.6f\", ($cache_read / 1000000) * $cache_read_price}")
  current_cost=$(awk "BEGIN {printf \"%.4f\", $current_input_cost + $current_output_cost + $current_cache_write_cost + $current_cache_read_cost}")

  # Calculate context window percentage
  context_size=$(echo "$input" | jq '.context_window.context_window_size')
  current_tokens=$((input_tokens + cache_creation + cache_read))
  context_pct=$((current_tokens * 100 / context_size))
else
  current_cost="0.0000"
  context_pct=0
fi

# Calculate cumulative session costs
session_input_cost=$(awk "BEGIN {printf \"%.6f\", ($total_input / 1000000) * $input_price}")
session_output_cost=$(awk "BEGIN {printf \"%.6f\", ($total_output / 1000000) * $output_price}")
session_cost=$(awk "BEGIN {printf \"%.4f\", $session_input_cost + $session_output_cost}")

# Format tokens with commas
format_tokens() {
  printf "%'d" "$1" 2>/dev/null || echo "$1"
}

total_input_fmt=$(format_tokens "$total_input")
total_output_fmt=$(format_tokens "$total_output")

# Get git branch if in a git repo (skip git locks)
git_branch=""
if git rev-parse --git-dir > /dev/null 2>&1; then
  branch=$(GIT_OPTIONAL_LOCKS=0 git symbolic-ref --short HEAD 2>/dev/null || GIT_OPTIONAL_LOCKS=0 git rev-parse --short HEAD 2>/dev/null)
  if [ -n "$branch" ]; then
    git_branch=" (${branch})"
  fi
fi

# Build status line with color codes (dimmed in terminal)
printf "\033[0;36m%s\033[0m" "$model_name"  # Cyan model name
printf " | "
printf "\033[0;33m\$%.4f\033[0m" "$session_cost"  # Yellow session cost
printf " | "
printf "\033[0;32m%s↑ %s↓\033[0m" "$total_input_fmt" "$total_output_fmt"  # Green tokens
printf " | "
printf "\033[0;35m%d%% ctx\033[0m" "$context_pct"  # Magenta context
printf " | "
printf "\033[0;34m%s\033[0m" "$(basename "$cwd")"  # Blue directory
printf "\033[0;90m%s\033[0m" "$git_branch"  # Gray git branch
