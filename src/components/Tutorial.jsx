import { useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiCompass, FiLink, FiYoutube, FiArrowLeft } from "react-icons/fi";
import { TiLocationArrow } from "react-icons/ti";

const Tutorial = () => {
  const [activeSection, setActiveSection] = useState("getting-started");
  
  const tutorialData = {
    title: "Complete Tutorial Guide",
    subtitle: "Detailed step-by-step instructions for using the exploit script",
    sections: {
      "getting-started": {
        title: "Getting Started",
        description: "Learn how to set up and run the exploit script properly.",
        steps: [
          {
            id: 1,
            title: "Installation",
            description: "Step-by-step instructions to install all required components.",
            content: [
              "1. Download the script package from our official website",
              "2. Extract the zip file to your preferred directory",
              "3. Open terminal/command prompt in the extracted folder",
              "4. Run `npm install` to install all dependencies",
              "5. Verify installation by running `node --version`"
            ],
            videoId: "dQw4w9WgXcQ",
            duration: "3 min",
            tips: [
              "Make sure you have all dependencies installed",
              "Run the script with admin privileges for best results",
              "Check system requirements before starting"
            ]
          },
          {
            id: 2,
            title: "Configuration",
            description: "How to properly configure the script for your environment.",
            content: [
              "1. Locate the `config.json` file in the main directory",
              "2. Open it with any text editor",
              "3. Modify the parameters according to your needs:",
              "   - `targetUrl`: The website you want to test",
              "   - `threads`: Number of concurrent threads (recommended: 5-10)",
              "   - `timeout`: Request timeout in milliseconds",
              "4. Save the file after making changes",
              "5. Test configuration with `node test-config.js`"
            ],
            videoId: "dQw4w9WgXcQ",
            duration: "4 min",
            tips: [
              "Backup your config files before modifying",
              "Use the sample config as a reference",
              "Test each configuration change individually"
            ]
          },
          {
            id: 3,
            title: "Initial Testing",
            description: "Running the script in test mode to verify installation.",
            content: [
              "1. Open terminal in the script directory",
              "2. Run `node test.js` to start test mode",
              "3. Observe the output for any errors",
              "4. Check generated logs in the `logs` folder",
              "5. Verify all expected files are created in `output` folder",
              "6. If everything looks good, proceed to full execution"
            ],
            videoId: "dQw4w9WgXcQ",
            duration: "2 min",
            tips: [
              "Run in a controlled environment first",
              "Check logs for any warnings or errors",
              "Verify all expected files are created"
            ]
          },
          {
            id: 4,
            title: "Troubleshooting",
            description: "Common issues and how to resolve them during setup.",
            content: [
              "Common issues and solutions:",
              "1. Missing dependencies: Run `npm install` again",
              "2. Permission errors: Run as administrator/sudo",
              "3. Network issues: Check firewall settings",
              "4. Script not working:",
              "   - Verify Node.js version (requires v14+)",
              "   - Check error logs",
              "   - Try on a different system",
              "5. Still having problems? Contact support with your logs"
            ],
            videoId: "dQw4w9WgXcQ",
            duration: "5 min",
            tips: [
              "Check the FAQ section first",
              "Verify all dependencies are up to date",
              "Search the community forum for similar issues"
            ]
          }
        ]
      },
      "first-execution": {
        title: "First Execution",
        description: "How to execute the script for the first time and verify it works.",
        steps: [
          {
            id: 1,
            title: "Basic Execution",
            description: "How to execute the script with default parameters.",
            content: [
              "1. Open terminal in the script directory",
              "2. Run the main script: `node index.js`",
              "3. The script will:",
              "   - Load configuration from config.json",
              "   - Initialize all modules",
              "   - Start scanning process",
              "4. Monitor progress in the terminal",
              "5. Results will be saved in `results` folder",
              "6. Detailed logs available in `logs` folder"
            ],
            videoId: "dQw4w9WgXcQ",
            duration: "2 min",
            tips: [
              "Run in test environment first",
              "Check console for error messages",
              "Verify output files are created"
            ]
          },
          {
            id: 2,
            title: "Parameter Customization",
            description: "Understanding and using command line parameters.",
            content: [
              "Available command line parameters:",
              "1. `--target <url>`: Override target URL",
              "2. `--threads <number>`: Set number of threads",
              "3. `--output <path>`: Custom output directory",
              "4. `--verbose`: Enable detailed logging",
              "5. `--proxy <address>`: Use proxy server",
              "",
              "Example usage:",
              "`node index.js --target example.com --threads 8 --verbose`",
              "",
              "View all options with `node index.js --help`"
            ],
            videoId: "dQw4w9WgXcQ",
            duration: "4 min",
            tips: [
              "Use --help to see all available options",
              "Start with minimal parameters first",
              "Document your parameter combinations"
            ]
          },
          {
            id: 3,
            title: "Output Analysis",
            description: "How to interpret the script's output and results.",
            content: [
              "Understanding the output:",
              "1. Terminal output shows real-time progress",
              "2. Results are saved in JSON format in `results` folder",
              "3. Key files:",
              "   - `vulnerabilities.json`: Found security issues",
              "   - `scan-summary.json`: Overall statistics",
              "   - `technical-details.json`: Raw technical data",
              "4. Log files contain detailed execution info",
              "5. Use the provided analysis tool to visualize results:",
              "   `node analyze.js results/vulnerabilities.json`"
            ],
            videoId: "dQw4w9WgXcQ",
            duration: "3 min",
            tips: [
              "Look for success indicators in the output",
              "Save output logs for future reference",
              "Compare results with expected outcomes"
            ]
          },
          {
            id: 4,
            title: "Performance Monitoring",
            description: "Monitoring script execution and resource usage.",
            content: [
              "Monitoring best practices:",
              "1. System resources:",
              "   - Monitor CPU usage (should be below 80%)",
              "   - Watch memory consumption",
              "   - Check network bandwidth",
              "2. Script performance:",
              "   - Requests per second in logs",
              "   - Error rate should be below 5%",
              "   - Thread utilization",
              "3. Optimization tips:",
              "   - Reduce threads if system overloaded",
              "   - Increase timeout if many errors",
              "   - Use proxy servers for heavy scans"
            ],
            videoId: "dQw4w9WgXcQ",
            duration: "5 min",
            tips: [
              "Use system monitoring tools",
              "Watch for memory leaks",
              "Optimize based on performance data"
            ]
          }
        ]
      },
      "advanced-features": {
        title: "Advanced Features",
        description: "Learn about advanced options and customization.",
        steps: [
          {
            id: 1,
            title: "Script Integration",
            description: "How to integrate with other tools and scripts.",
            content: [
              "Integration options:",
              "1. API Mode:",
              "   - Run `node api.js` to start REST API",
              "   - Endpoints available on port 3000",
              "   - Documentation at `/docs` endpoint",
              "2. CLI Piping:",
              "   - Pipe output to other tools:",
              "     `node index.js | grep 'vulnerability'`",
              "3. Webhook Support:",
              "   - Configure webhooks in config.json",
              "   - Get real-time notifications",
              "4. External Module System:",
              "   - Place custom modules in `modules` folder",
              "   - They'll auto-load on startup"
            ],
            videoId: "dQw4w9WgXcQ",
            duration: "7 min",
            tips: [
              "Use command line arguments for customization",
              "Modify config files for specific use cases",
              "Combine with other tools for enhanced functionality"
            ]
          },
          {
            id: 2,
            title: "Custom Modules",
            description: "Adding and developing custom modules for the script.",
            content: [
              "Creating custom modules:",
              "1. Create new file in `modules` folder",
              "2. Follow module template:",
              "   - Must export `run()` function",
              "   - Can import core libraries",
              "   - Should return standardized output",
              "3. Example module structure:",
              "   ```javascript",
              "   module.exports = {",
              "     name: 'Custom Check',",
              "     description: 'My custom vulnerability check',",
              "     async run(target) {",
              "       // Your code here",
              "       return results;",
              "     }",
              "   }",
              "   ```",
              "4. Restart script to load new modules"
            ],
            videoId: "dQw4w9WgXcQ",
            duration: "10 min",
            tips: [
              "Follow the module development guidelines",
              "Test modules in isolation first",
              "Document your custom modules"
            ]
          },
          {
            id: 3,
            title: "Automation",
            description: "Setting up automated execution and scheduling.",
            content: [
              "Automation methods:",
              "1. Cron Jobs (Linux/macOS):",
              "   ```bash",
              "   0 3 * * * cd /path/to/script && node index.js --target example.com",
              "   ```",
              "2. Task Scheduler (Windows):",
              "   - Create basic task",
              "   - Set trigger schedule",
              "   - Action: Start program",
              "   - Program: `node.exe`",
              "   - Arguments: `index.js --target example.com`",
              "3. CI/CD Pipelines:",
              "   - Add as a step in your pipeline",
              "   - Store results as artifacts",
              "4. Monitoring:",
              "   - Set up email/SMS alerts",
              "   - Check logs regularly"
            ],
            videoId: "dQw4w9WgXcQ",
            duration: "6 min",
            tips: [
              "Use cron jobs or task scheduler",
              "Implement proper error handling",
              "Set up notifications for job completion"
            ]
          },
          {
            id: 4,
            title: "Security Considerations",
            description: "Best practices for secure script execution.",
            content: [
              "Security best practices:",
              "1. Access Control:",
              "   - Restrict script access to authorized users",
              "   - Use separate user account with limited privileges",
              "2. Data Protection:",
              "   - Encrypt sensitive config data",
              "   - Secure results storage",
              "3. Network Security:",
              "   - Use VPN for sensitive targets",
              "   - Rotate proxy servers",
              "4. Audit & Compliance:",
              "   - Keep detailed activity logs",
              "   - Regular security reviews",
              "   - Obtain proper authorization before scanning",
              "5. Legal Considerations:",
              "   - Get written permission for testing",
              "   - Follow all applicable laws"
            ],
            videoId: "dQw4w9WgXcQ",
            duration: "8 min",
            tips: [
              "Run with least privilege necessary",
              "Secure sensitive configuration data",
              "Audit script regularly for vulnerabilities"
            ]
          }
        ]
      }
    }
  };

  const activeSectionData = tutorialData.sections[activeSection];

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative">
          {/* Enhanced Back Button with Shape and Hover */}
          <motion.button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-blue-400 hover:text-blue-300 font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft className="text-lg" />
            <span>Back</span>
          </motion.button>
          
          <h1 className="text-3xl font-bold text-center">{tutorialData.title}</h1>
          
          {/* Tutorial Indicator with Shape and Hover */}
          <motion.div 
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Tutorial</span>
          </motion.div>
        </div>

        <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
          {tutorialData.subtitle}
        </p>

        {/* Section Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(tutorialData.sections).map(([key, section]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeSection === key 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
                }`}
              >
                {key === 'getting-started' && <FiUser className="text-sm" />}
                {key === 'first-execution' && <FiCompass className="text-sm" />}
                {key === 'advanced-features' && <FiLink className="text-sm" />}
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900 rounded-xl p-6 mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">{activeSectionData.title}</h2>
          <p className="text-gray-300 mb-6">{activeSectionData.description}</p>

          <div className="space-y-8">
            {activeSectionData.steps.map((step) => (
              <motion.div 
                key={step.id}
                className="bg-gray-800 rounded-lg p-6"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white font-bold">{step.id}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </div>

                <div className="ml-14 pl-2 border-l-2 border-gray-700">
                  <div className="prose prose-invert max-w-none">
                    <ul className="space-y-2">
                      {step.content.map((item, index) => (
                        <li key={index} className="text-gray-300">
                          {item.includes('```') ? (
                            <pre className="bg-gray-900 p-3 rounded-md overflow-x-auto">
                              <code>{item.replace('```', '').trim()}</code>
                            </pre>
                          ) : (
                            item
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {step.tips && step.tips.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-700">
                      <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                        PRO TIPS & TRICKS
                      </h4>
                      <ul className="space-y-3">
                        {step.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="bg-blue-500/20 rounded-full p-1 mt-0.5">
                              <TiLocationArrow className="text-blue-400 text-xs" />
                            </div>
                            <span className="text-gray-300 text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {step.duration}
                    </span>
                    <button 
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                      onClick={() => window.open(`https://youtube.com/watch?v=${step.videoId}`, '_blank')}
                    >
                      <FiYoutube />
                      Watch Video Tutorial
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Need more help?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join our community forum or contact support for additional assistance with the script.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-full transition-colors">
              Community Forum
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-full transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
