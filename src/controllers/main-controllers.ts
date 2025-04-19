import { Request, Response } from "express";
const importDynamic = new Function('modulePath', 'return import(modulePath)');


export const generateImage = async (req: Request, res: Response) => {
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
}