# Unsplash MCP Server

An MCP server to download images from Unsplash.

### How to Install an MCP Server from GitHub

This guide walks you through the process of cloning a local MCP server from a GitHub repository, building it, and configuring your system to use it.

**Step 1: Clone the Repository**

First, you need to download the server's source code from GitHub. Open your terminal, navigate to the directory where you want to store the project, and use the `git clone` command.

```bash
# Replace the URL with the actual repository URL
git clone https://github.com/haramishra/mcp-unsplash

# Navigate into the newly created directory
cd mcp-unspalash
```

**Step 2: Install Dependencies**

Most MCP servers are built with Node.js and require you to install their dependencies, which are listed in the `package.json` file.

```bash
# Using npm
npm install

# Or if the project uses pnpm
pnpm install
```

**Step 3: Build the Server**

After installing the dependencies, you need to compile the server's source code into an executable file. This is typically done with a build script defined in `package.json`.

```bash
# Using npm
npm run build

# Or if the project uses pnpm
pnpm run build
```

This command usually creates a `build` or `dist` directory containing the compiled JavaScript file (e.g., `index.js`).

**Step 4: Configure the MCP Settings**

Now, you need to tell your application where to find and how to run the new server. This is done by editing the MCP settings file.

1.  **Locate the settings file**:

    - **VS Code**: `~/Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/mcp_settings.json`
    - **Claude Desktop App**: `~/Library/Application Support/Claude/claude_desktop_config.json`

2.  **Add the server configuration**: Open the JSON file and add a new entry to the `mcpServers` object. You will need the full path to the project you cloned in Step 1.

    ```json
    {
      "mcpServers": {
        "your-new-server-name": {
          "command": "node",
          "args": ["/path/to/your/cloned/project/build/index.js"],
          "env": {
            "UNSPLASH_API_KEY": "paste-your-api-key-here"
          }
        }
      }
    }
    ```

    - Replace `"your-new-server-name"` with a unique name for the server.
    - Update `"/path/to/your/cloned/project/build/index.js"` with the **absolute path** to the main JavaScript file created in Step 3.
    - If the server requires an API key or other secrets, add them to the `env` object. Check the server's `README.md` file to see which environment variables are required.

The server should now be installed and running.

### How to ask an AI agent to install an MCP Server

You can also ask an AI agent like Roo Code or Cline to install the MCP server for you. Just provide the git repository URL and any necessary environment variables.

**Example Prompt:**

```
I want to install an MCP server from a GitHub repository.

Here are the details:
- Repository URL: https://github.com/haramishra/mcp-unsplash
- Environment Variables:
  - UNSPLASH_API_KEY: your-api-key-goes-here

Please install the server and configure it to run.
```

The AI agent will then perform the following steps for you:

1. Clone the repository.
2. Install the dependencies.
3. Build the server.
4. Configure the MCP settings.
