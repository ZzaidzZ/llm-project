from fastapi import APIRouter, UploadFile, Depends
from pydantic import BaseModel, UUID4
from langchain_text_splitters import RecursiveCharacterTextSplitter
from PIL import Image
from io import BytesIO
from utils import get_uploads_directory
import os
from vectordb.pineconedb import PineconeVectorDB
from models.embed import EmbeddingModel
from utils import as_form, setup_uploads_directory
from .document_parser import parse_text_document, is_img


@as_form
class EncodeRequestValidator(BaseModel):
    document: UploadFile
    project_title: str
    project_id: UUID4


class EmbeddingRouter(APIRouter):
    def __init__(self):
        self.router = APIRouter(prefix='/api')
        self.vectordb = PineconeVectorDB()
        
        self.router.add_api_route('/encode-doc/', self.encode_document, methods=["POST"])
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=50,
            length_function=len
        )
        self.embedding_model = EmbeddingModel()
        self.uploads_directory = setup_uploads_directory()
        
    
    async def encode_document(self, input_data: EncodeRequestValidator = Depends()):
        if not is_img(input_data.document):
            text = parse_text_document(input_data.document)
            texts = self.text_splitter.create_documents([text])
            chunks = self.text_splitter.split_documents(texts)
            vectors = []
            for chunk_id, chunk in enumerate(chunks):
                embedding = self.embedding_model.encode_text(chunk.page_content)
                vectors.append({
                    "id": f"{input_data.project_id}_{chunk_id}",
                    "values": embedding.squeeze(0), # From [1,512] to 1-D [512] Embedding
                    "metadata": {
                        "fyp-id": str(input_data.project_id),
                        "text": chunk.page_content,
                        "chunk-id": chunk_id,
                        "title": input_data.project_title,
                        "source": "report"
                    }
                })
            self.vectordb.upsert_vectors(vectors)
            
            return True
        
        contents = await input_data.document.read()
        img = Image.open(BytesIO(contents))
        embedding = self.embedding_model.encode_image(img).squeeze(0)
        vectors = [{
            "id": f"{input_data.project_id}_poster",
            "values": embedding,
            "metadata": {
                "fyp-id": str(input_data.project_id),
                "title": input_data.project_title,
                "source": "poster"
            }
        }]
        self.vectordb.upsert_vectors(vectors)
        img.save(os.path.join(self.uploads_directory, "images", f'{input_data.project_id}.png'))
        print(embedding.shape)
        
        return True
        