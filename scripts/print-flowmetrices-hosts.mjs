#!/usr/bin/env node
/**
 * Prints the /etc/hosts lines for local flowmetrices.com → this machine.
 * Append manually (requires sudo), e.g.: sudo sh -c 'cat >> /etc/hosts' <<'EOF'
 */
const lines = ['127.0.0.1 flowmetrices.com', '127.0.0.1 www.flowmetrices.com']

console.info('')
console.info('Add these lines to /etc/hosts (macOS/Linux), then open:')
console.info('  http://flowmetrices.com:5174     (npm run dev)')
console.info('  http://flowmetrices.com:4174     (npm run preview)')
console.info('')
console.info(lines.join('\n'))
console.info('')
console.info('Append with sudo (prints hosts lines into the file):')
console.info(
  "  printf '%s\\n' '127.0.0.1 flowmetrices.com' '127.0.0.1 www.flowmetrices.com' | sudo tee -a /etc/hosts",
)
console.info('')
