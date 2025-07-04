#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import fs from "fs";
import path from "path";

const API_KEY = process.env.UNSPLASH_API_KEY;
if (!API_KEY) {
  throw new Error("UNSPLASH_API_KEY environment variable is required");
}

const server = new McpServer({
  name: "unsplash-server",
  version: "0.1.0",
});

const unsplashApi = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${API_KEY}`,
  },
});

server.tool(
  "download_unsplash_images",
  {
    query: z.string().describe("Search query for images"),
    count: z
      .number()
      .min(1)
      .max(10)
      .optional()
      .describe("Number of images to download (1-10)"),
    download_path: z
      .string()
      .optional()
      .describe("The path to download the images to."),
    filename: z
      .string()
      .optional()
      .describe(
        "The desired filename for the image(s). Extension is not needed."
      ),
  },
  async ({
    query,
    count = 5,
    download_path = "/Users/hp/Downloads",
    filename,
  }) => {
    try {
      const response = await unsplashApi.get("/search/photos", {
        params: {
          query,
          per_page: count,
        },
      });

      const images = response.data.results;
      const downloadPromises = images.map(async (image: any, index: number) => {
        const imageUrl = image.urls.regular;
        const imageResponse = await axios.get(imageUrl, {
          responseType: "arraybuffer",
        });
        const slugify = (str: string) =>
          str
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");

        let imageName;
        if (filename) {
          const name = filename.replace(/\.[^/.]+$/, ""); // remove extension if present
          imageName = count > 1 ? `${name}-${index + 1}.jpg` : `${name}.jpg`;
        } else {
          const description =
            image.alt_description || image.description || query || image.id;
          imageName = `${slugify(description)}.jpg`;
        }

        if (!fs.existsSync(download_path)) {
          fs.mkdirSync(download_path, { recursive: true });
        }
        const imagePath = path.join(download_path, imageName);
        fs.writeFileSync(imagePath, imageResponse.data);
        return `Downloaded ${imageName}`;
      });

      const downloadResults = await Promise.all(downloadPromises);

      return {
        content: [
          {
            type: "text",
            text: downloadResults.join("\n"),
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          content: [
            {
              type: "text",
              text: `Unsplash API error: ${
                error.response?.data.errors?.[0] ?? error.message
              }`,
            },
          ],
          isError: true,
        };
      }
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(
        `Unhandled error in download_unsplash_images: ${errorMessage}`
      );
      return {
        content: [
          {
            type: "text",
            text: `An unexpected error occurred: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Unsplash MCP server running on stdio");
