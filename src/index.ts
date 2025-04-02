import express, { Request, response, Response } from "express";
import cors from "cors";
import multer, { Multer } from "multer";
import "dotenv/config";

const importDynamic = new Function('modulePath', 'return import(modulePath)');

const storage = multer.memoryStorage();

export const handleImages = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5mb
    },
    fileFilter: (req, file, cb) => {
        if([ "image/jpeg", "image/png", "image/tiff" ].includes(file.mimetype)){
            cb(null, true)
        }else{
            cb(null, false)
        }
    }
});

const uploadedImages = handleImages.fields([
    { name: "selfImage", maxCount: 1 },
    { name: "modelImage", maxCount: 1 }
])

const PORT = 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello TypeScript with Express!");
});

app.post("/api/tryon", uploadedImages, async (req: Request, res: Response) => {
    try{

        const files = req.files as { [ fieldname: string ]: Express.Multer.File[] }

        const selfImage = files["selfImage"]?.[0];
        const modelImage = files["modelImage"]?.[0];

        if (!selfImage || !modelImage) {
            res.status(400).json({ message: "Both images are required" });
            return;
        }

        // Convert Buffer to Blob-like format for Gradio
        const selfImageBlob = new Blob([selfImage.buffer], { type: selfImage.mimetype });
        const modelImageBlob = new Blob([modelImage.buffer], { type: modelImage.mimetype });

        const { Client } = await importDynamic('@gradio/client');
        const client = await Client.connect(process.env.CLIENT_CONN);
        const result = await client.predict("/tryon", [		
            {
                "background": selfImageBlob,
                "layers":[],
                "composite":null
            }, // undefined  in 'Human. Mask with pen or use auto-masking' Imageeditor component
            modelImageBlob, 	// blob in 'Garment' Image component		
            "", // string  in 'parameter_17' Textbox component		
            true, // boolean  in 'Yes' Checkbox component		
            true, // boolean  in 'Yes' Checkbox component		
            30, // number  in 'Denoising Steps' Number component		
            42, // number  in 'Seed' Number component
        ]);


        res.status(200).json(result.data)

    }catch(error){
        console.log(error);
        res.status(500).json(error)
    }
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
