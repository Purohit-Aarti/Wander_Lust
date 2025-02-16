
## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Cloudinary account
- Mapbox account

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/Purohit-Aarti/Wander_Lust.git
    cd wanderlust
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```env
    CLOUD_NAME=your_cloudinary_cloud_name
    CLOUD_API_KEY=your_cloudinary_api_key
    CLOUD_API_SECRET=your_cloudinary_api_secret
    MAP_TOKEN=your_mapbox_token
    ATLASDB_URL=your_mongodb_atlas_url
    SECRET=your_session_secret
    ```

4. Initialize the database with sample data:
    ```sh
    node init/index.js
    ```

5. Start the server:
    ```sh
    npm start
    ```

6. Open your browser and navigate to `http://localhost:8080`.

## Deployed Link

You can access the deployed application [here](https://wander-lust-ybcs.onrender.com/listings).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any inquiries, please contact [Aarati](mailto:rti.raj.15nov2002@gmail.com).

---
