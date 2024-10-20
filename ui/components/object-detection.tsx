"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Detection {
	label: string;
	confidence: number;
	bounding_box: number[];
}

interface DetectionResult {
	detections: Detection[];
}

export function ObjectDetectionComponent() {
	const [file, setFile] = useState<File | null>(null);
	const [imageResult, setImageResult] = useState<string | null>(null);
	const [jsonResult, setJsonResult] = useState<DetectionResult | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showImage, setShowImage] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setFile(event.target.files[0]);
			setError(null);
		}
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!file) {
			setError("Please select an image file.");
			return;
		}

		setIsLoading(true);
		setError(null);
		setImageResult(null);
		setJsonResult(null);

		const formData = new FormData();
		formData.append("file", file);

		try {
			if (showImage) {
				const imageResponse = await axios.post(
					"http://127.0.0.1:5000/detect?is_image=true",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
						responseType: "blob",
					}
				);
				const imageUrl = URL.createObjectURL(imageResponse.data);
				setImageResult(imageUrl);
			} else {
				const jsonResponse = await axios.post(
					"http://127.0.0.1:5000/detect",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);
				setJsonResult(jsonResponse.data);
			}
		} catch (error) {
			console.error("Error:", error);
			setError("An error occurred while processing the image.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-3xl mx-auto">
			<CardHeader>
				<CardTitle>Object Detection</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="image">Upload Image</Label>
						<Input
							id="image"
							type="file"
							onChange={handleFileChange}
							accept="image/*"
						/>
					</div>
					<div className="flex items-center space-x-2">
						<Switch
							id="show-image"
							checked={showImage}
							onCheckedChange={setShowImage}
						/>
						<Label htmlFor="show-image">Show annotated image</Label>
					</div>
					<Button type="submit" disabled={!file || isLoading}>
						{isLoading ? "Processing..." : "Detect Objects"}
					</Button>
				</form>
				{error && (
					<Alert variant="destructive" className="mt-4">
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				{jsonResult && (
					<div className="mt-4">
						<h3 className="text-lg font-semibold mb-2">Detected Objects:</h3>
						<pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
							{JSON.stringify(jsonResult, null, 2)}
						</pre>
					</div>
				)}
				{showImage && imageResult && (
					<div className="mt-4">
						<h3 className="text-lg font-semibold mb-2">Annotated Image:</h3>
						<img
							src={imageResult}
							alt="Annotated"
							className="max-w-full h-auto rounded-md"
						/>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
