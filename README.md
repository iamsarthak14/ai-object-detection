# AI Object Detection Project 🔍

A modern web application that performs real-time object detection using YOLO models. Built with a Python Flask backend and React/Next.js frontend.

## ✨ Features

- Real-time object detection using YOLO models
- User-friendly web interface
- Support for image uploads
- Instant visual feedback with bounding boxes
- Multiple object class detection
- Confidence score display

## 🛠️ Tech Stack

- **Frontend**: React, Next.js, TailwindCSS
- **Backend**: Python, Flask
- **ML Model**: YOLO (YOLOv8)

## 🚀 Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/iamsarthak14/ai-object-detection.git
   cd ai-object-detection
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:

   ```bash
   cd ../ui
   npm install
   ```

4. Start the backend server:

   ```bash
   python server.py
   ```

5. Start the frontend development server:

   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## 📸 Screenshots

### Home Page

![Home Page](/json.png)

### Detection Results

![Detection Results](/annotated.png)

## 📁 Project Structure

```
.
├── AI-Backend/
│   ├── server.py
│   ├── app.py
│   ├── requirements.txt
│   └── models/
│       └── yolov8n.pt
├── ui/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
└── README.md
```

## 💡 Usage

1. Open the web application in your browser
2. Click the upload button or drag and drop an image
3. Wait for the AI to process the image
4. View the detected objects with their bounding boxes and confidence scores

## 🙏 Acknowledgments

- [YOLO](https://github.com/ultralytics/yolov5) for the amazing object detection model
- [Next.js](https://nextjs.org/) for the frontend framework
- [Flask](https://flask.palletsprojects.com/) for the backend framework
