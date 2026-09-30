# Unified Retail Experience with Virtual Try-On

### Overview

In today's rapidly evolving retail landscape, customers increasingly seek a seamless blend of online shopping convenience with the immediacy of in-store experiences. To tackle the challenges faced by customers navigating between online and offline retail—managing multiple carts, comparing prices, or physically inspecting items—we have developed a unified retail system. This solution integrates online and offline shopping carts and introduces a virtual try-on feature, offering a smooth, adaptable retail experience for modern, tech-savvy customers.

### Functionalities

Our solution addresses the following challenges:

- **Unified Shopping Cart:** Customers can manage both online and offline shopping carts in one system, streamlining the decision-making process and saving time.
- **Price Comparison:** The system allows customers to compare prices across various platforms, ensuring they get the best deals.
- **Virtual Try-On:** A virtual try-on feature lets customers digitally try on clothes, whether shopping online or in-store, enhancing their shopping experience.
- **Seamless Shopping Experience:** By blending online and offline shopping, the system caters to customers who want to make prompt, well-informed decisions without delays.

### Prerequisites

Before you begin, ensure you have met the following requirements:

- **Operating System:** Windows, macOS, or Linux.
- **Node.js:** Version 14.x or higher.
- **Python:** Version 3.7 or 64 bit.
- **MongoDB:** Version 4.x or higher.
- **Flask:** Version 1.1.2 
- **TensorFlow:** Version 1.15.0
- **OpenCV:** Version 4.2
- **DeepFashion-MultiModal Dataset:** Download and set up the dataset from [DeepFashion](http://mmlab.ie.cuhk.edu.hk/projects/DeepFashion.html).

### Installation

Follow these steps to set up the project:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/unified-retail-experience.git
   cd unified-retail-experience
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install --legacy-peer-deps
   node server.js
   ```

3. **Set up the MongoDB database:**
   - Ensure MongoDB is running locally or configure your cloud MongoDB URI in `backend/config.py`.

4. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Run the Virtual-TryOn server:**
   Set Root directory in .env file
   
   - **Create Virtual Environment (Python 3.7):**
     ```bash
     cd virtual-tryon
     pip install -r requirements.txt
     ```
   - **Backend (Flask):**
     ```venv
     cd virtual-tryon
     cd src/flask_app
     flask run --host=0.0.0.0 --port=8080
     ```

7. **Set up TensorFlow models:**
   - Load and configure the pre-trained models for the virtual try-on feature in the `models/` directory.
     ```
     cd virtual-tryon/src/cmate/segmentation/models
     sh get_models.sh
     ```

### Contributors

- **Deependra:** Lead Backend Developer, MongoDB Setup.
- **Ritu:** Lead Frontend Developer, React Components, Tailwind CSS Design.
- **Khyati:** Machine Learning Engineer, Flask Integration, Virtual Try-On Feature.
- **Ansh:** Data Scientist, DeepFashion-MultiModal Dataset Processing, OpenCV Integration.

### Contributions

- Ansh Kumar (github id - https://github.com/Ansh8052 )
- Khyati Gupta ( github id - https://github.com/khyatig0206 )
- Deependra Kumar (github id - https://github.com/Deependra-K)
- Ritu Verma (github id - https://github.com/Ritu29verma)

### Acknowledgments

We would like to thank the creators of the DeepFashion-MultiModal dataset and the open-source community for their invaluable resources that made this project possible.
