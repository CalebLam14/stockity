# Stockity

Stockity is an inventory tracking app where you can add, edit and remove products along with their stocks. This is a submission for Shopify Backend Developer Intern 
Challenge 2022.

## Running the Application

You can run the app using multiple methods.

### Environment Setup

The following steps in this section are all _mandatory_!

1. **Make sure [Node.js](https://nodejs.org/) is installed!**
2. **Install Yarn using `npm install -g yarn`.**

### Running the API and website separately

1. Clone the project to your directory with `git clone https://github.com/CalebLam14/stockity`.
2. Open a command line (in the `stockity` repo) and go to the `stockity-api` directory using `cd stockity-api`.
3. Run `yarn install`, then `yarn start` after finishing. Feel free to wait for the API to finish setting up.
4. Open another command line and go to the `stockity-site` directory using `cd stockity-site`.
5. Run `yarn install`, then `yarn start` after finishing. Feel free to wait for the website to finish setting up.
6. The API is available at `http://localhost:8000`; and the website is available at `http://localhost:3000`.
7. To stop each process, use Ctrl/Cmd + C in each command line. If asked, terminate the batch job by responding with `Y`.

### Running the API and website in one command

1. Clone the project to your directory with `git clone https://github.com/CalebLam14/stockity`.
2. Open a command line (in the `stockity` repo), then run `yarn install` to install the necessary dependencies for Yarn to run the app.
3. Run `yarn start`. This will initialize both the API and website repositories and run both of them concurrently.
4. Wait for both the API and the website to finish setting up. If all goes well, then the Stockity website should appear in your browser.
5. To stop both processes, press Ctrl/Cmd + C, then keep pressing Enter or Ctrl/Cmd + C until the command is finished. If asked, terminate the batch job by responding with `Y`.

## Using the App

- Click on the "+" button on the top left to create a product.
- Click on a product you created to view its details.
- On the top right, you can click on the pencil button to edit and trash bin button to delete it.
