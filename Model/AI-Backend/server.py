from fastapi import FastAPI, File, UploadFile, Query
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
from io import BytesIO
from starlette.responses import StreamingResponse, JSONResponse

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load a pretrained YOLO model
model = YOLO("yolov11n.pt")

@app.post("/detect")
async def detect_objects(
    file: UploadFile = File(...),
    is_image: bool = Query(False, description="Set to true to return annotated image")
):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Resize the image
    image_resized = cv2.resize(image, (800, 800))

    # Run inference on the resized image
    results = model(image_resized)

    if is_image:
        # Create an annotated image
        annotated_image = results[0].plot()

        # Convert the annotated image to a binary stream
        _, buffer = cv2.imencode('.jpg', annotated_image)
        image_stream = BytesIO(buffer)

        # Return the annotated image as a response
        return StreamingResponse(image_stream, media_type="image/jpeg")
    else:
        # Prepare the detection results
        detections = []
        class_names = model.names  # Fetch class names from the model
        for result in results[0].boxes:
            detection = {
                "label": class_names[int(result.cls.item())],
                "confidence": float(result.conf.item()),
                "bounding_box": result.xyxy.tolist()[0]
            }
            detections.append(detection)

        return JSONResponse(content={"detections": detections})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)