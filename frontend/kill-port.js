import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function killPort(port) {
  try {
    // For Windows
    if (process.platform === 'win32') {
      const { stdout } = await execPromise(`netstat -ano | findstr :${port}`);
      const lines = stdout.split('\n');
      
      for (const line of lines) {
        if (line.includes(`:${port}`)) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          
          if (pid && !isNaN(pid)) {
            try {
              await execPromise(`taskkill /PID ${pid} /F`);
              console.log(`Process with PID ${pid} using port ${port} has been terminated.`);
            } catch (error) {
              console.log(`Failed to kill process with PID ${pid}: ${error.message}`);
            }
          }
        }
      }
    } 
    // For Unix-like systems (macOS, Linux)
    else {
      const { stdout } = await execPromise(`lsof -i :${port} -t`);
      const pids = stdout.trim().split('\n').filter(pid => pid);
      
      for (const pid of pids) {
        if (pid) {
          try {
            await execPromise(`kill -9 ${pid}`);
            console.log(`Process with PID ${pid} using port ${port} has been terminated.`);
          } catch (error) {
            console.log(`Failed to kill process with PID ${pid}: ${error.message}`);
          }
        }
      }
    }
  } catch (error) {
    // If no process is found using the port, this is not an error
    if (!error.message.includes('ENOENT') && !error.message.includes('No Process found')) {
      console.log(`Error checking port ${port}: ${error.message}`);
    }
  }
}

// Get port from command line argument or default to 5173
const port = process.argv[2] || 5173;

killPort(port).then(() => {
  console.log(`Checked port ${port} and terminated any processes using it.`);
});